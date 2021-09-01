const fs = require('fs');
const tmp = require('tmp');
const _ = require('lodash');

class Config {
    constructor() {
        if (!Config.data) {
            console.log("Using config for Clowder at: " + process.env.ACG_CONFIG)
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
        var topics = new(Map);
        if (Config.data.kafka){
            Config.data.kafka.topics.forEach(function (val){
                topics[val.requestedName] = val;
            })
        }
        return topics;
    }

    KafkaServers() {
        var brokers = new(Array);
        if (Config.data.kafka){
            Config.data.kafka.brokers.forEach(function (val){
                brokers.push(val.hostname + ":" + val.port)
            })
        }
        return brokers;
    }

    ObjectBuckets() {
        var buckets = new(Map);
        if (Config.data.objectStore){
            Config.data.objectStore.buckets.forEach(function (val){
                buckets[val.requestedName] = val
            })
        }
        return buckets;
    }

    DependencyEndpoints() {
        var dependencyEndpoints = {};
        if (Config.data.endpoints) {
            _.forEach(Config.data.endpoints, val => {
                if (!_.has(dependencyEndpoints, val.app)) {
                    dependencyEndpoints[val.app] = {};
                }
                dependencyEndpoints[val.app][val.name] = val
            })
        }
        return dependencyEndpoints;
    }

    PrivateDependencyEndpoints() {
        var privateDependencyEndpoints = {};
        if (Config.data.privateEndpoints){
            _.forEach(Config.data.privateEndpoints, val => {
                if (!_.has(privateDependencyEndpoints, val.app)) {
                    privateDependencyEndpoints[val.app] = {};
                }
                privateDependencyEndpoints[val.app][val.name] = val
            })
        }
        return privateDependencyEndpoints;
    }
}

function IsClowderEnabled() {
    return Boolean(process.env.ACG_CONFIG)
}

cfg = new(Config)

module.exports.LoadedConfig = cfg.LoadedConfig();
module.exports.KafkaTopics = cfg.KafkaTopics();
module.exports.KafkaServers = cfg.KafkaServers();
module.exports.ObjectBuckets = cfg.ObjectBuckets();
module.exports.DependencyEndpoints = cfg.DependencyEndpoints();
module.exports.PrivateDependencyEndpoints = cfg.PrivateDependencyEndpoints();
module.exports.IsClowderEnabled = IsClowderEnabled;
