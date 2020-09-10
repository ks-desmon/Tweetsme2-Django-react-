import React, { useState } from "react";
import { ActionBtn } from "./buttons";

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
