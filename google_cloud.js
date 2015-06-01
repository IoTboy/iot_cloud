var projectId = process.env.GCLOUD_PROJECT_ID; // set up a system variable in /etc/profile

var gcloud = require('gcloud')({
  projectId: projectId, // copy from google console
  keyFilename: '/path/to/key.json'
});

var dataset = gcloud.datastore.dataset();

var key = dataset.key({
        namespace: 'ns-iot',
        path: ['Platform', 'Edison']
        });

var iotTestData = {
  title: 'IoT test data',
  tags: ['edison', 'galileo'],
  author: 'Kona',
  isDraft: true,
  sensorCount: 45,
  temp: 75.6
};

dataset.save({
  key: key,
  // method: 'insert', // force the method to 'insert'
  // method: 'update', // force the method to 'update'
  data: iotTestData
}, function(err) {
        if (!err) {
        console.log("Test data saved");
    }
 });

 dataset.get(key, function(err, entity, apiResponse) {
console.log(err || entity);
});

// dataset.delete(key, function(err) {});  // Delete all entities with the specified key(s)