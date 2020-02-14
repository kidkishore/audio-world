import axios from 'axios';

export const SendFile = (name, file, callback ) => {
  const data = new FormData();
  console.log('handling file upload: ', file);
// If file selected
  if ( file ) {
    data.append( 'webmVideo', file, name);
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
              //console.log( 'Max size: 25MB');
            } else {
              //console.log( response.data );
// If not the given file type
              //console.log( response.data.error);
            }
          } else {
            // Success
            //console.log( 'File upload success');
            var file_name = response.data.image
            createTranscoderJob(file_name, callback);
          }
        }
      }).catch( ( error ) => {
      // If another error
      console.log( error );
    });
  } else {
    // if file not selected throw error
    //console.log( 'Please upload file' );
  }
}

const createTranscoderJob = (fileName, callback) => {

  var newFileName = fileName + '.mp4';
 // console.log('createTranscoderJob on: ', fileName)

  var params = {
    inputKey: fileName,
    outputKey: newFileName
  }

  axios.post('/api/transcoder/create-job', params)
  .then(function (response) {
    //console.log(response);
    callback(newFileName);
  })
  .catch(function (error) {
    //console.log(error);
  });
}

const sendEmail = (fileName, email) => {
  //console.log("Transcoding success: ",fileName);
  //console.log('email to send: ', email);

  const params = {
    fileName: 'converted/' + fileName,
    email: email
  }

  axios.post('/api/emailer/send-email', params)
  .then(function (response) {
    //console.log('Email send success!!')
  })
  .catch(function (error) {
    //console.log(error);
  });



} 
