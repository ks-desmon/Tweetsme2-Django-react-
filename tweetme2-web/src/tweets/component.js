import React, { useEffect, useState } from "react";
import { loadTweets } from "../lookup";

export function ActionBtn(props) {
  const { tweet, action } = props;
  const className = "btn btn-primary";
  const [likes, setlikes] = useState(tweet.likes ? tweet.likes : 0);
  const [userlike, setuserlike] = useState(
    tweet.userlike === true ? true : false
  );
  const classname = props.className ? props.className : className;
  const actiondisplay = action.display ? action.display : "Action";

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
  const display =
    action.type === "like" ? `${likes} ${actiondisplay}` : actiondisplay;

  return (
    <button className={classname} onClick={handleClike}>
      {display}
    </button>
  );
}

export function Tweet(props) {
  const { tweet } = props;
  const className = "col-10 col-md-12 mx-auto";
  const classname = props.className ? props.className : className;
  return (
    <div className={classname}>
      <p>
        {tweet.id} - {tweet.content}
      </p>
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

export function TweetList(props) {
  // useState will set the json data to a variable
  const [tweets, setTweet] = useState([{ content: 125 }]);

  useEffect(() => {
    const mycallback = (response, status) => {
      console.log(status, response);
      if (status === 200) {
        setTweet(response);
      } else {
        alert("there was an error");
      }
    };
    loadTweets(mycallback);
  }, []);

  return tweets.map((tweets, index) => {
    return (
      <Tweet
        tweet={tweets}
        key={index}
        className="my-5 py-5 border bg-white text-dark"
      />
    );
  });
}
