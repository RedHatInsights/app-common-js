const fs = require('fs');
const tmp = require('tmp');

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
        var i;
        if (Config.data.kafka){
            for (i = 0; i < Config.data.kafka.topics.length; i++) {
                let curTopic = Config.data.kafka.topics[i];
                topics[curTopic.requestedName] = curTopic;
            } 
        }
        return topics;
    }

    ObjectBuckets() {
        var buckets = new(Map);
        var i;
        if (Config.data.objectStore){
            for (i = 0; i < Config.data.objectStore.buckets.length; i++) {
                let curBucket = Config.data.objectStore.buckets[i];
                buckets[curBucket.requestedName] = curBucket;
            } 
        }
        return buckets;
    }

    DependencyEndpoints() {
        var dependencyEndpoints = new(Map);
        var i;
        if (Config.data.endpoints){
            for(i = 0; i < Config.data.endpoints.length; i++){
                let curEndpoint = Config.data.endpoints[i];
                if (!dependencyEndpoints.has(curEndpoint.app)) {
                    dependencyEndpoints[curEndpoint.app] = new(Map);
                }
                dependencyEndpoints[curEndpoint.app][curEndpoint.name] = curEndpoint;
            }
        }
        return dependencyEndpoints;
    }
}

cfg = new(Config)

module.exports.LoadedConfig = cfg.LoadedConfig();
module.exports.KafkaTopics = cfg.KafkaTopics();
module.exports.ObjectBuckets = cfg.ObjectBuckets();
module.exports.DependencyEndpoints = cfg.DependencyEndpoints();
