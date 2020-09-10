import React, { useEffect, useState } from "react";
import { Tweet } from "./detail";
import { apiTweetList } from "./lookup";
// GETTING THE HTTP RESPONSE DATA
// RENDRING THEM LOADING TWEETS
export function TweetsList(props) {
  const [tweetsInit, setTweetInit] = useState([]);
  const [tweets, setTweets] = useState([]);
  const [tweetsDidSet, setTweetsDidSet] = useState(false);

  // WILL GET THE RESPONSE DATA FROM RESPONSE
  // SET INSIDE A STATE TWEETSINIT

  useEffect(() => {
    // IF CONDITION WILL MAKE SURE
    // THAT FUNTION WILL HIT ONLY ONE TIME TO SERVER

    if (tweetsDidSet === false) {
      setTweetsDidSet(!tweetsDidSet);
      const handleTweetListLookup = (response, status) => {
        if (status === 200) {
          setTweetInit(response);
        } else {
          alert("there was an error");
        }
      };
      apiTweetList(props.username, handleTweetListLookup);
    }
  }, [tweetsInit, tweetsDidSet, setTweetsDidSet, props.username]);

  // WORKS AS SAME WINDOW ON LOAD

  useEffect(() => {
    // CONCATE THE DATA AND NEW DATA
    let final = [...props.newTweets].concat(tweetsInit);

    // SETTING THE CONCAT DATA INTO NEW HOOK TWEETS
    // IF CONDITION IN FOR SECOND TIME
    if (final.length !== tweets.length) {
      setTweets(final);
    }
  }, [tweetsInit, props.newTweets, tweets]);

  const handleDidRetweet = (newTweet) => {
    const updatedTweetInit = [...tweetsInit];
    updatedTweetInit.unshift(newTweet);
    setTweetInit(updatedTweetInit);
    const updatedFinalTweets = [...tweets];
    updatedFinalTweets.unshift(tweets);
    setTweets(updatedFinalTweets);
  };

  // LOOPING THROUGH DATA ONE BY ONE TO SENDING TWEET FOR CREATING HTML

  return tweets.map((item, index) => {
    return (
      <Tweet
        didRetweet={handleDidRetweet}
        tweet={item}
        key={index}
        className="my-5 py-5 border bg-white text-dark"
      />
    );
  });
}
