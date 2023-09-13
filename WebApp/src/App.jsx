/* eslint-disable react/jsx-no-target-blank */
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState, useEffect } from "react";
import pauseButton from "/svgs/Pause.svg";
import recordButton from "/svgs/Record.svg";
import stopButton from "/svgs/Stop.svg";
import resumeButton from "/svgs/Play.svg";
import battery from "/svgs/battery.svg";
import left from "/svgs/left-arrow.svg";
import right from "/svgs/right-arrow.svg";
// import AudioRecorder from './AudioRecorder';
import "./App.css";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";

// import Record from './components/Record'

function App() {
  const {
    startRecording,
    stopRecording,
    togglePauseResume,
    recordingBlob,
    isRecording,
    isPaused,
    recordingTime,
    mediaRecorder,
  } = useAudioRecorder();

  const [isNavigating, setIsNavigating] = useState(false);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    if (!recordingBlob) return;
    // recordingBlob will be present at this point after 'stopRecording' has been called
    alert("Recording has occured");

    //send the blob to whisper to decipher

    //after receiving "confirma"
    // check for whether it's in list of saved places

    //if not saved prompt to save
    let shouldSave = prompt("Do you want to save the current location in list");
  }, [recordingBlob]);

  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
  };

  const parseTime = (num) => {
    return (
      Math.floor(num / 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      }) +
      ":" +
      (num % 60).toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      })
    );
  };
  return (
    <>
      {/* <AudioRecorder 
    onRecordingComplete={addAudioElement}
    audioTrackConstraints={{
      noiseSuppression: true,
      echoCancellation: true,
    }} 
    downloadOnSavePress={false} 
    downloadFileExtension="webm"/> */}
      <div className="container h-screen w-screen m-auto overflow-hidden p-0">
        <div className=" flex flex-col h-full   pt-3 justify-end gap-10  shrink-0 items-center">
          <div className="w-11/12 lg:w-6/12 h-fit flex flex-row gap-1  pt-3 align-middle items-center p-2 bg-zinc-300 rounded-lg lg:rounded-[18px] border border-black">
            <img src={battery} className="lg:ml-4 w-3" />
            <div className="  text-black lg:text-xl font-bold font-['Inter'] leading-none">
              72%
            </div>
            <div className=" w-5 h-5 lg:w-6 lg:h-6 lg:ml-12 bg-teal-800 rounded-full" />
            <div className="  text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              Connected
            </div>
            <div className="w-6 h-6 lg:ml-10 bg-red-600 rounded-full" />
            <div className=" text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              Navigating to:{" "}
            </div>
          </div>

          <div className=" mt-10 flex flex-col items-center">
            <div className="flex flex-row mb-2 transition">
              <button
                className="h-fit"
                onClick={!isRecording ? startRecording : stopRecording}
              >
                <img
                  className=" transition ease-linear"
                  src={!isRecording ? recordButton : stopButton}
                  width={"90px"}
                />
              </button>
              {isRecording ? (
                <button className="h-fit ml-3" onClick={togglePauseResume}>
                  <img
                    className=" transition ease-linear"
                    src={!isPaused ? pauseButton : resumeButton}
                    width={"90px"}
                  />
                </button>
              ) : null}
            </div>
            <p className=" text-center text-black text-3xl font-semibold font-['Roboto'] leading-none">
              {!isRecording && !isPaused ? "Record" : parseTime(recordingTime)}
            </p>
          </div>

          <div className="lg:w-6/12 bg-zinc-300 h-2/6 rounded-t-3xl lg:rounded-t-[43px] items-center border border-black flex flex-col mt-auto gap-1 pt-0">
            <div className=" text-black text-[32px] font-medium font-['Roboto'] leading-none mt-4">
              Saved Locations
            </div>
            <div className="flex flex-row flex-wrap justify-between items-center align-middle p-0 w-full pl-3 pr-3  h-4/6">
              <img src={left} className="h-10" />
              <img
                className="w-10/12 h-full border border-dashed border-slate-800"
                src="https://via.placeholder.com/624x204"
              />
              <img src={right} className="h-10" />
            </div>
            <div className=" text-center text-black text-xl font-semibold font-['Roboto'] leading-none">
              Engineering
            </div>
            <div className="w-6/12 h-2   justify-center mt-auto mb-1 items-start gap-5 inline-flex">
              <div className="w-3/12 h-1 bg-slate-600 rounded" />
              <div className="w-3/12 h-1 bg-gray-100 rounded" />
              <div className="w-3/12 h-1 bg-gray-100 rounded" />
              <div className="w-3/12 h-1 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
