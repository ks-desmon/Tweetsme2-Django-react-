export function loadTweets(callback) {
  // Get the all data with js sended by django url
  const method = "GET";
  const url = "http://localhost:8000/api/tweets";
  const responseType = "json";
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.open(method, url);
  xhr.onload = function () {
    callback(xhr.response, xhr.status);
  };
  xhr.onerror = (e) => {
    console.log(e);
    callback({ message: "the request was an error" }, 400);
  };
  xhr.send();
}
