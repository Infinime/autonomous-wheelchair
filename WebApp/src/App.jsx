/* eslint-disable react/jsx-no-target-blank */
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import { useState, useEffect } from "react";
import pauseButton from '/svgs/Pause.svg'
import recordButton from '/svgs/Record.svg'
import battery from '/svgs/battery.svg'
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

  useEffect(() => {
    if (!recordingBlob) return;
    // recordingBlob will be present at this point after 'stopRecording' has been called

    //send the blob to whisper to decipher
  }, [recordingBlob]);

  
  const addAudioElement = (blob) => {
    const url = URL.createObjectURL(blob);
    const audio = document.createElement("audio");
    audio.src = url;
    audio.controls = true;
    document.body.appendChild(audio);
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

          <div className="w-6/12 h-fit flex flex-row gap-2 pt-3 align-middle items-center p-2 bg-zinc-300 rounded-[18px] border border-black" >
            <img src={battery} className="ml-4" />
            <div className="  text-black text-xl font-bold font-['Inter'] leading-none">
              72%
            </div>
            <div className="w-6 h-6 ml-12 bg-teal-800 rounded-full" />
            <div className="  text-black text-2xl font-bold font-['Inter'] leading-none">
              Connection Status
            </div>
            <div className="w-6 h-6 ml-10 bg-red-600 rounded-full" />
            <div className=" text-black text-2xl font-bold font-['Inter'] leading-none">
              Navigating to:{" "}
            </div>
          </div>

          <div className=" mt-10 flex flex-col items-center">
            <button className="h-fit" onClick={!isRecording?startRecording:stopRecording} >
              <img className=" transition ease-linear" src={!isRecording?recordButton:pauseButton} width={"90px"}/>
            </button>
            <p className=" text-center text-black text-3xl font-semibold font-['Roboto'] leading-none">
              Record
            </p>
          </div>
          

          <div className="w-6/12 bg-zinc-300 h-2/6 rounded-t-[43px] items-center border border-black flex flex-col mt-auto gap-4 pt-0">
            <div className=" text-black text-[32px] font-medium font-['Roboto'] leading-none mt-4">
              Saved Locations
            </div>
            <img
              className="w-10/12 h-3/6 border border-dashed border-slate-800"
              src="https://via.placeholder.com/624x204"
            />
            <div className=" text-center text-black text-xl font-semibold font-['Roboto'] leading-none">
              Engineering
            </div>
            <div className="w-[289px] h-[7px]  justify-center mt-auto mb-1 items-start gap-5 inline-flex">
              <div className="w-[58.70px] h-[7px] bg-slate-600 rounded" />
              <div className="w-[58.70px] h-[7px] bg-gray-100 rounded" />
              <div className="w-[58.70px] h-[7px] bg-gray-100 rounded" />
              <div className="w-[58.70px] h-[7px] bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
