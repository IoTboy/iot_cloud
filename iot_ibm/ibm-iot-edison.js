// A sample IBM Internet of Things Cloud Quickstart Service client for Intel Edison

var mqtt = require('mqtt');
var fs = require('fs');
var configFile = "./device.cfg";


var port = 1883;
var broker;
var topic;
var client;

require('getmac').getMac(function(err, macAddress) {
    if (err) throw err;
    
    macAddress = macAddress.toString().replace(/:/g, '').toLowerCase();

    require('properties').parse(configFile, { path: true }, function (err, config){
        var options = {};

        // If device.cfg was loaded successfully update the configuarion
        if(config){

            if(config['auth-method']){
                if(config['auth-method'] !== "token"){
                    throw "Authentication method not supported. Please make sure you use \"token\".";
                }
                if(config['auth-method'] && !config['auth-token']){
                    throw "Authentication method set to \"token\" but no \"auth-token\" setting was provided in device.cfg";
                }

                options.username = config['username']; // Actual value of options.username can be set to any string
                options.password = config['auth-token'];
            }

            if(!config.org){
                throw "Configuration should include an org field that specifies your organization.";
            }

            if(!config.type){
                throw "Configuration should include a type field that specifies your device type.";
            }

            if(!config.id){
                throw "Configuration should include an id field that specifies your device id.";
            }

            console.log("Configuration loaded successfully, connecting your device to the registered service.");

            organization = config.org;
            deviceType = config.type;
            macAddress = config.id;

            broker = organization + ".messaging.internetofthings.ibmcloud.com";
        }
        else {
            console.log("No configuration file found, connecting to the quickstart service.");
        }
        
        options.clientId = "d:" + organization + ":" + deviceType + ":" + macAddress;
        client = mqtt.createClient(port, broker, options);
        topic = "iot-2/evt/status/fmt/json";

        var interval = setInterval(sendMessage,1000);

        if(config){
            client.subscribe('/iot-2/cmd/+/fmt/json');

            client.on('message', function(topic, message) {
                console.log('Received command on topic: ' + topic);
                
                var msg;
                try {
                    msg = JSON.parse(message);
                }
                catch (e) {
                    msg = {};
                    console.log("Couldn't parse received command. Please ensure it is valid JSON.");
                }

                if(msg.hasOwnProperty('send-status')){
                    if(msg['send-status']){
                        if(!interval){
                            interval = setInterval(sendMessage,1000);
                        }
                    }
                    else {
                        clearInterval(interval);
                        interval = false;
                    }
                }
            });
        }
          
        
        console.log("Broker: " + broker);
        console.log("Device ID: " + macAddress);
        console.log("Topic: " + topic);
        console.log("Connection options: ");
        console.log(options);
    });
});

function sendMessage() {
    var message = {};
    message.d = {};
    //read the CPU temp from sysfs
    fs.readFile('/sys/class/hwmon/hwmon5/temp1_input','utf8', function (err, data) {
        if (err) throw err;
        message.d.cputemp = data/1000;
        console.log(message);
        client.publish(topic, JSON.stringify(message));
    });
}

