var storage = require('azure-storage');

var accessKey = 'sDN4LdQ12UP7TF967XZMmoDrUN54tEJXjlTpgk3HaYZfBZPHQhqZkcAohZlcFwObM7xuWsfqCharVgzIMv83Ww==';
var storageAccount= 'inteliotstorage';
var blobService = storage.createBlobService(storageAccount, accessKey);
var containerName = 'iot-container';

blobService.createContainerIfNotExists(containerName, function(err, result, response) {
    if (err) {
        console.log("Couldn't create container %s", containerName);
        console.error(err);
    } else {
        if (result) {
            console.log('Container %s created', containerName);
        } else {
            console.log('Container %s already exists', containerName);
        }

var fs = require('fs');
var fileName = 'hello-intel.txt';
var blobName = 'iot-file-blob';
blobService.getBlobToLocalFile(
    containerName,
    blobName,
    fileName,
    function(err, blob) {
        if (err) {
            console.error("Couldn't download blob %s", blobName);
            console.error(err);
        } else {
            console.log("Successfully downloaded blob %s to %s", blobName, fileName);
            fs.readFile(fileName, function(err, fileContents) {
                if (err) {
                    console.error("Couldn't read file %s", fileName);
                    console.error(err);
                } else {
                    console.log(fileContents);
                }
            });
        }
    });


    }
});

