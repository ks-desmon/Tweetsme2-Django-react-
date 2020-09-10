import React from "react";
import { apiTweetAction } from "./lookup";

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
