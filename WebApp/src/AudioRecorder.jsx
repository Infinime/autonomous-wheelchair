import { useState, useRef, useEffect} from "react";
const AudioRecorder = () => {
  const [permission, setPermission] = useState(false);
  const [stream, setStream] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaRecorder, setMediaRecorder] = useState(null);
  let chunks = [];
  let audioCtx;
  let soundClips = [];
  const [canvas,setCanvas] = useState() ;
  const [canvasCtx,setCanvasCtx] = useState(null);
  const [mainSection,setMainSection] =useState(null);
  const[isFirstPass, setIsFirstPass] = useState(true);


    const getMicrophonePermission = async () => {
    if ("MediaRecorder" in window) {
      try {
        const streamData = await navigator.mediaDevices.getUserMedia({
          audio: true,
          video: false,
        });
        setPermission(true);
        setStream(streamData);
        setCanvas(document.querySelector(".visualizer"));
        setMainSection( document.querySelector(".main-controls"));
        setMediaRecorder(new MediaRecorder(streamData));
        
      } catch (err) {
        alert(err.message);
      }
    } else {
      alert("The MediaRecorder API is not supported in your browser.");
    }
  };

  const startRecording = async () => {
    if (isFirstPass) {
        await getMicrophonePermission();
        setIsFirstPass(false);
    }
    visualize(stream);
    setIsRecording(true);
    mediaRecorder.start();
    console.log(mediaRecorder.state);
    visualize(stream)
    console.log("recorder started");
    //   record.style.background = "red";

    //   stop.disabled = false;
    //   record.disabled = true;
  };
  const stopRecording = () => {
    mediaRecorder.stop();
    setIsRecording(false);
    console.log(mediaRecorder.state);
    console.log("recorder stopped");
    //   record.style.background = "";
    //   record.style.color = "";
    //   // mediaRecorder.requestData();

    //   stop.disabled = true;
    //   record.disabled = false;
  };

  useEffect(() =>{
        mediaRecorder.ondataavailable = function (e) {
        chunks.push(e.data);
      };
      mediaRecorder.onstop = function (e) {
        console.log("data available after MediaRecorder.stop() called.");
    
        const clipName = prompt(
          "Enter a name for your sound clip?",
          "My unnamed clip"
        );
    
        const clipContainer = document.createElement("article");
        const clipLabel = document.createElement("p");
        const audio = document.createElement("audio");
        const deleteButton = document.createElement("button");
    
        clipContainer.classList.add("clip");
        audio.setAttribute("controls", "");
        deleteButton.textContent = "Delete";
        deleteButton.className = "delete";
    
        if (clipName === null) {
          clipLabel.textContent = "My unnamed clip";
        } else {
          clipLabel.textContent = clipName;
        }
    
        clipContainer.appendChild(audio);
        clipContainer.appendChild(clipLabel);
        clipContainer.appendChild(deleteButton);
        soundClips.push(clipContainer);
    
        audio.controls = true;
        const blob = new Blob(chunks, { type: "audio/ogg; codecs=opus" });
        chunks = [];
        const audioURL = window.URL.createObjectURL(blob);
        audio.src = audioURL;
        console.log("recorder stopped");
    
        deleteButton.onclick = function (e) {
          e.target.closest(".clip").remove();
        };
    
        clipLabel.onclick = function () {
          const existingName = clipLabel.textContent;
          const newClipName = prompt("Enter a new name for your sound clip?");
          if (newClipName === null) {
            clipLabel.textContent = existingName;
          } else {
            clipLabel.textContent = newClipName;
          }
        };
      };
  },[mediaRecorder]);


  function visualize(stream) {
    if (!audioCtx) {
      audioCtx = new AudioContext();
    }
    setCanvasCtx(canvas.getContext("2d"));
    const source = audioCtx.createMediaStreamSource(stream);

    const analyser = audioCtx.createAnalyser();
    analyser.fftSize = 2048;
    const bufferLength = analyser.frequencyBinCount;
    const dataArray = new Uint8Array(bufferLength);

    source.connect(analyser);
    //analyser.connect(audioCtx.destination);

    draw();

    function draw() {
      const WIDTH = canvas.width;
      const HEIGHT = canvas.height;

      requestAnimationFrame(draw);

      analyser.getByteTimeDomainData(dataArray);

      canvasCtx.fillStyle = "rgb(200, 200, 200)";
      canvasCtx.fillRect(0, 0, WIDTH, HEIGHT);

      canvasCtx.lineWidth = 2;
      canvasCtx.strokeStyle = "rgb(0, 0, 0)";

      canvasCtx.beginPath();

      let sliceWidth = (WIDTH * 1.0) / bufferLength;
      let x = 0;

      for (let i = 0; i < bufferLength; i++) {
        let v = dataArray[i] / 128.0;
        let y = (v * HEIGHT) / 2;

        if (i === 0) {
          canvasCtx.moveTo(x, y);
        } else {
          canvasCtx.lineTo(x, y);
        }

        x += sliceWidth;
      }

      canvasCtx.lineTo(canvas.width, canvas.height / 2);
      canvasCtx.stroke();
    }
  }

  window.onresize = function () {
    canvas.width = mainSection.offsetWidth;
  };

//   window.onresize();

  return (
    <div className="mt-3">
      <main>
        <header>
          <h1>Web dictaphone</h1>
        </header>
        <section className="main-controls">
          <canvas className="visualizer" height="60px"></canvas>

          <div className="audio-controls">

            <button
              className="record mr-3  text-white font-bold text-lg border bg-black  border-white rounded-lg p-1"
              disabled={!permission && !isFirstPass}
              onClick={!isRecording ?startRecording:stopRecording}
            >
              Record
            </button>
          </div>
        </section>

        <section className="sound-clips">
            {soundClips}
        </section>
      </main>
    </div>
  );
};
export default AudioRecorder;
