import {
  Box,
  Button,
  ButtonGroup,
  Flex,
  HStack,
  Image,
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
  InfoBox,
  InfoWindow,
  useLoadScript,
  DirectionsRenderer,
} from '@react-google-maps/api'
import { useRef, useState, useCallback, useEffect } from 'react'
import React from 'react'
import TwitterFeed from './TwitterFeed'

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
  const [tweets, setTweets] = useState([])
  const [tweetsWithGeo, setTweetsWithGeo] = useState([])
  const [tweetsLocations, setTweetsLocations] = useState([])
  const [tweetsLocationsWithId, setTweetsLocationsWithId] = useState([])
  const [tweetArrayBbox, setTweetArrayBbox] = useState([])
  const [tweetsPlaces, setTweetsPlaces] = useState([])
  const [tweetArrayFinal, setTweetArrayFinal] = useState([])
  const [aboutPage, setAboutPage] = useState(false)


 
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
   /* getTweetsPosition() */

},[])
  
  const climateGeoFullURL2 = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=text&expansions=geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const climateBBOX = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/1525530659787259904?expansions=geo.place_id&place.fields=geo"
  const climateGeoFullURL3 = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=&expansions=author_id,geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const specificFeed = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=&expansions=author_id,geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const allTweetInfoURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?expansions=geo.place_id,author_id&place.fields=full_name,geo,name&query=(netzero OR climatechange) geo -is:retweet"

  const headers = {
    'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAAMOUagEAAAAAT%2FHx1qqtDijMyABuKFvZr3ZaJf0%3Dpn1And2lMZzsxZFV6eqlczo0SMNXiJPZzRdTmS8bRqFchXOOzU'
    };
  const iconURL = (iconName) => `http://openweathermap.org/img/wn/${iconName}@2x.png`;

  const getTweets = async () => {
    const response = await fetch (allTweetInfoURL,
      {
        method: 'GET',
        headers: headers
          })
    const data = await response.json()
    console.log(data.includes)
     setTweets(data.data)

    
     getTweetsLocations()
     /* setTweetsLocations(data.includes) */
       }

    /* const getTweetsPosition = async () => {
       const response = await fetch (climateGeoFullURL3,
          {
          method: 'GET',
          headers: headers
            })
      const data = await response.json()
      setTweetsPlaces(data.includes.places)
        } */




    const getTweetsLocations = async () => {
      const response = await fetch (allTweetInfoURL,
        {
          method: 'GET',
          headers: headers
            })
      const data = await response.json()
      console.log("testLoc",data.includes.places)
      let arr =[]
      data.includes.places.map((tweet) => {
        /* console.log(tweet.id, tweet.geo.bbox) */
        arr.push(tweet)
        
      })
      /* console.log(arr) */
      setTweetArrayFinal(arr)
      
      /* if(true){
      let temp = data.includes.places[0].geo.bbox;
    temp.splice(temp.length - 2, 2);
      let tempObj = {
        lat: temp[1],
        lng: temp[0]
      }
      let updateArray = [...tweetArrayBbox, tempObj];
      setTweetArrayBbox(updateArray)
      }  */
    }
    /* console.log(tweetArrayBbox) */

    console.log("theArr",tweetArrayFinal)
 const getWeather = async(lat) => {
      const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?units=metric&lat=${lat.lat}&lon=${lat.lng}&appid=1c1726b14949cd9be2b66664ee76ae60`)
      const data = await response.json()
      setTemperature(data.main.temp)
      setIcon(data.weather[0].icon)
    
  }
  const onMapClick =((e) => {
    setMarkers({
        lat: e.latLng.lat(),
        lng: e.latLng.lng(),  },
    );
    /* calculateRoute() */
  });

  async function calculateRoute() {
    /* if (originRef.current.value === '' || destiantionRef.current.value === '') {
      return
    } */
    /* console.log("infunc", SNE , markers) */
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

  const handleClose = () => {
    console.log("hello")
    setAboutPage(false)
  }
  const handleAbout = () => {
    console.log("clicked")
    setAboutPage(true)
  }

  const options = { closeBoxURL: '', enableEventPropagation: true };
 
  const onLoad = infoBox => {
    console.log('infoBox: ', infoBox)
  };

  
  

  return (
    <Flex
      position='relative'
      flexDirection='column'
      alignItems='center'
      h='100vh'
      w='100vw'
    >
      {/* <div className='weatherBox'>
        <p>Sustainable North East</p>
        <img src={iconURL(icon)} alt="icon" />
        <p>{`${temperature}C`}</p>
    </div>  */}
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
          {/* <Marker position={}/> */}
          {tweetArrayFinal && (
           tweetArrayFinal.map((tweet) => {
              
             return(
             <Marker 
             position={{lat: tweet.geo.bbox[1],lng: tweet.geo.bbox[0]}}
             /* onMouseOver={((e) => {console.log(tweet.id)})} */
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

          {/* <Marker position={}/> */}
          {/* {tweetArrayFinal && (
          
            tweetArrayFinal.map((tweet) => {
                <Marker position={{lat: tweet.geo.bbox[1],lng: tweet.geo.bbox[0]}}/>
             })
          )} */}

{/* <InfoBox
      onLoad={onLoad}
      options={options}
      position={center}
    >
      <div style={{ backgroundColor: 'yellow', opacity: 0.75, padding: 12 }}>
        <div style={{ fontSize: 16, fontColor: `#08233B` }}>
          Hello, World!
        </div>
      </div>
    </InfoBox> */}

        </GoogleMap>
      </Box>
      <Box
        p={4}
        borderRadius='lg'
        m={4}
        bgColor='white'
        shadow='base'
        /* minW='container.md' */
        w="60%"
        zIndex='1'
      >
        <HStack spacing={2}  justifyContent='space-evenly'>
          

          <Text>Sustainable North East </Text>
          {/* <Text>kf6013</Text> */}
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
            <p >{`About >>`}</p>
          </div>

         <div className='aboutPage' /* style={{"display":"none"}} */ style={aboutPage ? ({"display":"block"}):({"display":"none"})}>
           {/* <button><FaTimes onClick={console.log("hello")}/></button> */}
           <ButtonGroup>
             <IconButton
              aria-label='center back'
              p={4}
              m={4}
              icon={<FaTimes />}
              onClick={handleClose}
            />
          </ButtonGroup>
          <h1 style={{"textAlign":"center"}}>About Page</h1>
           </div>   

      <div className='twitterFeed'>
        <h1 style={{"fontSize":"14px", "marginTop":"30px"}}>Latest Tweets including #netZero or #climateChange</h1>
     <ul style={{"height":"100%"}}>        
     {tweets && (
            tweets.map((tweet) => {
             return(<>
                  <p>username: {tweet.author_id}</p>
               <li>{tweet.text}</li>
               </>
             ) 
            })
          )}
          </ul>
          </div>
         
    </Flex>
  )
}

export default App
