import { useEffect, useState } from "react"
import React from 'react'

const TwitterFeed = () => {
  const [tweets, setTweets] = useState([])
  const [tweetsLocations, setTweetsLocations] = useState([])
/*   const [tweetsLocationsWithId, setTweetsLocationsWithId] = useState([])
 */
  useEffect(() => {
    getTweets()
  },[])
  const climateURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=text&query=climatechange geo -is:retweet"
  const climateGeoURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/1525530659787259904?expansions=geo.place_id&place.fields=geo&tweet.fields=text,public_metrics"
  const climateGeoFullURL = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=text&expansions=geo.place_id&place.fields=geo&query=climatechange geo -is:retweet"
  const climateGeoFullURL2 = "https://corsanywhere.herokuapp.com/https://api.twitter.com/2/tweets/search/recent?tweet.fields=text&expansions=geo.place_id&place.fields=geo&query=(climatechange OR netzero) geo -is:retweet"
  const headers = {
    'Authorization':'Bearer AAAAAAAAAAAAAAAAAAAAAMOUagEAAAAAT%2FHx1qqtDijMyABuKFvZr3ZaJf0%3Dpn1And2lMZzsxZFV6eqlczo0SMNXiJPZzRdTmS8bRqFchXOOzU'
    };

  const getTweets = async () => {


      const response = await fetch (climateGeoFullURL2,
        {
          method: 'GET',
    
          headers: headers
            })
      const data = await response.json()
      console.log(data.data)
      setTweets(data.data)
      /* setTweetsLocations(data.includes.places) */

     /*  setTweetsLocationsWithId(tweetsLocations[0].geo.bbox[0])
      setTweetsLocationsWithId(tweetsLocations[0].geo.bbox[1])
      setTweetsLocationsWithId(tweetsLocations[0].id) */
      /* setTweets(data.data) */
  }
  /* console.log(tweetsLocations) */
  /* if(tweetsLocations){
    tweetsLocations.map((tweet)=> {
        setTweetsLocationsWithId(...tweetsLocationsWithId, tweet)
    })
    console.log(tweetsLocationsWithId)
  } */

 

  return (
    <div className="twitterFeed">
      <h1>Twitter feed</h1>
      <ul>
     {/* {tweetsLocations ? ( 
     tweetsLocations.map((tweet) => {
       
                        return(
                            <li>{tweet.id} {tweet.geo.bbox[0]} {tweet.geo.bbox[1]}</li>
                                              
                        );
                    })
                    ):("")} */}

{/* {tweets ? ( 
     tweets.map((tweet) => {
       
                        return(
                            <li>{tweet.text}  {tweet.geo.place_id?(tweet.geo.place_id):("")}</li>
                                              
                        );
                    })
                    ):("")} */}
                    {tweets ? ( 
                     tweets.map((tweet) => {
                         return(
                            <li>{tweet.text} </li>
                                              
                        );
                    })
                    ):("")}
                    </ul>
                   
         </div>

  )
}

export default TwitterFeed