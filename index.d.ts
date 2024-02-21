export interface KafkaTopic {
  requestedName: string;
  name: string;
  consumerGroupName: string;
}

export interface KafkaBroker {
  hostname: string;
  port: number;
  authType: string;
  caCert: string;
  saslConfig: KafkaSaslConfig;
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

export const LoadedConfig: ClowderConfig | undefined;
export const KafkaTopics: Record<string, KafkaTopic>;
export const KafkaServers: Record<string, KafkaBroker>;
export const ObjectBuckets: Record<string, ObjectBucket>;
export const DependencyEndpoints: Record<string, DependencyEndpoint>;
export const PrivateDependencyEndpoints: Record<string, DependencyEndpoint>;
export const IsClowderEnabled: () => boolean;
