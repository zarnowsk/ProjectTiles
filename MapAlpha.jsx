import React from 'react';
import { GoogleMap, useLoadScript, Marker, MarkerClusterer } from '@react-google-maps/api';

function Map(props) {

  //loading Google Map API script
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.GOOGLE_API_KEY
  });

  //assign default zoom level
  const zoom = 10;

  const renderMap = () => {

    return <GoogleMap
      options={{
        gestureHandling: 'cooperative',
        zoomControl: true,
        streetViewControl: true,
        fullscreenControlOptions: {
          position: google.maps.ControlPosition.TOP_LEFT
        },
      }}
      id='map'
      mapContainerStyle={{
        height: "100%",
        flexGrow: "1"
      }}
      zoom={zoom}
      center={{ lat: Number(props.userLocation.lat), lng: Number(props.userLocation.lng) }}
    >
      {/* <MarkerClusterer
        options={{ imagePath: "https://developers.google.com/maps/documentation/javascript/examples/markerclusterer/m" }}
      >
        {
          (clusterer) => props.geoLocations.map((geoLocation, i) => (
            <Marker
              key={i}
              position={{ lat: geoLocation.lat, lng: geoLocation.lng }}
              clusterer={clusterer}
              clickable={false}
            />
          ))
        }
      </MarkerClusterer> */}

    </GoogleMap>
  }

  if (loadError) {
    return <div>Map cannot be loaded right now, sorry.</div>
  }

  return isLoaded && typeof props.userLocation === 'object' ? renderMap() : null
}

export default Map;