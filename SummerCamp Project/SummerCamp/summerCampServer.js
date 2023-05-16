// Set up requirements
const http = require("http");
const fs = require("fs");
const express = require("express");
const ejs = require("ejs");
const app = express();
const path = require("path");
const bodyParser = require("body-parser");
// username and password from .env file
require("dotenv").config();

const userName = String(process.env.MONGO_DB_USERNAME);
const password = String(process.env.MONGO_DB_PASSWORD);

const databaseAndCollection = {
  db: String(process.env.MONGO_DB_NAME),
  collection: String(process.env.MONGO_COLLECTION),
};
const { MongoClient, ServerApiVersion } = require("mongodb");
const { send } = require("process");

const httpSuccessStatus = 200;

// add user to db
async function addUser(nameIn, emailIn, gpaIn, bInfoIn) {
  const uri = String(
    `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`
  );

  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    let userAdd = {
      name: nameIn,
      email: emailIn,
      gpa: Number(gpaIn),
      backgroundInfo: bInfoIn,
    };
    const result = await client
      .db(databaseAndCollection.db)
      .collection(databaseAndCollection.collection)
      .insertOne(userAdd);
  } catch (e) {
    console.log(e);
  } finally {
    await client.close();
  }
}

// return the user by email search
async function findUser(emailIn) {
  const uri = `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    let filter = {
      email: emailIn,
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

// return the user by email search
async function findUsersGPA(gpaIn) {
  const uri = `mongodb+srv://${userName}:${password}@cluster0.tbynfv8.mongodb.net/?retryWrites=true&w=majority`;
  const client = new MongoClient(uri, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    serverApi: ServerApiVersion.v1,
  });

  try {
    await client.connect();
    let filter = {
      gpa: { $gte: gpaIn },
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
app.get("/", (request, response) => {
  response.render("index");
});

app.get("/apply", (request, response) => {
  response.render("apply");
});

app.post("/apply", (request, response) => {
  const variables = {
    name: request.body.name,
    email: request.body.email,
    gpa: request.body.gpa,
    backInfo: request.body.backgroundInfo,
  };
  // add user to database
  addUser(
    request.body.name,
    request.body.email,
    request.body.gpa,
    request.body.backgroundInfo
  );
  response.render("submitApp", variables);
});

app.get("/reviewApplication", (request, response) => {
  response.render("reviewApp");
});

// get the items from online and build
async function reviewMain(request, response) {
  let tempName = "NONE";
  let tempEmail = "NONE";
  let tempGpa = "NONE";
  let tempBackInfo = "NONE";

  try {
    const applicant = await findUser(request.body.email);
    if (applicant !== undefined && applicant.length > 0) {
      tempName = applicant[0].name;
      tempEmail = applicant[0].email;
      tempGpa = applicant[0].gpa;
      tempBackInfo = applicant[0].backgroundInfo;
    }
  } catch (err) {
    console.log(err);
  }

  const variables = {
    name: tempName,
    email: tempEmail,
    gpa: tempGpa,
    backInfo: tempBackInfo,
  };

  // account for missing information
  response.render("submitApp", variables);
}

app.post("/reviewApplication", (request, response) => {
  reviewMain(request, response);
});

app.get("/adminGFA", (request, response) => {
  response.render("adminGFA");
});

async function collectGfas(request, response) {
  let sendHtml = "";

  try {
    const applicants = await findUsersGPA(Number(request.body.gpa));
    // build table if not empty list
    if (applicants == []) {
      sendHtml = "No Users Found.";
    } else {
      sendHtml += "<table border = '1'>";
      sendHtml += "<tr><th>Name</th><th>GPA</th></tr>";
      applicants.forEach(
        (p) => (sendHtml += `<tr><td>${p.name}</td><td>${p.gpa}</td></tr>`)
      );
      sendHtml += "</table>";
    }
  } catch (err) {
    console.log(err);
  }

  const variables = {
    tableHtml: sendHtml,
  };

  response.render("processGFA", variables);
}

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
      sendHtml += "<br>"
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
const prompt = "Stop to shutdown the server: ";
process.stdout.write(prompt);

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
    process.stdout.write(prompt);
    process.stdin.resume();
  }
});
