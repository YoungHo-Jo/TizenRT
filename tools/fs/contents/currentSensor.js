var adc = require('adc');

var mVPerAmp = 100;
var openCurrentSensor = function(readInterval, onRead) {
  var pin = adc.open({
      pin: 1,
    }, function(err) {
      if (err) {
        throw err;
      } else {
        
        var maxValue = 0;
        var minValue = 4096;

        setInterval(function() {
          pin.read(function(err, value) {
            if (err) {
              console.log(err)
            } else {
              maxValue = (value > maxValue) ? value : maxValue;
              minValue = (value < minValue) ? value : minValue;
            }
          });
        }, 10);

        var interval = setInterval(function() {

          var voltage = ((maxValue - minValue) * 5.0)/4096.0
          var VRMS = (voltage/2.0) * 0.707;
          var ampsRMS = (VRMS * 1000) / mVPerAmp;

          maxValue = 0;
          minValue = 4096;

          onRead({
            voltage: voltage,
            VRMS: VRMS,
            ampsRMS: ampsRMS
          })

          // pin.read(function(err, value) {
          //   if (err) {
          //     clearInterval(interval);
          //     throw err;
          //   } else {
          //     // var AC_OFFSET = 2500;
          //     // var MV_PER_AMP = 185;
          //     // var voltage = (value/4096.0)*5000;
          //     // var amps = ((voltage - AC_OFFSET)/MV_PER_AMP);
          //     // onRead({
          //     //   voltage: voltage,
          //     //   amps: amps,
          //     //   value: value
          //     // });

          //     // var volt = value * (5.0 / 4096.0)
          //     // var current = (volt - 2.5) * (20 / 2)
          //     // max = value > max ? value : max;
          //     // min = value < min ? value : min;
          //     // onRead({
          //     //   voltage: volt,
          //     //   amps: current,
          //     //   value: value,
          //     //   max: max,
          //     //   min: min
          //     // })

          //     var volt = value * (5.0 / 4096.0);
          //     var current = (volt - 2.5) * 1000 / 100;
          //     max = current > max ? current : max;
          //     avg = (avg + current) / 2.0;
          //     var now = Date.now();
          //     onRead({
          //       voltage: volt,
          //       current: current,
          //       value: value,
          //       max: max,
          //       avg: avg,
          //       now: now
          //     });
          //   }
          // });
        }, readInterval);
      }
    });


  return pin;
}

module.exports = {
  open: openCurrentSensor
};