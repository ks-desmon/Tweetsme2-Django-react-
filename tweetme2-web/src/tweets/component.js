import React, { useEffect, useState } from "react";
import { apiTweetList, apiTweetCreate, apiTweetAction } from "./lookup";

// FORM COMPONENT TO SEND TWEET IN DATABASE
// RELOAD TWEETLIST SAME TIME
export function TweetsComponent(props) {
  console.log(props);
  const textAreaRef = React.createRef();
  const [newTweets, setNewTweets] = useState([]);
  const canTweet = props.canTweet === "false" ? false : true;
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
      {canTweet === true && (
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
      )}
      {/* CONTAINS LIST OF TWEETS */}
      <TweetList newTweets={newTweets} {...props} />
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

// CREATING THE DIV FOR EACT DIV AND PASSING DATA FURTHER TO CREATE BUTTONS
export function Tweet(props) {
  const { tweet, didRetweet, hideActions } = props;
  const [actionTweet, SetActionTweet] = useState(
    props.tweet ? props.tweet : null
  );
  const className = "col-10 col-md-12 mx-auto";
  const classname = props.className ? props.className : className;

  const handlePerformAction = (newActionTweet, status) => {
    if (status === 200) {
      SetActionTweet(newActionTweet);
    } else if (status === 201) {
      if (didRetweet) {
        didRetweet(newActionTweet);
      }
    }
  };
  return (
    <div className={classname}>
      <div>
        <p>
          {tweet.id} - {tweet.content}
        </p>
        <ParentTweet tweet={tweet} />
      </div>

      {/* CALLING BUTTONS HERE AND PASSING THE DATA */}
      {actionTweet && hideActions !== true && (
        <div className="btn btn-group ">
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "like", display: "Like" }}
          />
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "unlike", display: "Unlike" }}
          />
          <ActionBtn
            tweet={actionTweet}
            didPerformAction={handlePerformAction}
            action={{ type: "retweet", display: "Retweet" }}
          />
        </div>
      )}
    </div>
  );
}

// CREATING PARENT TWEET
export function ParentTweet(props) {
  const { tweet } = props;
  return tweet.parent ? (
    <div className="row">
      <div className="col-11 mx-auto p-3 border rounded">
        <p className="mb-0 text-muted small">Retweet</p>
        <Tweet hideActions className="" tweet={tweet.parent} />
      </div>
    </div>
  ) : null;
}

// RETURNING BUTTONS TO TWEET

export function ActionBtn(props) {
  const { tweet, action, didPerformAction } = props;
  const className = "btn btn-primary";

  // IF VALUE COMMING AS UNDEFINE CONVERT IT IN TO ZERO

  const likes = tweet.likes ? tweet.likes : 0;

  // TOGGELING FOR LIKE BUTTON

  // const [userlike, setuserlike] = useState(
  //   tweet.userlike === true ? true : false
  // );

  const classname = props.className ? props.className : className;
  // SETTING THE ACTIONDISPLAY TO CHECK WETHER ACTION IS COMMING OR NOT
  const actiondisplay = action.display ? action.display : "Action";

  const handleActionBackendEvent = (response, status) => {
    console.log(status, response);
    if ((status === 200 || status === 201) && didPerformAction) {
      //setlikes(response.likes);
      didPerformAction(response, status);
      // setuserlike(true);
    }
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
