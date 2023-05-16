// Set up requirements
const http = require("http");
const fs = require("fs");
const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
const alert = require("alert");
//const prompt = require('prompt');
const dialog = require("dialog");
const axios = require("axios");

// username and password from .env file
require("dotenv").config();
//app.use(express.static(path.join(__dirname, 'FinalProj')));
app.use("/styles", express.static(__dirname + "/templates"));

const userName = String(process.env.MONGO_DB_USERNAME);
const password = String(process.env.MONGO_DB_PASSWORD);

const databaseAndCollection = {
  db: String(process.env.MONGO_DB_NAME),
  collection: String(process.env.MONGO_COLLECTION),
};
const { MongoClient, ServerApiVersion } = require("mongodb");
const { send } = require("process");

const httpSuccessStatus = 200;

// get data from API and load into table
async function loadNews() {
  const options = {
    method: "GET",
    url: "https://videogames-news2.p.rapidapi.com/videogames_news/recent",
    headers: {
      "X-RapidAPI-Key": "1925bd6f8amshe3ab47f34dd792fp154ca7jsnd9826aa638ad",
      "X-RapidAPI-Host": "videogames-news2.p.rapidapi.com",
    },
  };

  try {
    const response = await axios.request(options);
    //console.log(response.data);
    let sendHtml = "";
    sendHtml += "<table border = '1'>";
    sendHtml +=
      "<tr><th>Article Title and Link</th><th>Description</th><th>Image</th><th>Date</th></tr>";
    response.data.forEach(
      (p) =>
        (sendHtml += `<tr>
        <td><a href="${p.link}">${p.title}</a></td>
        <td>${p.description}</td>
        <td><img src="${p.image}" alt="ArticleImage" height="200"></td>
        <td>${p.date}</td>
        </tr>`)
    );
    sendHtml += "</table>";

    return sendHtml;
  } catch (error) {
    console.error(error);
  }
}

// add user to database
async function addUser(
  nameIn,
  emailIn,
  usernameIn,
  passwordIn,
  response,
  variables
) {
  const uri = String(
    `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`
  );

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  // add user to account
  try {
    await client.connect();
    let userAdd = {
      name: nameIn,
      email: emailIn,
      username: usernameIn,
      password: passwordIn,
    };

    // only add if allowed to add
    // check if username is in use, then add
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .updateOne(
        { username: usernameIn },
        {
          $setOnInsert: userAdd,
        },
        { upsert: true }
      );

    if (result.upsertedId == null) {
      alert("Username Not Available!");
    } else {
      alert("Account Created Successfully!");
      response.render("confirmRegister", variables);
    }
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

// return users who match username and password
async function findUser(usernameIn, passwordIn) {
  const uri = `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    let filter = {
      username: usernameIn,
      password: passwordIn,
    };
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .find(filter)
      .toArray();
    client.close();
    return result;
  } catch (e) {
    console.log(e);
  }
}

// clear the database
async function deleteAll() {
  const uri = `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .deleteMany({});
    client.close();
    return result.deletedCount;
  } catch (e) {
    console.log(e);
  }
}

// set encoding so webpage can be parsed
process.stdin.setEncoding("utf8");

// get port number
let portNumber = process.argv[2];

// set up systems for webpage
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: false }));

// set up different pages
// home page
app.get("/", (request, response) => {
  response.render("index");
});

// form page to create account
app.get("/register", (request, response) => {
  response.render("register");
});

// response after making account
app.post("/register", (request, response) => {
  const variables = {
    name: request.body.name,
    email: request.body.email,
    username: request.body.username,
  };
  // add user to database
  addUser(
    request.body.name,
    request.body.email,
    request.body.username,
    request.body.password,
    response,
    variables
  );
  // function handles loading new page
});

// form to edit user information. requires log in
app.get("/reviewInformation", (request, response) => {
  response.render("reviewInformation");
});

// attempt to log in and update user information
async function updateUserInformation(request, response) {
  try {
    const applicant = await findUser(
      request.body.username,
      request.body.password
    );
    if (applicant !== undefined && applicant.length > 0) {
      alert("Information Updated!");
    } else {
      alert(
        `Could not find user ${request.body.username} or password incorrect.`
      );
    }
  } catch (err) {
    console.log(err);
  }

  // update user information
  const uri = String(
    `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`
  );

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  // update user name and email
  try {
    await client.connect();

    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .updateOne(
        { username: request.body.username},
        {
          $set: { name: request.body.name, email: request.body.email},
        }
      );
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
  response.redirect("/");
}

app.post("/reviewInformation", (request, response) => {
  updateUserInformation(request, response);
});

// server logged in status
let signedIn = false;
// form to sign in
app.get("/signIn", (request, response) => {
  if (signedIn) {
    alert("Already Signed In.");
  } else {
    response.render("signIn");
  }
});

// after enter sign in form
app.post("/signIn", (request, response) => {
  async function signIn(request, response) {
    try {
      const applicant = await findUser(
        request.body.username,
        request.body.password
      );
      if (applicant !== undefined && applicant.length > 0) {
        response.redirect("/");
        signedIn = true;
        alert("Sign In Successful!");
        return;
      } else {
        response.redirect("/");
        signedIn = false;
        alert("Sign In Failed!");
        return;
      }
    } catch (err) {
      console.log(err);
    }
  }
  signIn(request, response);
});

// sign out of account
app.get("/signOut", (request, response) => {
  if (signedIn) {
    signedIn = false;
    alert("Signed Out!");
  } else {
    alert("Not Signed In!");
  }
});

// load the news feed content
app.get("/newsFeed", (request, response) => {
  // async function to load from api
  async function newsFeed(request, response) {
    const variables = {
      news: await loadNews(),
    };
    response.render("newsFeed", variables);
  }
  // run code
  if (signedIn) {
    newsFeed(request, response);
  } else {
    alert("Please sign in to access News Feed.");
  }
});

app.post("/adminGFA", (request, response) => {
  collectGfas(request, response);
});

app.get("/adminRemove", (request, response) => {
  response.render("adminRemove");
});

async function removeDatabase(request, response) {
  let sendHtml =
    "All applications have been removed from the database. Number of applications removed: ";

  try {
    const deletedCount = await deleteAll();
    // build table if not empty list
    if (deletedCount == 0) {
      sendHtml = "Database is already empty.";
    } else {
      sendHtml += String(deletedCount);
      sendHtml += "<br>";
    }
  } catch (err) {
    console.log(err);
  }

  const variables = {
    appCount: sendHtml,
  };
  response.render("processAdminRemove", variables);
}

app.post("/adminRemove", (request, response) => {
  removeDatabase(request, response);
});

app.listen(portNumber);

// Print expected information to terminal
process.stdout.write(
  `Web server started and running at http://localhost:${portNumber}\n`
);
process.stdout.write("Stop to shutdown the server: ");

// terminal interface loop
process.stdin.on("readable", () => {
  let dataInput = process.stdin.read();
  if (dataInput !== null) {
    let command = dataInput.trim();
    // stop command
    if (command === "stop") {
      process.stdout.write("Shutting down the server\n");
      process.exit(0);
    }
    // invalid input command
    else {
      process.stdout.write(`Invalid command: ${command}\n`);
    }
    // repeat awaiting input
    process.stdout.write("Stop to shutdown the server: ");
    process.stdin.resume();
  }
});
