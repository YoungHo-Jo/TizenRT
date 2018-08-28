var uart = require('uart');

var serial3 = uart.open({
    device: "/dev/ttyS3",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log('TTYS2: Open Success');
      serial3.on('data', function(data) {
        console.log('TTYS3 Read: ', data.toString());
      });

      setInterval(function() {
        serial3.writeSync('hi', function(err) {
          console.log('ERROR: TTYS3');
        })
      }, 2000);

    }
});


var serial1 = uart.open({
    device: "/dev/ttyS1",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log('TTYS1: Open Success');
      serial1.on('data', function(data) {
        var str = data.toString();


        if(str.length == 22) {
          console.log(data.toString());
        } else if(str.indexOf("E") != -1) {
          console.log('end');
        }

      });

      setInterval(function() {
        serial1.write('hi', function(err) {
          console.log('ERROR: TTYS1');
        })
      }, 2000);

    }
});


var serial0 = uart.open({
    device: "/dev/ttyS0",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log('TTYS0: Open Success');
      serial0.on('data', function(data) {
        console.log('TTYS0 Read ', data.toString());
      });

      setInterval(function() {
        serial0.write('hi', function(err) {
          console.log('ERROR: TTYS0');
        })
      }, 2000);

    }
});


var serial2 = uart.open({
    device: "/dev/ttyS2",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log('TTYS2: Open Success');
      serial2.on('data', function(data) {
        console.log('TTYS2 Read ', data.toString());
      });

      setInterval(function() {
        serial2.write('hi', function(err) {
          console.log('ERROR: TTYS2');
        })
      }, 2000);

    }
});

var serial4 = uart.open({
    device: "/dev/ttyS4",
    baudRate: 9600,
    dataBits: 8, 
  }, function(err) {
    if (err) {
      console.error(err);
      process.exit(1);
    } else {
      console.log('TTYS4: Open Success');
      serial4.on('data', function(data) {
        console.log('TTYS4 Read ', data.toString());
      });

      setInterval(function() {
        serial4.write('hi', function(err) {
          console.log('ERROR: TTYS4');
        })
      }, 2000);
    }
});
