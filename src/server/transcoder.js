const express = require( 'express' );
const aws = require( 'aws-sdk' );
const path = require( 'path' );

const router = express.Router();


var elastictranscoder = new aws.ElasticTranscoder({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
	region : 'us-west-2'
});


/**
 * @route POST /api/profile/webm-video-upload
 * @desc Upload post image
 * @access public
 */
router.post( '/create-job', ( req, res ) => {
  console.log("TRANSCODER REQ");
  console.log(req.body);
  var params = {
    PipelineId: '1580962929795-oqv08g',
    OutputKeyPrefix: 'converted/',
    Input: {
      Key: req.body.inputKey
    },
    Output: {
      Key: req.body.outputKey,
      PresetId: '1351620000001-000001' //Generic 1080p
    }
  };

  elastictranscoder.createJob(params, function(err, data) {
    if (err) console.log(err, err.stack); // an error occurred
    else     console.log(data);           // successful response
  });
});

module.exports = router;