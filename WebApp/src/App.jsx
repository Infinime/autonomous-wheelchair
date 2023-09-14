/* eslint-disable react/jsx-no-target-blank */

import { useState, useEffect } from "react";
import pauseButton from "/svgs/Pause.svg";
import recordButton from "/svgs/Record.svg";
import stopButton from "/svgs/Stop.svg";
import resumeButton from "/svgs/Play.svg";
import battery from "/svgs/battery.svg";
import left from "/svgs/left-arrow.svg";
import right from "/svgs/right-arrow.svg";
import "./App.css";
import { AudioRecorder, useAudioRecorder } from "react-audio-voice-recorder";
import { saveAs } from "file-saver";
import axios from "axios";
import * as fs from "node:fs";

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
  const [locations, setLocations] = useState([]); // [ {name: "Engineering", location: "37.865101,  -119.538330 "}]

  //read file from locations.txt at start
  // useEffect(() => {
  //   const data = fs.readFileSync('locations.txt', 'utf8')
  //   console.log(data)
  //   // add to locations
  //   const lines = data.split('\n')
  //   const newLocations = []
  //   for (let i = 0; i < lines.length; i++) {
  //     const line = lines[i]
  //     const [name, location] = line.split(' ')
  //     newLocations.push({ name, location })
  //   }
  //   setLocations(newLocations)
  // }, [])
  // const addPlace = (name, location) => {
  //   //add to locations
  //   setLocations([...locations, { name, location }]);
  //   //write to file
  //   fs.appendFileSync('locations.txt', `${name} ${location}\n`)
  // };

  //check to see if esp32 is connected
  const isConnectedToEsp32 = async () => {
    //ping esp32
    //if response is received setIsConnected(true)
    fetch("http://192.168.1.97/")
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
          setIsConnected(true);
        } else {
          console.log("error");
        }
      })
      .catch((error) => {
        alert(
          "An error has occured when trying to connect to the ESP, here's some more info.",
          error
        );
        console.log("network error: " + error);
      });
  };

  useEffect(() => {
    if (!recordingBlob) return;
    // recordingBlob will be present at this point after 'stopRecording' has been called

    // saveAs(recordingBlob, "recording.webm");
    const audioStream = recordingBlob.stream;
    let formData = new FormData();

    formData.append("file", this.file);

    // axios
    //   .post("<WHISPER_API>", formData, {
    //     headers: {
    //       "Content-Type": "multipart/form-data",
    //     },
    //   })
    //   .then(function () {
    //     console.log("SUCCESS!!");
    //   })
    //   .catch(function () {
    //     console.log("FAILURE!!");
    //   });
  }, [recordingBlob]);

  // useEffect(() =>{
  //   if(recordingTime >= 30){
  //     stopRecording();
  //   }
  // },[recordingTime, stopRecording]);

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
            <div
              className={
                " w-5 h-5 lg:w-6 lg:h-6 lg:ml-12 rounded-full" +
                (isConnected ? " bg-emerald-800 " : " bg-red-600")
              }
            />
            <div className="  text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              {isConnected ? " Connected" : "Disconnected"}
            </div>
            <span className="material-symbols-outlined lg:ml-10">
              conversion_path
            </span>
            <div className=" text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              Status:{" "}
            </div>
          </div>
          {!isConnected ? (
            <button
              className="border border-black  bg-emerald-600  text-white mt-4 mb-4"
              onClick={isConnectedToEsp32}
            >
              Connect to ESP32
            </button>
          ) : null}
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

          <div className="lg:w-3/12 bg-zinc-300 h-fit rounded-t-3xl lg:rounded-t-[43px] items-center border border-black flex flex-col mt-auto gap-1 pt-0">
            <div className=" text-black text-[32px] font-medium font-['Roboto'] leading-none mt-4 mx-2">
              Commands List
            </div>
            <div className="flex flex-row flex-wrap justify-center items-center align-middle p-0 w-full pl-3 pr-3  h-4/6">
              {/* <img src={left} className="h-10" /> */}
              <ol className="text-xl text-left flex flex-col w-full">
                <li className=" border-b border-black bg-[#b1afaf]">
                  Move Forward
                </li>
                <li className=" border-b border-black bg-[#b1afaf]">
                  Move Backward
                </li>
                <li className=" border-b border-black bg-[#b1afaf]">
                  Turn Left
                </li>
                <li className=" border-b border-black bg-[#b1afaf]">
                  Turn Right
                </li>
                <li className=" border-b border-black bg-[#b1afaf]">Stop</li>
                <li className=" border-b border-black bg-[#b1afaf]">
                  Slow Down
                </li>
                <li className=" border-b border-black bg-[#b1afaf]">
                  Speed Up
                </li>
              </ol>
              {/* <img src={right} className="h-10" /> */}
            </div>
            <div className=" text-center text-black text-xl mt-1 font-semibold font-['Roboto'] leading-none">
              Engineering
            </div>
            <div className="w-6/12 h-2   justify-center mt-auto mb-1 items-start gap-5 inline-flex">
              <div className="w-3/12 h-1 bg-slate-600 rounded" />
              <div className="w-3/12 h-1 bg-gray-100 rounded" />
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default App;
