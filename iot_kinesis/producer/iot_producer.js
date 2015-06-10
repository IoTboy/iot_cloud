'use strict';

function iotProducer(kinesis, config) {

  function _createStreamIfNotCreated(callback) {
    var params = {
      ShardCount : config.shards,
      StreamName : config.stream
    };

    kinesis.createStream(params, function(err, data) {
      if (err) {
        if (err.code !== 'ResourceInUseException') {
          callback(err);
          return;
        }
        else {
          console.log(config.stream + ": Stream already exists. Reusing");
        }
      }
      else {
        console.log(config.stream + ": Stream created.");
      }

      // Poll to make sure stream is in ACTIVE state before start pushing data.
      _waitForStreamToBecomeActive(callback);
    });
  }

  function _waitForStreamToBecomeActive(callback) {
    kinesis.describeStream({StreamName : config.stream}, function(err, data) {
      if (!err) {
        console.log('Current status of the stream is ' + data.StreamDescription.StreamStatus);
        if (data.StreamDescription.StreamStatus === 'ACTIVE') {
          callback(null);
        }
        else {
          setTimeout(function() {
            _waitForStreamToBecomeActive(callback);
          }, 1000 * config.waitBetweenDescribeCallsInSeconds);
        }
      }
    });
  }

  function _writeToKinesis() {
    var currTime = new Date().getMilliseconds();
    var sensor = 'sensor-' + Math.floor(Math.random() * 100000);
    var reading = Math.floor(Math.random() * 1000000);

    var record = JSON.stringify({
      time : currTime,
      sensor : sensor,
      reading : reading
    });

    var recordParams = {
      Data : record,
      PartitionKey : sensor,
      StreamName : config.stream
    };

    kinesis.putRecord(recordParams, function(err, data) {
      if (err) {
        console.log(err);
      }
      else {
        console.log('Successfully sent data to Kinesis.');
      }
    });
  }

  return {
    run: function() {
      _createStreamIfNotCreated(function(err) {
        if (err) {
          console.log('Error creating stream: ' + err);
          return;
        }
        var count = 0;
        while (count < 10) {
          setTimeout(_writeToKinesis(), 1000);
          count++;
        }
      });
    }
  };
}

module.exports = iotProducer;

