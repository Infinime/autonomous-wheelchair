import AgentMap from "./Map";
import React, { useState, useEffect } from "react";
import axios from "axios";

const App = () => {
  const [location, setLocation] = useState(null);
  const [temp, setTemp] = useState("null");
  const [loading, setLoading] = useState(true);
  const fetchData = async () => {
    await axios
      .get(
        "https://automated-wheel-chair-default-rtdb.firebaseio.com/test.json"
      )
      .then((res) => {
        setLocation(res.data);
        setTemp(res.data.TEMPERATURE);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchData();
    if (!loading) {
    }

    try {
    } catch (error) {
      console.log(error.message);
      setLoading(false);
    }
  }, [loading]);
  if (!loading) {
    return (
      <div className="p-4  bg-purple-900 h-screen">
        <div className="h-1/6 grid gap-6 grid-cols-2 items-stretch">
          <div className="p-4   flex flex-col justify-between rounded-xl shadow-md bg-white">
            <div className="font-medium"> Temperature</div>
            <div><i className="fas fa-thermometer-three-quarters"></i> {temp} °C</div>
          </div>
          <div className="p-4 flex flex-col justify-between rounded-xl shadow-md bg-white">
            <div className="font-medium">Location(<small>Last Seen</small>)</div>
            <div><i className="fas fa-map-marker-alt"></i> Minna, Nigeria</div>
          </div>
        </div>
        <div className="map h-5/6 pb-5 mt-5 text-white rounded-xl">
          <AgentMap location={location} />
        </div>
      </div>
    );
  } else {
    return <div className="loading"> <div className="animate-spin rounded-2xl h-20 w-20 bg-purple-900"></div> </div>;
  }
};

export default App;
