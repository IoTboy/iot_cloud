var storage = require('azure-storage');

var accessKey = 'sDN4LdQ12UP7TF967XZMmoDrUN54tEJXjlTpgk3HaYZfBZPHQhqZkcAohZlcFwObM7xuWsfqCharVgzIMv83Ww==';
var storageAccount= 'inteliotstorage';
var blobService = storage.createBlobService();
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

   blobService.createBlockBlobFromText(
    containerName,
    'iot-text-blob',
    'Hello, World!',
    function(error, result, response){
        if(error){
            console.log("Couldn't upload string");
            console.error(error);
        } else {
            console.log('String uploaded successfully');
        }
    });