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
import axios from "axios";
// import * as fs from "node:fs";
import OpenAI from 'openai';
const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY, // defaults to process.env["OPENAI_API_KEY"]
  dangerouslyAllowBrowser: true,
});

const VITE_OPENAI_API_KEY = import.meta.env.VITE_OPENAI_API_KEY;
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

  const [status, setStatus] = useState("At Rest");
  const[espIp, setEspIp] = useState("");
  const [isConnected, setIsConnected] = useState(false);
  const [command, setCommand] = useState("stop");

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
    fetch("http://"+espIp+"/")
      .then((response) => {
        if (response.status === 200) {
          console.log("success");
          setIsConnected(true);
        } else {
          console.log("error");
          setIsConnected(false);
        }
      })
      .catch((error) => {
        alert(
          "An error has occured when trying to connect to the ESP, here's some more info.",
          error
          );
          setIsConnected(false);
        console.log("network error: " + error);
      });
  };

  useEffect(() => {
    if (!recordingBlob) return;

    let formData = new FormData();
    const file = new File([recordingBlob], "input.wav", { type: "audio/wav" });
    formData.append("file",file);
    formData.append("model","whisper-1")
    formData.append("language","en")


      const requestOptions = {
        method: 'POST',
        headers: { "Authorization": "Bearer " +VITE_OPENAI_API_KEY },
        body: formData
    };
    try{
    fetch('https://api.openai.com/v1/audio/transcriptions', requestOptions)
        .then(response => response.json())
        .then(data => {console.log(data);setCommand(data.text); });
      }catch(e){
          console.log(e)
        }
      isConnectedToEsp32();
  }, [recordingBlob]);


  useEffect(() =>{
    if(isConnected == false){
      return;
    }
    if(command.toLowerCase().includes("forward") ){
      fetch("http://"+espIp+"/m/f").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Moving Forward");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });

    }
    else if(command.toLowerCase().includes("backward") ){
      fetch("http://"+espIp+"/m/b").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Moving Backward");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }
    else if(command.toLowerCase().includes("left") ){
      fetch("http://"+espIp+"/t/l").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Turning Left");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }
    else if(command.toLowerCase().includes("right") ){
      fetch("http://"+espIp+"/t/r").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Turning Right");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }
    else if(command.toLowerCase().includes("stop") ){
      fetch("http://"+espIp+"/stop").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Stopped");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }
    else if(command.toLowerCase().includes("speed")&& command.toLowerCase().includes("up") ){
      fetch("http://"+espIp+"/s/u").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Speeding up");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }
    else if(command.toLowerCase().includes("slow")&& command.toLowerCase().includes("down") ){
      fetch("http://"+espIp+"/s/l").then((response) => {
        if (response.status === 200) {
          console.log("success");
          setStatus("Slowing Down");
        } else {
          console.log("error");
        }
      }).catch((error) => {
        console.log("network error: " + error);
      });
    }else{
      setStatus("Invalid Command");
    }
  },[command,isConnected]);


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
          <div className="w-11/12 lg:w-8/12 h-fit flex flex-row gap-1  pt-3 align-middle items-center p-2 bg-zinc-300 rounded-lg lg:rounded-[18px] border border-black">
            <img src={battery} className="lg:ml-4 w-3" />
            <div className="  text-black lg:text-xl font-bold font-['Inter'] leading-none">
              72%
            </div>
            <div
              className={
                " w-5 h-5 lg:w-6 lg:h-6 lg:ml-5 rounded-full" +
                (isConnected ? " bg-emerald-800 " : " bg-red-600")
              }
            />
            <div className="  text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              {isConnected ? " Connected" : "Disconnected"}
            </div>
            <span className="material-symbols-outlined ml-1 lg:ml-8">
              conversion_path
            </span>
            <div className=" text-black lg:text-2xl font-bold font-['Inter'] leading-none">
              Status:
            </div><h4 className=" text-sm lg:text-lg font-medium">{status}</h4>
          </div>
          {!isConnected ? (
            <div className="flex flex-row gap-2 justify-center items-center">
              <input type="text" className="w-4/12 h-fit border-black border rounded-md"  value={espIp} onChange={(e)=>{console.log(e.target.value);setEspIp(e.target.value);} } placeholder="IP from ESP" id="inputBtn"/>
            <button
              className="border border-black  bg-emerald-600  text-white mt-4 mb-4  rounded-md"
              onClick={isConnectedToEsp32}
            >
              Connect to ESP32
            </button>
            </div>

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
            {/*<div className=" text-center text-black text-xl mt-1 font-semibold font-['Roboto'] leading-none">
              Engineering
            </div>*/}
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
