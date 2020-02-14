const express = require( 'express' );
const aws = require( 'aws-sdk' );
const path = require( 'path' );
var nodemailer = require('nodemailer');

const router = express.Router();

var s3 = new aws.S3({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
	region : 'us-west-2'
});

var ses = new aws.SES({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
	region : 'us-west-2'
});

function getS3File(bucket, key) {
  return new Promise(function (resolve, reject) {
    console.log(key);
      s3.getObject(
          {
              Bucket: "audioworld-recordings",
              Key: key
          },
          function (err, data) {
              if (err){
                return reject(err);
              }
              else{
                return resolve(data);
              }
          }
      );
  })
}



/**
 * @route POST /api/profile/webm-video-upload
 * @desc Upload post image
 * @access public
 */
router.post( '/send-email', ( req, res ) => {
  console.log("EMAIL REQ");
  getS3File('audioworld-recordings', req.body.fileName)
        .then(function (fileData) {
          console.log('GOT FILE DATA: ', fileData)

          var mailOptions = {
            from: 'audioworld-recordings@gmail.com',
            subject: 'This is an email sent from a NodeJS function!',
            html: `<p>You got a contact message from: <b>$NO ONE</b></p>`,
            to: 'audioworld-recordings@gmail.com',
            // bcc: Any BCC address you want here in an array,
        };

        console.log('Creating SES transporter');
        // create Nodemailer SES transporter
        var transporter = nodemailer.createTransport({
            SES: ses
        });

        // send email
        transporter.sendMail(mailOptions, function (err, info) {
            if (err) {
                console.log(err);
                console.log('Error sending email');
                res.json( {
                  data: err
                } );
            } else {
                console.log('Email sent successfully');
                res.json( {
                  data: info
                } );
            }
        });


        })
        .catch(function (error) {
          console.log(error);
          console.log('Error getting attachment from S3');
          res.json( {
            data: error
          } );
      });



});

module.exports = router;