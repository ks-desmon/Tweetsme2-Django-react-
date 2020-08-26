import React, { useEffect, useState } from "react";
import { apiTweetList, apiTweetCreate, apiTweetAction } from "./lookup";

// FORM COMPONENT TO SEND TWEET IN DATABASE
// RELOAD TWEETLIST SAME TIME
export function TweetsComponent(props) {
  const textAreaRef = React.createRef();
  const [newTweets, setNewTweets] = useState([]);

  //FUNCTION TO SAVING DATA TO SERVER-END

  const handleBackendUpdate = (response, status) => {
    // BACKEND API RESPONSE HANDLER

    console.log(status);
    let tempNewTweets = [...newTweets];
    if (status === 201) {
      tempNewTweets.unshift(response);
      // AFTER SENDING DATA TO TWEET RELOAD TWEET AGAIN

      setNewTweets(tempNewTweets);
    } else {
      console.log(status);
      // alert("error while sending data");
    }
  };

  // COLLECT THE VALUE FROM TEXTARE

  const handleSubmit = (event) => {
    // BACKEND API REQUEST

    event.preventDefault();

    const newVal = textAreaRef.current.value;

    // WILL STORE TWEET INTO DATA BASE
    // THEN WILL CALL (handleBackendUpdate) FUNCTION
    // TO GET SAME TWEET BACK AS RESPONSE WITH
    // CORRECT ID AND LIKES
    // THEN RELOAD THE TWEET LIST
    apiTweetCreate(newVal, handleBackendUpdate);

    // console.log(tempNewTweets);

    textAreaRef.current.value = "";
  };

  //RENDRING FORM AND LIST OF TWEETS

  return (
    <div className={props.className}>
      <div className="col-12 mb-3">
        <form onSubmit={handleSubmit}>
          <textarea
            ref={textAreaRef}
            required={true}
            className="form-control"
          ></textarea>
          <button type="submit" className="btn btn-primary my-3">
            Tweet
          </button>
        </form>
      </div>
      {/* CONTAINS LIST OF TWEETS */}
      <TweetList newTweets={newTweets} />
    </div>
  );
}

// GETTING THE HTTP RESPONSE DATA
// RENDRING THEM LOADING TWEETS
export function TweetList(props) {
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
      const mycallback = (response, status) => {
        if (status === 200) {
          setTweetInit(response);
        } else {
          alert("there was an error");
        }
      };
      apiTweetList(mycallback);
    }
  }, [tweetsInit, tweetsDidSet, setTweetsDidSet]);

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

  // LOOPING THROUGH DATA ONE BY ONE TO SENDING TWEET FOR CREATING HTML

  return tweets.map((item, index) => {
    return (
      <Tweet
        tweet={item}
        key={index}
        className="my-5 py-5 border bg-white text-dark"
      />
    );
  });
}

// CREATING THE DIV FOR EACT DIV AND PASSING DATA FURTHER TO CREATE BUTTONS

export function Tweet(props) {
  const { tweet } = props;
  const className = "col-10 col-md-12 mx-auto";
  const classname = props.className ? props.className : className;
  return (
    <div className={classname}>
      <p>
        {tweet.id} - {tweet.content}
      </p>

      {/* CALLING BUTTONS HERE AND PASSING THE DATA */}

      <div className="btn btn-group ">
        <ActionBtn tweet={tweet} action={{ type: "like", display: "like" }} />
        <ActionBtn
          tweet={tweet}
          action={{ type: "unlike", display: "unlike" }}
        />
        <ActionBtn
          tweet={tweet}
          action={{ type: "retweet", display: "retweet" }}
        />
      </div>
    </div>
  );
}

// RETURNING BUTTONS TO TWEET

export function ActionBtn(props) {
  const { tweet, action } = props;
  const className = "btn btn-primary";

  // IF VALUE COMMING AS UNDEFINE CONVERT IT IN TO ZERO

  const [likes, setlikes] = useState(tweet.likes ? tweet.likes : 0);

  // TOGGELING FOR LIKE BUTTON

  const [userlike, setuserlike] = useState(
    tweet.userlike === true ? true : false
  );

  const classname = props.className ? props.className : className;
  // SETTING THE ACTIONDISPLAY TO CHECK WETHER ACTION IS COMMING OR NOT
  const actiondisplay = action.display ? action.display : "Action";

  const handleActionBackendEvent = (response, status) => {
    console.log(status, response);
  };

  // ALREADY LIKED CAN NOT BE LIKED AGAIN FIRST IT WILL BE DISLIKE
  const handleClike = (event) => {
    event.preventDefault();
    apiTweetAction(tweet.id, action.type, handleActionBackendEvent);
    // if (action.type === "like") {
    //   if (userlike === true) {
    //     setlikes(likes - 1);
    //     setuserlike(false);
    //   } else {
    //     setlikes(tweet.likes + 1);
    //     setuserlike(true);
    //   }
    // }
  };
  // IF ACTION IS LIKE SHOW NUMBERS OF LIKE ELSE SHOW ONLY ACTION
  const display =
    action.type === "like" ? `${likes} ${actiondisplay}` : actiondisplay;
  return (
    <button className={classname} onClick={handleClike}>
      {display}
    </button>
  );
}
