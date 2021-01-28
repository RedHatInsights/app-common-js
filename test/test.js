const { fileSync } = require('tmp');
const fs = require('fs');

var expect = require('chai').expect;

describe('config()', function () {
  it('should have the right config', function () {
    
    var config = require('../index');
    
    expect(config.LoadedConfig).to.be.not.undefined;
    expect(config.LoadedConfig.kafka.brokers[0].port).to.be.equal(27015)
    expect(config.KafkaTopics["originalName"].name).to.be.equal("someTopic")
    expect(config.DependencyEndpoints["app1"]["endpoint1"].port).to.be.equal(8000)
    expect(config.DependencyEndpoints["app2"]["endpoint2"].name).to.be.equal("endpoint2")
    expect(config.PrivateDependencyEndpoints["app1"]["endpoint1"].port).to.be.equal(10000)
    expect(config.PrivateDependencyEndpoints["app2"]["endpoint2"].name).to.be.equal("endpoint2")
    expect(config.ObjectBuckets["reqname"].name).to.be.equal("name")
    expect(config.KafkaServers[0]).to.be.equal("broker-host:27015")
    data = fs.readFileSync(config.LoadedConfig.rdsCa(), "utf8")
    expect(data).to.be.equal("ca")
    expect(config.IsClowderEnabled()).to.be.equal(true)
    expect(config.LoadedConfig.featureFlags.hostname).to.be.equal("ff-server.server.example.com")
  });
});
