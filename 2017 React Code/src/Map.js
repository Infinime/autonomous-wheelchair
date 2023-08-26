import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";
const containerStyle = {
  width: "100%",
  height: "100%",
  borderRadius : '10px',
  marginBottom : "2rem"
};

const center = {
  lat: 9.5836,
  lng: 6.5463,
};
function Map({ location }) {
  return (
    <LoadScript googleMapsApiKey="AIzaSyBDsQd0v5dn1a9UI1eaM__-eFKRvrgaqbo">
      <GoogleMap mapContainerStyle={containerStyle} center={center} zoom={5}>
        <>
          <Marker
            position={{
              lat: location.LATITUDE,
              lng: location.LONGITUDE,
            }}
          />
        </>
      </GoogleMap>
    </LoadScript>
  );
}

export default React.memo(Map);
