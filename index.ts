import * as fs from 'fs';
import * as tmp from 'tmp';
import _ from 'lodash';

export interface KafkaTopic {
  requestedName: string;
  name: string;
  consumerGroupName: string;
}

export interface KafkaBroker {
  hostname: string;
  port: number;
  authtype: string;
  cacert: string;
  sasl: KafkaSaslConfig;
  securityProtocol: string;
}

export interface KafkaSaslConfig {
  username: string;
  password: string;
  saslMechanism: string;
  securityProtocol: string;
}

export interface Endpoint {
  name: string;
  app: string;
  hostname?: string;
  port?: number;
  tlsPort?: number;
}

export interface DependencyEndpoint {
  [key: string]: {
    [key: string]: Endpoint;
  };
}

export interface ObjectBucket {
  accessKey: string;
  secretKey: string;
  requestedName: string;
  name: string;
  region: string;
  tls: boolean;
  endpoint: string;
}

export interface ClowderConfig {
  webPort: number;
  metricsPort: number;
  metricsPath: string;
  tlsCAPath: string;
  logging: {
    type: string;
    cloudwatch: {
      accessKeyId: string;
      secretAccessKey: string;
      region: string;
      logGroup: string;
    };
  };
  kafka: {
    brokers: KafkaBroker[];
    topics: KafkaTopic[];
  };
  inMemoryDb: {
    hostname: string;
    password: string;
    port: number;
    username: string;
  };
  database: {
    name: string;
    username: string;
    password: string;
    hostname: string;
    port: number;
    pgPass: string;
    adminUsername: string;
    adminPassword: string;
    rdsCa: string;
    sslMode: string;
  };
  objectStore: {
    hostname: string;
    port: number;
    accessKey: string;
    secretKey: string;
    tls: false;
    buckets: ObjectBucket[];
  };
  featureFlags: {
    hostname: string;
    port: number;
  };
  endpoints: Endpoint[];
  privateEndpoints: Endpoint[];
}

export class Config {
  acgConfig: string = process.env.ACG_CONFIG || '';
  data: ClowderConfig = <ClowderConfig>{};

  clowderDisabled = () => {
    return !IsClowderEnabled();
  };

  configFileMissing = () => {
    const fileExists = fs.existsSync(this.acgConfig);
    return !fileExists;
  };

  configNotPopulated = () => {
    const hasData = Object.keys(this.data).length > 0;
    return !hasData;
  };

  getRdsCa = () => {
    const tmpobj = tmp.fileSync({
      prefix: 'prefix-',
      mode: 0o644,
      postfix: '.txt',
    });
    fs.writeFileSync(tmpobj.name, this.data.database.rdsCa, 'utf8');
    return tmpobj.name;
  };

  constructor() {
    if (this.configFileMissing()) {
      console.info(
        '[clowder]: Unable to load ACG_CONFIG at: ' + process.env.ACG_CONFIG
      );
      return;
    }

    if (this.clowderDisabled()) {
      console.info('[clowder]: Clowder is not loaded. Bailing out.');
      return;
    }

    if (this.configNotPopulated()) {
      console.info(
        '[clowder]: Using config for Clowder at: ' + process.env.ACG_CONFIG
      );
      let rawdata = fs.readFileSync(this.acgConfig);
      let jsonObject = JSON.parse(rawdata.toString());
      this.data = jsonObject;
    }
    return this;
  }

  LoadedConfig() {
    return this.data;
  }

  KafkaTopics() {
    let topics = new Map<string, KafkaTopic>();
    if (this.data && this.data.kafka) {
      this.data.kafka.topics.forEach((val) => {
        topics.set(val.requestedName, val);
      });
    }
    return topics;
  }

  KafkaServers() {
    let brokers: KafkaBroker[] = [];
    if (this.data && this.data.kafka) {
      this.data.kafka.brokers.forEach((val) => {
        let broker: KafkaBroker = <KafkaBroker>{};
        broker.hostname = val.hostname;
        broker.port = val.port;
        broker.authtype = val.authtype;
        broker.cacert = val.cacert;
        broker.sasl = val.sasl;
        broker.securityProtocol = val.securityProtocol;
        brokers.push(broker);
      });
    }
    return brokers;
  }

  ObjectBuckets() {
    var buckets = new Map<string, ObjectBucket>();
    if (this.data && this.data.objectStore) {
      this.data.objectStore.buckets.forEach((val) => {
        buckets.set(val.requestedName, val);
      });
    }
    return buckets;
  }

  DependencyEndpoints() {
    var dependencyEndpoints: DependencyEndpoint = {};
    if (this.data && this.data.endpoints) {
      _.forEach(this.data.endpoints, (val) => {
        if (!_.has(dependencyEndpoints, val.app)) {
          dependencyEndpoints[val.app] = {};
        }
        dependencyEndpoints[val.app][val.name] = val;
      });
    }
    return dependencyEndpoints;
  }

  PrivateDependencyEndpoints() {
    var privateDependencyEndpoints: DependencyEndpoint = {};
    if (this.data && this.data.privateEndpoints) {
      _.forEach(this.data.privateEndpoints, (val) => {
        if (!_.has(privateDependencyEndpoints, val.app)) {
          privateDependencyEndpoints[val.app] = {};
        }
        privateDependencyEndpoints[val.app][val.name] = val;
      });
    }
    return privateDependencyEndpoints;
  }
}

export const IsClowderEnabled = () => {
  return process.env.ACG_CONFIG !== undefined && process.env.ACG_CONFIG !== '';
};
