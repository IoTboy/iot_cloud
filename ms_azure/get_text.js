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


var blobName = 'iot-text-blob';
blobService.getBlobToText(
    containerName,
    blobName,
    function(err, blobContent, blob) {
        if (err) {
            console.error("Couldn't download blob %s", blobName);
            console.error(err);
        } else {
            console.log("Successfully downloaded blob %s", blobName);
            console.log(blobContent);
        }
    });
