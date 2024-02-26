import * as fs from 'fs';
import * as tmp from 'tmp';
import _ from 'lodash';
import {
  ClowderConfig,
  KafkaBroker,
  KafkaTopic,
  DependencyEndpoint,
  ObjectBucket,
} from '.';

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
        broker.authType = val.authType;
        broker.caCert = val.caCert;
        broker.saslConfig = val.saslConfig;
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