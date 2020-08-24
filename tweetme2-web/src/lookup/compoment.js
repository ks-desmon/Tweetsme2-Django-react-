function getCookie(name) {
  let cookieValue = null;
  if (document.cookie && document.cookie !== "") {
    const cookies = document.cookie.split(";");
    for (let i = 0; i < cookies.length; i++) {
      const cookie = cookies[i].trim();
      // Does this cookie string begin with the name we want?
      if (cookie.substring(0, name.length + 1) === name + "=") {
        cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
        break;
      }
    }
  }
  return cookieValue;
}

function lookup(method, endpoint, callback, data) {
  let JsonData;
  if (data) {
    JsonData = JSON.stringify(data);
  }

  // console.log(JsonData, "content");
  // Get the data sended by django url and return it to callback obj
  // const method = "GET";
  const url = "http://localhost:8000/api" + endpoint + "";
  const responseType = "json";
  const xhr = new XMLHttpRequest();
  xhr.responseType = responseType;
  xhr.open(method, url);

  // FOR POST REQUEST WE NEED JS CSRF TOKKEN

  xhr.setRequestHeader("Content-Type", "application/json");
  const csrftoken = getCookie("csrftoken");

  // SO THAT CSRF WILL ONLY BE IN HEADER WHILE POST
  // CSRF ON GET IS GIVING ERROR
  // console.log(csrftoken);
  if (csrftoken && method === "POST") {
    xhr.setRequestHeader("X-CSRFToken", csrftoken);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    // BELOW line WORING IN JS BUT NOT HERE ON POST
    xhr.setRequestHeader("HTTP_X_REQUESTED_WITH", "XMLHttpRequest");
  }

  // CSRF TOKKEN ADDED

  xhr.onload = function () {
    // pushing the data on success
    callback(xhr.response, xhr.status);
  };
  xhr.onerror = (e) => {
    console.log(e, "error");
    // pushing the msg on fail
    callback({ message: "the request was an error" }, 400);
  };
  xhr.send(JsonData);
}

export function loadTweets(callback) {
  lookup("GET", "/tweets/", callback);
}

export function createTweets(newTweets, callback) {
  // console.log(newTweets, "mu name");
  lookup("POST", "/tweets/create/", callback, { content: newTweets });
}
