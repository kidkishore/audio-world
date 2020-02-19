const express = require( 'express' );
const aws = require( 'aws-sdk' );
const path = require( 'path' );
var Poller = require( './Poller' );

const router = express.Router();

var s3 = new aws.S3({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
  Bucket: 'audioworld-recordings',
  region : 'us-west-2'
});


var elastictranscoder = new aws.ElasticTranscoder({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
	region : 'us-west-2'
});


//get object from s3
var getObject = (data, getObjectCallback) => {

  var obj = 'converted/' + data.Job.Input.Key + '.mp4';
  var params = {
    Bucket:'audioworld-recordings',
    Key: obj
  };

  let poller = new Poller(1000); 

  poller.onPoll(() => {
  
      s3.headObject(params, function (err, metadata) {  
        if (err && err.code === 'NotFound') {  
          poller.poll(); // Go for the next poll
          // Handle no object on cloud here  
        } else {  
          s3.getSignedUrl('getObject', params, getObjectCallback);  
        }
      });

      
  });

  poller.poll();
}


/**
 * @route POST /api/transcoreder/create-job
 * @desc Upload post image
 * @access public
 */
router.post( '/create-job', ( req, res ) => {
  console.log("TRANSCODER REQ");
  var params = {
    PipelineId: '1580962929795-oqv08g',
    OutputKeyPrefix: 'converted/',
    Input: {
      Key: req.body.inputKey
    },
    Output: {
      Key: req.body.outputKey,
      //PresetId: '1351620000001-000001' //Generic 1080p
      PresetId: '1581306493281-keouoz', //custom keep
    }
  };

  elastictranscoder.createJob(params, function(err, data) {
    if (err){
      console.log(err, err.stack); // an error occurred
      res.json( {
        data: err
      } );
    } 
    else{
      console.log('TRANSCORDER SUCCESS');

      getObject(data, function (err, metadata) {  
          console.log('TRYING TO GET OBJECT')
          if (err && err.code === 'NotFound') {  
            console.log(err)
            // Handle no object on cloud here  
          } else {  
            console.log(metadata)//success
            res.json( {
              data: data
            } );
          }
        });

      
    }
  });

});




module.exports = router;