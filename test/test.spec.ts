import * as path from 'path';
import { expect } from 'chai';
import { IsClowderEnabled } from '../index';
import { Config } from '../index';

describe('config()', function () {
  it('should have the right config', function () {
    process.env.ACG_CONFIG = path.resolve(__dirname, '../test.json');
    const config = new Config();
    const loadedConfig = config.LoadedConfig();
    const dependencyEndpoints = config.DependencyEndpoints();
    const privateEndpoints = config.PrivateDependencyEndpoints();
    const objectBuckets = config.ObjectBuckets();
    const kafkaTopics = config.KafkaTopics();
    const kafkaServers = config.KafkaServers();

    expect(IsClowderEnabled()).to.be.equal(true);
    expect(loadedConfig).to.be.not.undefined;

    expect(loadedConfig.tlsCAPath).to.be.equal('tlsPath');

    expect(dependencyEndpoints['app1']['endpoint1'].port).to.be.equal(8000);
    expect(dependencyEndpoints['app2']['endpoint2'].name).to.be.equal(
      'endpoint2'
    );
    expect(dependencyEndpoints['app2']['endpoint2-1'].port).to.be.equal(8000);
    expect(dependencyEndpoints['app2']['endpoint2-1'].name).to.be.equal(
      'endpoint2-1'
    );
    expect(privateEndpoints['app1']['endpoint1'].port).to.be.equal(10000);
    expect(dependencyEndpoints['app2']['endpoint2'].name).to.be.equal(
      'endpoint2'
    );
    expect(privateEndpoints['app2']['endpoint2-1'].name).to.be.equal(
      'endpoint2-1'
    );

    expect(objectBuckets.get('reqname')?.name).to.be.equal('name');

    expect(loadedConfig.database.name).to.be.equal('dbBaseName');
    expect(loadedConfig.database.hostname).to.be.equal('hostname');
    expect(loadedConfig.database.username).to.be.equal('username');
    expect(loadedConfig.database.password).to.be.equal('password');
    expect(loadedConfig.database.port).to.be.equal(5432);
    expect(loadedConfig.database.pgPass).to.be.equal('testing');
    expect(loadedConfig.database.adminUsername).to.be.equal('adminusername');
    expect(loadedConfig.database.adminPassword).to.be.equal('adminpassword');
    expect(loadedConfig.database.rdsCa).to.be.equal('ca');
    expect(loadedConfig.database.sslMode).to.be.equal('verify-full');

    expect(loadedConfig.kafka.brokers[0].port).to.be.equal(27015);
    expect(kafkaTopics.get('originalName')?.name).to.be.equal('someTopic');
    expect(kafkaServers[0].hostname).be.equal('broker-host');
    expect(kafkaServers[0].port).be.equal(27015);
    expect(kafkaServers[0].caCert).to.be.equal('kafkaca');
    expect(loadedConfig.kafka.brokers[0].saslConfig.username).to.eq('test');
    expect(loadedConfig.kafka.brokers[0].saslConfig.password).to.eq('test');
    expect(loadedConfig.kafka.brokers[0].saslConfig.saslMechanism).to.eq(
      'scram'
    );
    expect(loadedConfig.kafka.brokers[0].saslConfig.securityProtocol).to.eq(
      'scram'
    );
    expect(loadedConfig.kafka.brokers[0].securityProtocol).to.eq('scram');

    expect(loadedConfig.inMemoryDb.hostname).to.be.equal('hostname');
    expect(loadedConfig.inMemoryDb.username).to.be.equal('username');
    expect(loadedConfig.inMemoryDb.password).to.be.equal('password');
    expect(loadedConfig.inMemoryDb.port).to.be.equal(3131);

    expect(loadedConfig.featureFlags.hostname).to.be.equal(
      'ff-server.server.example.com'
    );

    delete process.env.ACG_CONFIG;
  });
});
