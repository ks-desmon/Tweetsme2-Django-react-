import { backendLookup } from "../lookup";

export function apiTweetList(username, callback) {
  let endpoint = "/tweets/";
  if (username) {
    endpoint = `/tweets/?username=${username}`;
  }
  backendLookup("GET", endpoint, callback);
}

export function apiTweetDetail(tweetId, callback) {
  let endpoint = `/tweets/${tweetId}`;
  backendLookup("GET", endpoint, callback);
}

export function apiTweetCreate(newTweets, callback) {
  // console.log(newTweets, "mu name");
  backendLookup("POST", "/tweets/create/", callback, { content: newTweets });
}

export function apiTweetAction(tweetId, action, callback) {
  const data = { id: tweetId, action: action };
  // console.log(newTweets, "mu name");
  backendLookup("POST", "/tweets/action/", callback, data);
}
