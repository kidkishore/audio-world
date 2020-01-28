// CanvasRecorder.js - smusamashah
// To record canvas effitiently using MediaRecorder
// https://webrtc.github.io/samples/src/content/capture/canvas-record/

export function CanvasRecorder(canvas, video_bits_per_sec) {
  this.start = startRecording;
  this.stop = stopRecording;

  var supportedType = null;
  var mediaRecorder = null;

  var stream = canvas.captureStream();
  if (typeof stream == undefined || !stream) {
      return;
  }

  const video = document.createElement('video');
  video.style.display = 'none';

  function startRecording() {
      let types = [
        "video/webm",
        'video/webm,codecs=vp9',
        'video/vp8',
        "video/webm;codecs=vp8",
        "video/webm;codecs=daala",
        "video/webm;codecs=h264",
        "video/mpeg"
      ];

      for (let i in types) {
          if (MediaRecorder.isTypeSupported(types[i])) {
              supportedType = types[i];
              break;
          }
      }
      if (supportedType == null) {
          console.log("No supported type found for MediaRecorder");
      }
      let options = { 
          mimeType :  'video/webm;codecs=h264',
          videoBitsPerSecond: video_bits_per_sec || 2500000 // 2.5Mbps
      };

      try {
          mediaRecorder = new RecordRTC(stream, options);
      } catch (e) {
          alert('MediaRecorder is not supported by this browser.');
          console.error('Exception while creating MediaRecorder:', e);
          return;
      }

      console.log('Created MediaRecorder', mediaRecorder, 'with options', options);
      mediaRecorder.startRecording();
      console.log('MediaRecorder started', mediaRecorder);
  }


  function stopRecording() {
    mediaRecorder.stopRecording(function(url) {
      video.src = url;
      video.download = 'video.webm';
      convertStreams(mediaRecorder.getBlob());
    });   
  }

  var workerPath = 'https://archive.org/download/ffmpeg_asm/ffmpeg_asm.js';
  if(document.domain == 'localhost') {
      workerPath = location.href.replace(location.href.split('/').pop(), '') + 'ffmpeg_asm.js';
  }
  function processInWebWorker() {
      var blob = URL.createObjectURL(new Blob(['importScripts("' + workerPath + '");var now = Date.now;function print(text) {postMessage({"type" : "stdout","data" : text});};onmessage = function(event) {var message = event.data;if (message.type === "command") {var Module = {print: print,printErr: print,files: message.files || [],arguments: message.arguments || [],TOTAL_MEMORY: message.TOTAL_MEMORY || false};postMessage({"type" : "start","data" : Module.arguments.join(" ")});postMessage({"type" : "stdout","data" : "Received command: " +Module.arguments.join(" ") +((Module.TOTAL_MEMORY) ? ".  Processing with " + Module.TOTAL_MEMORY + " bits." : "")});var time = now();var result = ffmpeg_run(Module);var totalTime = now() - time;postMessage({"type" : "stdout","data" : "Finished processing (took " + totalTime + "ms)"});postMessage({"type" : "done","data" : result,"time" : totalTime});}};postMessage({"type" : "ready"});'], {
          type: 'application/javascript'
      }));
      var worker = new Worker(blob);
      URL.revokeObjectURL(blob);
      return worker;
  }
  var worker;

  function convertStreams(videoBlob) {
    var aab;
    var buffersReady;
    var fileReader = new FileReader();
    fileReader.onload = function() {
        aab = this.result;
        postMessage();
    };
    fileReader.readAsArrayBuffer(videoBlob);
    if (!worker) {
        worker = processInWebWorker();
    }
    worker.onmessage = function(event) {
        var message = event.data;
        if (message.type == "ready") {
            if (buffersReady)
                postMessage();
        } else if (message.type == "stdout") {
            console.log('stdout');
        } else if (message.type == "start") {
          console.log('start')
        } else if (message.type == "done") {
            var result = message.data[0];
            console.log('done');
            var blob = new File([result.data], 'test.mp4', {
                type: 'video/mp4'
            });
            PostBlob(blob);
        }
    };
    var postMessage = function() {
        worker.postMessage({
            type: 'command',
            arguments: '-i video.webm -c:v mpeg4 -b:v 6400k -strict experimental output.mp4'.split(' '),
            files: [
                {
                    data: new Uint8Array(aab),
                    name: 'video.webm'
                }
            ]
        });
    };
  }


  function PostBlob(blob) {
    console.log('posted blob');
      const name = 'recording.mpeg';
      const url = URL.createObjectURL(blob);
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

  }
}