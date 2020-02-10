// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/
import { audioStream } from './AudioPlayer/FilePlayer';

export function CanvasRecorder(canvas, output_name) {
  this.start = startRecording;
  this.stop = stopRecording;

  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;

  var stream = canvas.captureStream();
  if (typeof stream == undefined || !stream) {
      return;
  }

  function startRecording() {
      let types = [
        "video/mp4",
        'video/webm,codecs=vp9',
        "video/webm",
        'video/vp8',
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "video/mpeg"
      ];

      for (let i in types) {
          if (MediaRecorder.isTypeSupported(types[i])) {
              supportedType = types[i];
              //console.log('Recording with: ', supportedType)
              break;
          }
      }
      if (supportedType == null) {
          //console.log("No supported type found for MediaRecorder");
      }
      let options = { 
          mimeType :  supportedType,
          videoBitsPerSecond: 5000000 // 8.5Mbps
      };

      recordedBlobs = [];
      //console.log('video stream in recorder: ', stream);
      //
      if(audioStream && audioStream.getAudioTracks()[0]){
        console.log('audio stream in recorder: ', audioStream);
        stream.addTrack(audioStream.getAudioTracks()[0]);
      }
      //console.log('combined in recorder: ', stream);
      try {
          mediaRecorder = new MediaRecorder(stream, options);
      } catch (e) {
          alert('MediaRecorder is not supported by this browser.');
          //console.error('Exception while creating MediaRecorder:', e);
          return;
      }

      //console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      mediaRecorder.onstop = handleStop;
      mediaRecorder.ondataavailable = handleDataAvailable;
      mediaRecorder.start(100); // collect 100ms of data blobs
      //console.log('MediaRecorder started', mediaRecorder);
  }

  function handleDataAvailable(event) {
      if (event.data && event.data.size > 0) {
          recordedBlobs.push(event.data);
      }
  }

  function handleStop() {
      
  }

  function stopRecording() {
      mediaRecorder.stop();
      return download()
  }

  function download() {
      const name = output_name + '.webm';
      const blob = new Blob(recordedBlobs, {type: supportedType} );
      //console.log('the blob: ', blob)
      //blob.name = name
      //blob.lastModifiedDate = new Date();
      //return blob
      return new File([blob], name)

      /*
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.style.display = 'none';
      a.href = url;
      a.download = name;
      document.body.appendChild(a);
      a.click();
      setTimeout(() => {
          document.body.removeChild(a);
          window.URL.revokeObjectURL(url);
      }, 100);
      */
  }
}