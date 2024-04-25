app-common-js
=============

Simple client access library for the config for the Clowder operator.

Usage
-----

To access configuration, see the following example

Javascript

``` js
const app_config = (acgConfig) ? new (require('app-common-js').Config)() : null;
const loadedConfig = app_config ? app_config.LoadedConfig() : '';
const dependencyEndpoints = app_config ? app_config.DependencyEndpoints() : '';
const privateDepencencyEndpoints = app_config ? app_config.PrivateDependencyEndpoints() : '';
```

Typescript
``` ts
const clowder: Config = new Config();
isClowderEnabled = IsClowderEnabled();
if (isClowderEnabled) {
  const clowderConfig = clowder.LoadedConfig();
  .... doThings();
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
