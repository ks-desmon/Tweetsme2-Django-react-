import React, { useEffect, useState } from "react";
import { loadTweets } from "../lookup";

// This Form componemt
export function TweetsComponent(props) {
  const textAreaRef = React.createRef();
  const [newTweets, setNewTweets] = useState([]);
  // collect the value from textare
  const handleSubmit = (event) => {
    event.preventDefault();
    const newVal = textAreaRef.current.value;
    let tempNewTweets = [...newTweets];
    // save data to server end
    tempNewTweets.unshift({
      content: newVal,
      likes: 0,
      id: 123,
    });
    setNewTweets(tempNewTweets);
    textAreaRef.current.value = "";
  };
  // Rendering form and list of tweets
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
      {/* contains list of tweets */}
      <TweetList newTweets={newTweets} />
    </div>
  );
}

// Gettuing the http response data and redring them
export function TweetList(props) {
  const [tweetsInit, setTweetInit] = useState([]);
  const [tweets, setTweets] = useState([]);

  // Will get the response data from response and set inside a state tweetsInit

  useEffect(() => {
    const mycallback = (response, status) => {
      if (status === 200) {
        setTweetInit(response);
      } else {
        alert("there was an error");
      }
    };
    loadTweets(mycallback);
  }, []);

  useEffect(() => {
    // concate the data and new data
    let final = [...props.newTweets].concat(tweetsInit);

    //setting the concat data into new hook tweets // if condition in for second time
    if (final.length !== tweets.length) {
      setTweets(final);
    }
  }, [tweetsInit, props.newTweets, tweets]);

  // looping through data one by one to sending Tweet for creating html

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

// creating the div for eact div and passing data further to create buttons

export function Tweet(props) {
  const { tweet } = props;
  const className = "col-10 col-md-12 mx-auto";
  const classname = props.className ? props.className : className;
  return (
    <div className={classname}>
      <p>
        {tweet.id} - {tweet.content}
      </p>

      {/* calling buttons here and passing the data */}

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

// Returning buttons to Tweet

export function ActionBtn(props) {
  const { tweet, action } = props;
  const className = "btn btn-primary";

  // If value comming as undefine convert it in to zero

  const [likes, setlikes] = useState(tweet.likes ? tweet.likes : 0);

  // toggeling for like button

  const [userlike, setuserlike] = useState(
    tweet.userlike === true ? true : false
  );

  const classname = props.className ? props.className : className;
  // setting the actiondisplay to check wether action is comming or not
  const actiondisplay = action.display ? action.display : "Action";

  // already liked can not be liked again first it will be dislike
  const handleClike = (event) => {
    event.preventDefault();
    if (action.type === "like") {
      if (userlike === true) {
        setlikes(likes - 1);
        setuserlike(false);
      } else {
        setlikes(tweet.likes + 1);
        setuserlike(true);
      }
    }
  };
  // if action is like show numbers of like else show only action
  const display =
    action.type === "like" ? `${likes} ${actiondisplay}` : actiondisplay;
  return (
    <button className={classname} onClick={handleClike}>
      {display}
    </button>
  );
}
