export function loadTweets(callback) {
  // Get the data sended by django url and return it to callback obj
  const method = "GET";
  const url = "http://localhost:8000/api/tweets";
  const responseType = "json";
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.open(method, url);
  xhr.onload = function () {
    // pushing the data on success
    callback(xhr.response, xhr.status);
  };
  xhr.onerror = (e) => {
    console.log(e);
    // pushing the msg on fain
    callback({ message: "the request was an error" }, 400);
  };
  xhr.send();
}
