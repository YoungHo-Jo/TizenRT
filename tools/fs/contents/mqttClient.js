var mqtt = require('mqtt');

var opts = {
  host: '192.168.4.1',
  port: 1884,
  keepalive: 10,
  clientId: 'Smart Plug 01'
};

var subscribeOpts = {
  retain: false,
  qos: 0,
};

var topics = {
  switchCommand: "/switch/command",
  currentValue: "/sensor/current/value",
  bluetoothValue: "/sensor/bluetooth/value",
  switchValue: "/switch/value",
  totalValues: "/totalvalues"
}

function subscribe(client, topic) {
  client.subscribe(topic, subscribeOpts, function(error) {
    if (error) {
      console.error(error);
      process.exit(1);
    } else {
      console.log('[MQTT] Subscription Success: ', topic);
    }
  });
}


module.exports = {
  connect: function(onSuccess, onMessage) {
    var client =  mqtt.connect(opts, function() {
      console.log('Connect to ', opts.host);
      // subscribe(client, topics.switchCommand)
      subscribe(client, topics.totalValues)
      subscribe(client, topics.switchCommand)

      client.on('message', function(data) {
        onMessage(data);
      });

      onSuccess();
    });

    return client;
  },
  topics: topics
}