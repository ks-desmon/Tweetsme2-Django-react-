import { backendLookup } from "../lookup";

export function apiTweetList(callback) {
  backendLookup("GET", "/tweets/", callback);
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
