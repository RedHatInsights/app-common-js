app-common-js
=============

Simple client access library for the config for the Clowder operator.

Usage
-----

To access configuration, see the following example

```
loadedConfig = require('app-common-js').LoadedConfig
isClowderEnabled = require('app-common-js').IsClowderEnabled


function test() {
    if IsClowderEnabled() {
        console.Log("Public Port: %s", LoadedConfig.publicPort)
    }
}
```

The ``clowder`` library also comes with several other helpers

* ``KafkaTopics`` - returns a map of KafkaTopics using the requestedName
  as the key and the topic object as the value.
* ``KafkaServers`` - returns a list of Kafka Broker URLs.
* ``ObjectBuckets`` - returns a list of ObjectBuckets using the requestedName
  as the key and the bucket object as the value.
* ``DependencyEndpoints`` - returns a nested map using \[appName\]\[deploymentName\] 
  for the public services of requested applications. 
* ``PrivateDependencyEndpoints`` - returns a nested map using \[appName\]\[deploymentName\] 
  for the private services of requested applications.

Testing
-------

`ACG_CONFIG="test.json" npm test`
