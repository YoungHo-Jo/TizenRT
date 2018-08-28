var uart = require('uart');

var serial = function(onData) {
  var ret = uart.open({
    device: "/dev/ttyS1",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      ret.on('data', function(data) {
        onData(data);
      });
    }
  });

  return ret;
}

var usbSerial = function(onData) {
  var ret = uart.open({
    device: "/dev/ttyS0",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      ret.on('data', function(data) {
        onData(data);
      });
    }
  });

  return ret;
}


module.exports = {
  serial: serial,
  usbSerial: usbSerial
};