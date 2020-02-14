const express = require( 'express' );
const aws = require( 'aws-sdk' );
const multerS3 = require( 'multer-s3' );
const multer = require('multer');
const path = require( 'path' );

const router = express.Router();

/**
 * PROFILE IMAGE STORING STARTS
 */
const s3 = new aws.S3({
	accessKeyId: 'AKIA3NHG3WYRJH3VFP57',
	secretAccessKey: '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',
  Bucket: 'audioworld-recordings',
  region : 'us-west-2'
});

/**
 * Single Upload
 */
const profileImgUpload = multer({
	storage: multerS3({
		s3: s3,
		bucket: 'audioworld-recordings',
		acl: 'public-read',
		key: function (req, file, cb) {
			cb(null, path.basename( file.originalname, path.extname( file.originalname ) ) + '-' + Date.now() + path.extname( file.originalname ) )
		}
	}),
	limits:{ fileSize: 25000000 } // In bytes: 5000000 bytes = 20 MB
}).single('webmVideo');



/**
 * @route POST /api/profile/webm-video-upload
 * @desc Upload post image
 * @access public
 */
router.post( '/webm-video-upload', ( req, res ) => {
	profileImgUpload( req, res, ( error ) => {
		console.log( 'requestOkokok', req.file );
		console.log( 'error', error );
		if( error ){
			console.log( 'errors', error );
			res.json( { error: error } );
		} else {
			// If File not found
			if( req.file === undefined ){
				console.log( 'Error: No File Selected!' );
				res.json( 'Error: No File Selected' );
			} else {
				// If Success
				const imageName = req.file.key;
				const imageLocation = req.file.location;
// Save the file name into database into profile model
				res.json( {
					image: imageName,
					location: imageLocation
				} );
			}
		}
	});
});


module.exports = router;