import React, { useEffect, useState } from "react";
//{ useEffect } allow ro run http request
import logo from "./logo.svg";
import "./App.css";

const loadTweets = function (callback) {
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
};

function App() {
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

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.js</code> and save to reload.
        </p>
        <p>
          {tweets.map((tweets, index) => {
            return <li>{tweets.content}</li>;
          })}
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
