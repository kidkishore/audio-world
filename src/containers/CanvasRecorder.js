// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/
import { audioStream } from './AudioPlayer/FilePlayer';

export function CanvasRecorder(canvas) {
  this.start = startRecording;
  this.stop = stopRecording;

  var recordedBlobs = [];
  var supportedType = null;
  var mediaRecorder = null;

  var stream = canvas.captureStream(30);
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
          videoBitsPerSecond: 6584000 // 3.5kbps
      };

      recordedBlobs = [];
      //console.log('video stream in recorder: ', stream);
      //
      if(audioStream && audioStream.getAudioTracks()[0]){
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
      const name =  'recording.webm';
      const blob = new Blob(recordedBlobs, {type: supportedType} );
      return new File([blob], name)
  }
}