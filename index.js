const fs = require('fs');
const tmp = require('tmp');
const _ = require('lodash');

class Config {

    clowderDisabled = () => {
        return !IsClowderEnabled();
    }

    configFileMissing = () => {
        const fileExists = fs.existsSync(process.env.ACG_CONFIG);
        return !fileExists;
    }

    configNotPopulated = () => {
        return !Config.data;
    }

    constructor() {
        if (this.configFileMissing()) {
            console.info("[clowder]: Unable to load ACG_CONFIG at: " + process.env.ACG_CONFIG)
            return
        }
        
        if(this.clowderDisabled()) {
            console.info("[clowder]: Clowder is not loaded. Bailing out.")
            return
        }

        if (this.configNotPopulated()) {
            console.info("[clowder]: Using config for Clowder at: " + process.env.ACG_CONFIG)
            let rawdata = fs.readFileSync(process.env.ACG_CONFIG);
            let jsonObject = JSON.parse(rawdata);
            Config.data = jsonObject;
            Config.data.rdsCa = function () {
                const tmpobj = tmp.fileSync({ mode: 0o644, prefix: 'prefix-', postfix: '.txt' });
                fs.writeFileSync(tmpobj.name, Config.data.database.rdsCa, 'utf8')
                return tmpobj.name
            }
        }
    }

    LoadedConfig() {
        return Config.data;
    }

    KafkaTopics() {
        let topics = new(Map);
        if (Config.data && Config.data.kafka){
            Config.data.kafka.topics.forEach(function (val){
                topics[val.requestedName] = val;
            })
        }
        return topics;
    }

    KafkaServers() {
        let brokers = [];
        if (Config.data && Config.data.kafka){
            Config.data.kafka.brokers.forEach(function (val){
                let broker = {}
                broker.hostname = val.hostname;
                broker.port = val.port;
                broker.authType = val.authType;
                broker.caCert = val.caCert;
                broker.saslConfig = val.saslConfig;
                broker.securityProtocol = val.securityProtocol;
                broker.socketAddress = `${val.hostname}:${val.port}`;
                brokers.push(broker);
            })
        }
        return brokers;
    }

    ObjectBuckets() {
        var buckets = new(Map);
        if (Config.data && Config.data.objectStore){
            Config.data.objectStore.buckets.forEach(function (val){
                buckets[val.requestedName] = val
            })
        }
        return buckets;
    }

    DependencyEndpoints() {
        var dependencyEndpoints = {};
        if (Config.data && Config.data.endpoints) {
            _.forEach(Config.data.endpoints, val => {
                if (!_.has(dependencyEndpoints, val.app)) {
                    dependencyEndpoints[val.app] = {};
                }
                dependencyEndpoints[val.app][val.name] = val;
            })
        }
        return dependencyEndpoints;
    }

    PrivateDependencyEndpoints() {
        var privateDependencyEndpoints = {};
        if (Config.data && Config.data.privateEndpoints) {
            _.forEach(Config.data.privateEndpoints, val => {
                if (!_.has(privateDependencyEndpoints, val.app)) {
                    privateDependencyEndpoints[val.app] = {};
                }
                privateDependencyEndpoints[val.app][val.name] = val;
            })
        }
        return privateDependencyEndpoints;
    }
}

cfg = new(Config)

function IsClowderEnabled() {
    return process.env.ACG_CONFIG !== undefined && process.env.ACG_CONFIG !== ''; 
}

module.exports.LoadedConfig = cfg.LoadedConfig();
module.exports.KafkaTopics = cfg.KafkaTopics();
module.exports.KafkaServers = cfg.KafkaServers();
module.exports.ObjectBuckets = cfg.ObjectBuckets();
module.exports.DependencyEndpoints = cfg.DependencyEndpoints();
module.exports.PrivateDependencyEndpoints = cfg.PrivateDependencyEndpoints();
module.exports.IsClowderEnabled = IsClowderEnabled;
