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
  AlertDialogCloseButton,
} from '@chakra-ui/react'
import { FaLocationArrow, FaTimes, FaRedoAlt } from 'react-icons/fa'

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
/* import { getGlobalLock } from 'framer-motion/types/gestures/drag/utils/lock'
 */
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
  const [atweet,setAtweet] = useState()
  const [btweet,setBtweet] = useState()
  const [twitterFeed,setTwitterFeed] = useState()
  const [defined,setDefined] = useState(true)
  const [definedb,setDefinedb] = useState(true)
  const [detailsCoor,setDetailsCoor] = useState()
  const [markerTweet,setMarkerTweet] = useState()
  const [markerTweetUsers,setMarkerTweetUsers] = useState()
  const [markerTweetPlaces,setMarkerTweetPlaces] = useState()
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
  getTweetsPosition()

},[])
 
  
  const climateGeoFullURL2 = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=text&expansions=geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const climateBBOX = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/1525530659787259904?expansions=geo.place_id&place.fields=geo"
  const climateGeoFullURL3 = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=&expansions=author_id,geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const specificFeed = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=&expansions=author_id,geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const allTweetInfoURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?expansions=geo.place_id,author_id&place.fields=full_name,geo,name&query=(netzero OR climatechange) geo -is:retweet"
  const recentTweetWithAuthor = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?expansions=author_id&user.fields=username&query=(netzero OR climatechange) -is:retweet"
  const locationTweetUrl = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets?tweet.fields=geo,source&expansions=geo.place_id,author_id&place.fields=full_name,geo,name&ids=1526727795778408450,1526749429155475458,1526750935732703232"
 
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
    
    /* console.log(data.data)
      console.log(data.includes.users) */
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
       /*  console.log("xxxxxxxx",arr) */
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

      
      
      

    const getTweetsPosition = async () => {
       const response = await fetch (locationTweetUrl,
          {
          method: 'GET',
          headers: headers
            })
      const data = await response.json()
     /* console.log(data)
     console.log(data.data)
     console.log(data.includes.users)
     console.log(data.includes.places) */
     setMarkerTweet(data.data)
     setMarkerTweetUsers(data.includes.users)
     setMarkerTweetPlaces(data.includes.places)
        } 



    const getTweetsLocations = async () => {
      const response = await fetch (allTweetInfoURL,
        {
          method: 'GET',
          headers: headers
            })
      const data = await response.json()
     /*  console.log("testLoc",data.includes.places) */
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

    /* console.log("theArr",tweetArrayFinal) */
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
    setRoute(true)
  }

  function clearRoute() {
    setDirectionsResponse(null)
    setDistance('')
    setDuration('')
    setRoute(false)
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
    /* console.log("hello") */
    setAboutPage(false)
  }
  const handleAbout = () => {
    /* console.log("clicked") */
    setAboutPage(true)
  }

  const refreshTweet = () => {
    setDefined(true)
    setDefinedb(true)
    getTweets()
  }

 /*  const options = { closeBoxURL: '', enableEventPropagation: true };
 
  const onLoad = infoBox => {
    console.log('infoBox: ', infoBox)
  }; */
/*   const showDetailsMarker = (e) => {

    let coorX = e.domEvent.clientX
      let coorY = e.domEvent.clientY
      let tempObj = {
        tempX: `${coorX}px`,
        tempY: `${coorY}px`
      }
    return(
      
        setDetailsCoorMarker(tempObj)

    )
  } */
  
  /* console.log("atweet",atweet) */
  const showDetails = (e) => {
    /* console.log(e.domEvent.clientX) */
    console.log("show", e)
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
  /* console.log("tweet",markerTweet)
  console.log("users",markerTweetUsers)
  console.log("places",markerTweetPlaces) */
  console.log(randomMarkers)
  console.log(randomText)

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

{detailsCoor && (
<div className='details' style={{"top": detailsCoor.tempY,"left":detailsCoor.tempX}}>
          {randomText ? (<div><b><h1>{randomText.name}</h1></b><p style={{"fontSize":"12px"}}>{randomText.text}</p></div>):(
            <p>Sustainable North East HQ</p>
            )}
            </div>
       )}
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
          <Marker position={center} 
          onMouseOver={(e) => showDetails(e)}
          onMouseOut={(e) => setDetailsCoor({
            tempX: "-1000px",
            tempY: "-1000px"
                    })}
          
          />
          {/* {randomMarkers && (randomMarkers.map((random) => {
            return(
            <Marker position={{lat: random.lat, lng: random.lng}} 
            onMouseOver={(random) => showDetails(random)}
            onMouseOut={(random) => setDetailsCoor({
              tempX: "-1000px",
            tempY: "-1000px"
            })}
                      
            />
            )
          }))} */}

          <Marker 
          position={{lat: randomMarkers[0].lat, lng: randomMarkers[0].lng}}
          onMouseOver={(e) => {
              showDetails(e)
              showText(randomMarkers[0])}}
          onMouseOut={handleMouseOut}
          
          />
          <Marker 
          position={{lat: randomMarkers[1].lat, lng: randomMarkers[1].lng}}
          onMouseOver={(e) => {
            showDetails(e)
            showText(randomMarkers[1])}}
        onMouseOut={handleMouseOut}
          />
          <Marker 
          position={{lat: randomMarkers[2].lat, lng: randomMarkers[2].lng}}
          onMouseOver={(e) => {
            showDetails(e)
            showText(randomMarkers[2])}}
        onMouseOut={handleMouseOut}
          />
         
          
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
            <p >{`About >`}</p>
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
          <h1 style={{"textAlign":"center"}}>Welcome to Sustainable North East</h1><br/>
          <p>Please, feel free to click on the map to retrieve the local weather information.</p> 
            <p>By clicking on the map you will be also prompted with the directions to the HQ
          </p><br/>
          <p>This website also contains a tweet feed with the latest #netZero and #climatechange tweets.
             Markers show tweets with geo-location.
          </p>
           </div>   

      {/* <div className='twitterFeed'>
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
          </div> */}

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
