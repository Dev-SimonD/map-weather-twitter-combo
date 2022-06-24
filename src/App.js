import {
  Box,
  ButtonGroup,
  Flex,
  HStack,
  Image,
  IconButton,
  Text,
} from '@chakra-ui/react'
import { FaTimes, FaRedoAlt } from 'react-icons/fa'
import {
  GoogleMap,
  Marker,
  useLoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState, useCallback, useEffect } from 'react'
import React from 'react'


const center = {lat:54.976489, lng:-1.60786674}



function App() {
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
  const [tweetArrayFinal, setTweetArrayFinal] = useState([])
  const [aboutPage, setAboutPage] = useState(false)
  const [atweet,setAtweet] = useState()
  const [btweet,setBtweet] = useState()
  const [twitterFeed,setTwitterFeed] = useState()
  const [defined,setDefined] = useState(true)
  const [definedb,setDefinedb] = useState(true)
  const [detailsCoor,setDetailsCoor] = useState()
  const [route,setRoute] = useState(false)
  const [randomText,setRandomText] = useState(null)


   const [randomMarkers,setRandomMaekers] = useState([{
     name: "Jeremy",
     text: "This is about climatechange",
      lat:53.2553663,
      lng:-1.4245245       
    },
  {
    name: "Alias",
    text: "This is about netzero",
    lat:54.2553663,
    lng:-1.6245245
  },
  {
    name: "simonDev",
    text: "This is about netzero and climatechange",
    lat:53.6553663,
    lng:-1.8245245
  },
  ])
 
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
  getTweets()
  },[])
 
  
  const allTweetInfoURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?expansions=geo.place_id,author_id&place.fields=full_name,geo,name&query=(netzero OR climatechange) geo -is:retweet"
  const recentTweetWithAuthor = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?expansions=author_id&user.fields=username&query=(netzero OR climatechange) -is:retweet"
 
  const headers = {
    'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAAMOUagEAAAAAT%2FHx1qqtDijMyABuKFvZr3ZaJf0%3Dpn1And2lMZzsxZFV6eqlczo0SMNXiJPZzRdTmS8bRqFchXOOzU'
    };
  const iconURL = (iconName) => `http://openweathermap.org/img/wn/${iconName}@2x.png`;

  const getTweets = async () => {
    const response = await fetch (recentTweetWithAuthor,
      {
        method: 'GET',
        headers: headers
          })
    const data = await response.json()
    setAtweet(data.data)
         }


     const getB = async () => {
     const response = await fetch (recentTweetWithAuthor,
          {
            method: 'GET',
            headers: headers
              })
        const data = await response.json()
        setBtweet(data.includes.users)
            }
            const getC = () => {
              let arr = []
              atweet.map((tweet) => {
                
               btweet.map((name) => {
                if(tweet.author_id === name.id)
                {        
                let obj = {theText: tweet.text,theUser: name.name};
                  arr.push(obj);
                }
               })
              }) 
        setTwitterFeed(arr)
      }
     
        if(atweet != null && defined == true){
        getB()
        setDefined(false)
         }
       if(btweet != null && definedb == true){
        getC()
        setDefinedb(false)
        }

 const getWeather = async(lat) => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat.lat}&lon=${lat.lng}&appid=<YOURAPIKEY>`)
      const data = await response.json()
      setTemperature(data.main.temp)
      setIcon(data.weather[0].icon)
    
  }
  const onMapClick =((e) => {
    setMarkers({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),  },
    );
   
  });

  async function calculateRoute() {
    
    // eslint-disable-next-line no-undef
    const directionsService = new google.maps.DirectionsService()
    const results = await directionsService.route({
      origin: markers,
      destination: SNE,
      // eslint-disable-next-line no-undef
      travelMode: google.maps.TravelMode.DRIVING,
    })
    setDirectionsResponse(results)
    setDistance(results.routes[0].legs[0].distance.text)
    setDuration(results.routes[0].legs[0].duration.text)
    setRoute(true)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setRoute(false)
  }
  const mapRef = useRef();
  const onMapLoad = useCallback((map) => {
    mapRef.current = map;
  }, []);

  if (loadError) return "Error";
  if (!isLoaded) return "Loading...";

  const handleClose = () => {
     setAboutPage(false)
  }
  const handleAbout = () => {
     setAboutPage(true)
  }

  const refreshTweet = () => {
    setDefined(true)
    setDefinedb(true)
    getTweets()
  }

  const showDetails = (e) => {
      let coorX = e.domEvent.clientX
      let coorY = e.domEvent.clientY
      let tempObj = {
        tempX: `${coorX}px`,
        tempY: `${coorY}px`
      }
    return(
        setDetailsCoor(tempObj)
    )
  }
  const showText = (Text) => {
    let tempObj = {
      text: Text.text,
      name: Text.name
    }
    return(
    setRandomText(tempObj)
    )
  }

  const handleMouseOut = () => {
      setRandomText(null)
      setDetailsCoor(null)
  }

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      {detailsCoor && (
      <div className='details' style={{"top": detailsCoor.tempY,"left":detailsCoor.tempX}}>
          {randomText ? (<div><b><h1>{randomText.name}</h1></b><p style={{"fontSize":"12px"}}>{randomText.text}</p></div>):(
            <p>Sustainable North East HQ</p>
            )}
     </div>
       )}
      <Box position='absolute' left={0} top={0} h='100%' w='100%'>
        <GoogleMap
        id='map'
          center={center}
          zoom={7}
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
          <Marker position={center} 
          onMouseOver={(e) => showDetails(e)}
          onMouseOut={(e) => setDetailsCoor({
            tempX: "-1000px",
            tempY: "-1000px"
                    })}
          
          />
           <Marker 
          position={{lat: randomMarkers[0].lat, lng: randomMarkers[0].lng}}
          onMouseOver={(e) => {
              showDetails(e)
              showText(randomMarkers[0])}}
          onMouseOut={handleMouseOut}
          icon={{
            url: "./climatechange.png",
            scaledSize: new window.google.maps.Size(30,30),
            origin: new window.google.maps.Point(0,0),
            anchor: new window.google.maps.Point(15,15)
          }} 
          
          />
          <Marker 
          position={{lat: randomMarkers[1].lat, lng: randomMarkers[1].lng}}
          onMouseOver={(e) => {
            showDetails(e)
            showText(randomMarkers[1])}}
        onMouseOut={handleMouseOut}
        icon={{
          url: "./netzero.png",
          scaledSize: new window.google.maps.Size(30,30),
          origin: new window.google.maps.Point(0,0),
          anchor: new window.google.maps.Point(15,15)
        }} 
          />
          <Marker 
          position={{lat: randomMarkers[2].lat, lng: randomMarkers[2].lng}}
          onMouseOver={(e) => {
            showDetails(e)
            showText(randomMarkers[2])}}
        onMouseOut={handleMouseOut}
        icon={{
          
          url: "./both.png",
          scaledSize: new window.google.maps.Size(30,30),
          origin: new window.google.maps.Point(0,0),
          anchor: new window.google.maps.Point(15,15)
        }} 
          />         
          {tweetArrayFinal && (
           tweetArrayFinal.map((tweet) => {       
             return(
             <Marker 
             position={{lat: tweet.geo.bbox[1],lng: tweet.geo.bbox[0]}}
               onMouseOver={((e) => {
               <div style={{"width":"200px", "height":"200px", "zIndex":"4", "backgroundColor":"white"}}>
                 <p>hello</p>
               </div>
             })}     
             />)
              })
            )}
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
        w="60%"
        zIndex='1'
      >
        <HStack spacing={2}  justifyContent='space-evenly'>
          <Text>Sustainable North East </Text>
        <Image src={iconURL(icon)} alt="icon" w="60px" />
        <Text>{`${temperature}C`}</Text>
        </HStack>
       {distance &&
          <HStack spacing={20} mt={4} /* justifyContent='space-evenly' */>
          <Text>Distance: {distance} </Text>
          <Text>Duration: {duration} </Text>
          <ButtonGroup>
             <IconButton
              aria-label='center back'
              icon={<FaTimes />}
              onClick={clearRoute}
            />
          </ButtonGroup>
          </HStack>
          }         
      </Box>
          <div className='aboutContainer' onClick={handleAbout}>
            <p >{`About >`}</p>
          </div>

         <div className='aboutPage' style={aboutPage ? ({"display":"block"}):({"display":"none"})}>
             <ButtonGroup>
             <IconButton
              aria-label='center back'
              p={4}
              m={4}
              icon={<FaTimes />}
              onClick={handleClose}
            />
          </ButtonGroup>
          <h1 style={{"textAlign":"center"}}>Welcome to Sustainable North East</h1><br/>
          <p>By clicking on the map you will see the local weather information</p> 
            <p>By clicking on the map you will be also prompted with the directions to the Sustainable North East HQ
          </p><br/>
          <p>This website also contains a twitter feed with the latest #netZero and #climatechange tweets.
           </p>
           </div>   
      {route ? (""):(
        <div className='twitterFeed'>
          <div style={{"width":"100%","height":"100%" }}>
           <div style={{"display":"flex"}}>
           <h1 style={{"fontSize":"14px"}}>Latest Tweets including #netZero or #climateChange</h1> <ButtonGroup>
             <IconButton
              aria-label='center back'
              p={4}
              m={4}
              icon={<FaRedoAlt />}
              onClick={refreshTweet           
              }
            />
          </ButtonGroup>
          </div>
     <ul style={{"height":"100%","width":"100%"}}>        
    {twitterFeed && (
    twitterFeed.map((tweet) =>
    <div>
      <li><b>{tweet.theUser}</b></li>
      <li style={{"listStyleType":"none"}}>{tweet.theText}</li>
    </div>
    )
     )}
    </ul>
    </div>
  </div>
)}       
    </Flex>
  )
}

export default App
