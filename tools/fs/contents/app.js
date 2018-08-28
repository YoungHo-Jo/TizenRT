var mqtt = require('mqttClient');
var EventEmitter = require('events').EventEmitter;

var emitter = new EventEmitter();

var events = {
  testButtonPushed: 'testButtonPushed',
  serialDataReceived: 'serialDataRecv',
  usbSerialDataReceived: 'usbSerialDataRecv',
  powerSwitchRead: 'powerSwitchRead',
  currentRead: 'currentRead',
  mqttConnect: 'mqttConnect',
  publishCurrentValue: 'publishCurrentValue',
  publishBluetoothValue: 'publishBluetoothValue'
}

var topics = mqtt.topics;

var pwSwitchState = {
  on: 'on',
  off: 'off'
}

var values = {
  bt: [],
  amp: '',
  powerState: pwSwitchState.on
}

var isMQTTOpened = false


// ===== //

var pwSwitch = require('powerSwitch').powerSwitch(500, function(value) {
  // console.log('[POWERSWITCH] value: ', value);
  emitter.emit(events.powerSwitchRead, value);
  values.powerState = value ? pwSwitchState.off : pwSwitchState.on;
});

// var testButton = require('powerSwitch').testButton(100, function() {
//   console.log('[BUTTON] Pushed');
//   emitter.emit(events.testButtonPushed);
// });

var serial = require('serial').serial(function(data) {
  try {
    var str = data.toString() 
    if(str.length == 22) {
      // console.log('[SERIAL] data: ', str);
      values.bt.push(str)
    } else if(str.indexOf("E") != -1) {
      // console.log('[SERIAL] end')
      // values.bt.forEach(function(value) {
      //   console.log(value)
      // })
      values.bt = []
    }
  } catch(e) {
    console.log(e)
  }
});

var serial = require('serial').usbSerial(function(data) {
  var str = data.toString()
  console.log('[USB_SERIAL] data: ', str);

  if(str == 'k') {
    console.log('Bye!');
    process.exit(0);
  }  

  if(str == 'o') {
    emitter.emit(events.testButtonPushed);
  }
});

var currentSensor = require('currentSensor').open(500, function(value) {
  // console.log('[CURRENT] value: ', value);
  values.amp = value.ampsRMS
});

var mqttClient = mqtt.connect(function() {
  console.log('[MQTT] Connected to Server')
  isMQTTOpened = true;
}, function(data) {
  console.log('[MQTT] Received: ', data);
  // console.log('[MQTT] Message: ', data.message.toString());
  if(data.topic == topics.totalValues && isMQTTOpened) {
    mqttClient.publish('/values', JSON.stringify(values), { qos: 1 }, function() {
      console.log('[MQTT] PUBLISH ', '/values')
    })
  } else if(data.topic == topics.switchCommand){
    switch(data.message.toString()) {
      case pwSwitchState.on:
        writePwSwitch(false)
        break;
      case pwSwitchState.off:
        writePwSwitch(true)
        break;
      default:

    }
  }
});

// ==== // 


emitter.on(events.testButtonPushed, function() {
  switch(values.powerState) {
    // low-level
    // on == false
    // off = true
    case pwSwitchState.on:
      writePwSwitch(true); 
      break;
    case pwSwitchState.off:
      writePwSwitch(false);
      break;
  }
});

// ==== //

process.on('exit', function() {
  pwSwitch.close();
  serial.close();
  currentSensor.close();
  mqttClient.end();
})


// ==== // 

function writePwSwitch(value) {
  // low-level
  // on == false
  // off == true
  pwSwitch.write(value, function(err) {
    if (err) {
      console.error(err);
    } else {
      console.log('[PWSWITCH] Write: ', value);
    }
  })
}