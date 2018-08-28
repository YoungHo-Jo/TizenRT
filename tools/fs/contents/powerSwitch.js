var gpio = require('gpio');

var testButton = function(readInterval, onPush) {
  return gpio.open({
    pin: 44, // XGPIO15 = GPG17
    direction: gpio.DIRECTION.IN,
    mode: gpio.MODE.PULLDOWN,
  }, function(err, pin) {
    if (err) throw err;
    var interval = setInterval(function() {
      pin.read(function(err, value) {
        if (err) {
          console.log(err);
          clearInterval(interval);
        } else {
          if (value == false) { // Pushed
            onPush();
          }
        }
      });
    }, readInterval);
  });
}

var powerSwitch = function(readInterval, onRead) {
  return gpio.open({
    pin: 55, // XGPIO26 = GPG32
    direction: gpio.DIRECTION.OUT,
    mode: gpio.MODE.PUSHPULL,
  }, function(err, pin) {
    if (err) {
      console.error(err);
      process.exit(1);
      throw err;
    } else {
      setInterval(function() {
        pin.read(function(err, value) {
          if (err) {
            console.error(err);
          } else {
            onRead(value);            
          }
        })
      }, readInterval);
    }
  });
}


module.exports = {
  testButton: testButton,
  powerSwitch: powerSwitch
};
