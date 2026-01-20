const http = require("http");
const querystring = require("querystring");

function postRequest(todoText) {
  const postData = querystring.stringify({
    todo: todoText,
  });

  const options = {
    hostname: "localhost",
    port: 3000,
    path: "/add",
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
      "Content-Length": Buffer.byteLength(postData),
    },
  };

  const req = http.request(options, (res) => {
    console.log(`POST /add Status: ${res.statusCode}`);
    if (res.statusCode === 302) {
      console.log("Redirect check passed");
      getRequest(todoText);
    } else {
      console.error("Failed to redirect after POST");
    }
  });

  req.on("error", (e) => {
    console.error(`problem with request: ${e.message}`);
  });

  req.write(postData);
  req.end();
}

function getRequest(expectedText) {
  http
    .get("http://localhost:3000", (res) => {
      let data = "";
      res.on("data", (chunk) => {
        data += chunk;
      });
      res.on("end", () => {
        if (data.includes(expectedText)) {
          console.log(`SUCCESS: Found "${expectedText}" in response`);
        } else {
          console.error(`FAILURE: "${expectedText}" not found in response`);
          console.log("Response snippet:", data.substring(0, 200));
        }
      });
    })
    .on("error", (e) => {
      console.error(`Got error: ${e.message}`);
    });
}

// Run test
console.log("Starting verification...");
postRequest("VerifyMe_" + Date.now());
