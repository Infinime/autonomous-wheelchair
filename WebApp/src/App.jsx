/* eslint-disable react/jsx-no-target-blank */
// import { useState } from 'react'
// import reactLogo from './assets/react.svg'
// import viteLogo from '/vite.svg'
import "./App.css";
import recordButton from "./assets/record.svg";
// import Record from './components/Record'

function App() {
  return (
    <>
      <div className="flex flex-col container w-full justify-center align-middle items-center">
        <img
          src={recordButton}
          className="w-24 h-24 mt-12"
          alt="voice control button, click to start directing"
          title="Voice Control Button"
        />
        <div className="text-2xl font-bold mt-4 font-sans">Voice Control</div>

        {/** Sidebar showing saved and recent locations in a rhs sidebar */}
        <div className="flex flex-col justify-center items-center mt-12">
          <div className="text-2xl font-bold font-sans">Saved Locations</div>
          <img
            src="https://via.placeholder.com/335x118"
            className="w-96 h-32 mt-4"
            alt="placeholder image of a map"
            title="Placeholder Image of a Map"
          />
          <div className="text-lg font-semibold font-sans">Engineering</div>
          <div className="flex flex-row justify-center items-center mt-4">
            <div className="w-24 h-0.5 bg-gray-300 rounded"></div>
            <div className="w-24 h-0.5 bg-gray-300 rounded ml-4"></div>
            <div className="w-24 h-0.5 bg-gray-300 rounded ml-4"></div>
            <div className="w-24 h-0.5 bg-gray-300 rounded ml-4"></div>
          </div>
        </div>

        {/** Bottom bar showing the current location and the destination */}
        <div className="flex flex-col justify-center items-center mt-12">
          <div className="text-2xl font-bold font-sans">Current Location</div>
          <div className="text-lg font-semibold font-sans">Engineering</div>
          <div className="text-2xl font-bold font-sans mt-12">Destination</div>
          <div className="text-lg font-semibold font-sans">Engineering</div>
        </div>

        {/* <Record/> */}
      </div>
    </>
  );
}

export default App;
