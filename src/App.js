import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  IconButton,
  Input,
  SkeletonText,
  Text,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes } from 'react-icons/fa'

import {
  useJsApiLoader,
  GoogleMap,
  Marker,
  Autocomplete,
  useLoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState, useCallback, useEffect } from 'react'
import React from 'react'

const center = {lat:54.976489, lng:-1.60786674}


function App() {
 /*  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY,
    libraries: ['places'],
  }) */
  const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: process.env.REACT_APP_GOOGLE_MAPS_API_KEY, 
     libraries: ['places'],
   });

  const [map, setMap] = useState(/** @type google.maps.Map */ (null))
  const [directionsResponse, setDirectionsResponse] = useState(null)
  const [distance, setDistance] = useState('')
  const [duration, setDuration] = useState('')
  const [temperature, setTemperature] = useState("")
  const [icon, setIcon] = useState("")
  const [markers, setMarkers] = useState()
  const [SNE, setSNE] = useState({lat:54.976489, lng:-1.60786674});


  /* useEffect(()=>{
    getWeather(SNE)
  },[]) */

  /** @type React.MutableRefObject<HTMLInputElement> */
  const originRef = useRef()
  /** @type React.MutableRefObject<HTMLInputElement> */
  const destiantionRef = useRef()
  useEffect(()=>{
    getWeather(markers)
    calculateRoute()
 },[markers])
 useEffect(()=>{
   getWeather(SNE)
},[])
  /* if (!isLoaded) {
    return <SkeletonText />
  } */
  
  const iconURL = (iconName) => `http://openweathermap.org/img/wn/${iconName}@2x.png`;

  

  const getWeather = async(lat) => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat.lat}&lon=${lat.lng}&appid=1c1726b14949cd9be2b66664ee76ae60`)
      const data = await response.json()
      setTemperature(data.main.temp)
      setIcon(data.weather[0].icon)
      /* console.log(data.weather[0].icon)
      console.log(data) */
  }
  const onMapClick =((e) => {
    setMarkers({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),  },
    );
    /* calculateRoute() */
  });
  console.log("SNE", SNE)
  console.log("markers", markers)
  /* getWeather(SNE) */
  async function calculateRoute() {
    /* if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    } */
    console.log("infunc", SNE , markers)
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      /* origin: originRef.current.value,
      destination: destiantionRef.current.value, */
      origin: markers,
      destination: SNE,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    /* originRef.current.value = ''
    destiantionRef.current.value = '' */
  }
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      <div className='weatherBox'>
        <p>Sustainable North East</p>
        <img src={iconURL(icon)} alt="icon" />
        <p>{`${temperature}C`}</p>
    </div> 
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        {/* Google Map Box */}
        <GoogleMap
        id='map'
          center={center}
          zoom={8}
          mapContainerStyle={{ width: '100%', height: '100%' }}
          options={{
            zoomControl: true,
            streetViewControl: false,
            mapTypeControl: false,
            fullscreenControl: false,
          }}
          onLoad={onMapLoad}
          onClick={onMapClick}
        >
          <Marker position={center} />
          {directionsResponse && (
            <DirectionsRenderer directions={directionsResponse} />
          )}
        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        minW='container.md'
        zIndex='1'
      >
        <HStack spacing={2} justifyContent='space-between'>
          {/* <Box flexGrow={1}>
            <Autocomplete>
              <Input type='text' placeholder='Origin' ref={originRef} />
            </Autocomplete>
          </Box>
          <Box flexGrow={1}>
            <Autocomplete>
              <Input
                type='text'
                placeholder='Destination'
                ref={destiantionRef}
              />
            </Autocomplete>
          </Box> */}

          <ButtonGroup>
            {/* <Button colorScheme='pink' type='submit' onClick={calculateRoute}>
              Calculate Route
            </Button> */}
            <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
          <Text>Sustainable North East </Text>
          <Text>kf6013</Text>
        </HStack>
        <HStack spacing={4} mt={4} justifyContent='space-between'>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          {/* <IconButton
            aria-label='center back'
            icon={<FaLocationArrow />}
            isRound
            onClick={() => {
              map.panTo(center)
              map.setZoom(15)
            }}
          /> */}
        </HStack>
      </Box>
    </Flex>
  )
}

export default App
