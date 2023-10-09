const fs = require('fs');
const path = require('path');

var expect = require('chai').expect;

describe('config()', function () {
  it('should have the right config', function () {
    
    process.env.ACG_CONFIG = path.resolve(__dirname, '../test.json')
    var config = require('../index');
    
    expect(config.IsClowderEnabled()).to.be.equal(true)
    expect(config.LoadedConfig).to.be.not.undefined;
    
    expect(config.LoadedConfig.tlsCAPath).to.be.equal("tlsPath")

    expect(config.DependencyEndpoints["app1"]["endpoint1"].port).to.be.equal(8000)
    expect(config.DependencyEndpoints["app2"]["endpoint2"].name).to.be.equal("endpoint2")
    expect(config.DependencyEndpoints["app2"]["endpoint2-1"].port).to.be.equal(8000)
    expect(config.DependencyEndpoints["app2"]["endpoint2-1"].name).to.be.equal("endpoint2-1")
    expect(config.PrivateDependencyEndpoints["app1"]["endpoint1"].port).to.be.equal(10000)
    expect(config.DependencyEndpoints["app2"]["endpoint2"].name).to.be.equal("endpoint2")
    expect(config.PrivateDependencyEndpoints["app2"]["endpoint2-1"].name).to.be.equal("endpoint2-1")

    expect(config.ObjectBuckets["reqname"].name).to.be.equal("name")

    expect(config.LoadedConfig.database.name).to.be.equal("dbBaseName")
    expect(config.LoadedConfig.database.hostname).to.be.equal("hostname")
    expect(config.LoadedConfig.database.username).to.be.equal("username")
    expect(config.LoadedConfig.database.password).to.be.equal("password")
    expect(config.LoadedConfig.database.port).to.be.equal(5432) 
    expect(config.LoadedConfig.database.pgPass).to.be.equal("testing")
    expect(config.LoadedConfig.database.adminUsername).to.be.equal("adminusername")
    expect(config.LoadedConfig.database.adminPassword).to.be.equal("adminpassword")
    expect(config.LoadedConfig.database.rdsCa).to.be.equal("ca")
    expect(config.LoadedConfig.database.sslMode).to.be.equal("verify-full")


    expect(config.LoadedConfig.kafka.brokers[0].port).to.be.equal(27015)
    expect(config.KafkaTopics["originalName"].name).to.be.equal("someTopic")
    expect(config.KafkaServers[0].hostname).be.equal("broker-host")
    expect(config.KafkaServers[0].port).be.equal(27015)
    expect(config.KafkaServers[0].caCert).to.be.equal("kafkaca")
    expect(config.KafkaServers[0].socketAddress).to.be.equal("broker-host:27015")

    expect(config.LoadedConfig.inMemoryDb.hostname).to.be.equal("hostname")
    expect(config.LoadedConfig.inMemoryDb.username).to.be.equal("username")
    expect(config.LoadedConfig.inMemoryDb.password).to.be.equal("password")
    expect(config.LoadedConfig.inMemoryDb.port).to.be.equal(3131)

    
    expect(config.LoadedConfig.featureFlags.hostname).to.be.equal("ff-server.server.example.com")

    data = fs.readFileSync(config.LoadedConfig.rdsCa(), "utf8")
    expect(data).to.be.equal("ca")
    

    delete process.env.ACG_CONFIG
  });
});
