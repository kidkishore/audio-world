import axios from 'axios';

export const SendFile = ( file ) => {
  const data = new FormData();
  console.log('handling file upload: ', file);
// If file selected
  if ( file ) {
    data.append( 'webmVideo', file, file.name );
    axios.post( '/api/profile/webm-video-upload', data, {
      headers: {
        'accept': 'application/json',
        'Accept-Language': 'en-US,en;q=0.8',
        'Content-Type': `multipart/form-data; boundary=${data._boundary}`,
      }
    })
      .then( ( response ) => {
        if ( 200 === response.status ) {
          // If file size is larger than expected.
          if( response.data.error ) {
            if ( 'LIMIT_FILE_SIZE' === response.data.error.code ) {
              console.log( 'Max size: 25MB');
            } else {
              console.log( response.data );
// If not the given file type
              console.log( response.data.error);
            }
          } else {
            // Success
            let fileName = response.data;
            console.log( 'filedata', fileName );
            console.log( 'File Uploaded');
            createTranscoderJob(response);
          }
        }
      }).catch( ( error ) => {
      // If another error
      console.log( error );
    });
  } else {
    // if file not selected throw error
    console.log( 'Please upload file' );
  }
}

const createTranscoderJob = (s3Data) => {
  console.log("origResponse: ", s3Data);

  var params = {
    inputKey: s3Data.data.image,
    outputKey: s3Data.data.image.substr(0, s3Data.data.image.indexOf('.')) + '.mp4'
  }

  axios.post('/api/transcoder/create-job', params)
  .then(function (response) {
    console.log("Transcoding success: ",response);
  })
  .catch(function (error) {
    console.log(error);
  });
}
