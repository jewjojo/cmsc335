// Set up requirements
const http = require('http');
const fs = require('fs');
const express = require('express');
const ejs = require('ejs');
const app = express();
const path = require('path');
const bodyParser = require("body-parser");

const portNumber = 5000;
const httpSuccessStatus = 200;


// custom class
class jsonTable {
    #jsonItems;

    constructor(json) {
        this.#jsonItems = json.itemsList;
    }

    // returns html for a name/cost table of the json items
    makeTable() {
        let tableContent = "";
        tableContent += "<table border = '1'>";
        tableContent += "<tr><th>Item</th><th>Cost</th></tr>"
        this.#jsonItems.forEach(p => tableContent += `<tr><td>${p.name}</td><td>${p.cost.toFixed(2)}</td></tr>`);
        tableContent += "</table>";
        return tableContent;
    }

    makeDropDown() {
        let selectContent = "";
        this.#jsonItems.forEach(p => selectContent += `<option value="${p.name}">${p.name}</option>`);
        return selectContent;
    }

    get() {
        let content = [];
        this.#jsonItems.forEach(p => content.push(p));
        return content;
    }
}

// set encoding so webpage can be parsed
process.stdin.setEncoding("utf8");

// load json information
let data = fs.readFileSync(process.argv[2], 'utf8');
let json = JSON.parse(data);
let newJsonTable = new jsonTable(json);

// set up systems for webpage
app.set("views", path.resolve(__dirname, "templates"));
app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({extended:false}));

// set up different pages
app.get("/", (request, response) => {
    response.render("index");
});

app.get("/catalog", (request, response) => {
    const variables = {
        itemsTable: newJsonTable.makeTable()
    };
    response.render("displayItems", variables);
});

app.get("/order", (request, response) => {
    const variables = {
        items: newJsonTable.makeDropDown()
    };

    response.render("placeOrder", variables);
});

app.post("/order", (request, response) => {
    // account for solo items returning as not an array
    if (Array.isArray(request.body.itemsSelected)) {
        box = request.body.itemsSelected;
    } else {
        box = [request.body.itemsSelected];
    }
    
    let temp = newJsonTable.get().filter(p => box.some(p2 => p2 === p.name) == true);
    let sum = 0;
    let newTable = "";
    newTable += "<table border = '1'>";
    newTable += "<tr><th>Item</th><th>Cost</th></tr>"
    temp.forEach(p => newTable += `<tr><td>${p.name}</td><td>${p.cost.toFixed(2)}</td></tr>`);
    temp.forEach(p => sum += p.cost);
    sum = String(sum).replace('.00','');
    newTable += `<tr><td>Total Cost</td><td>${sum}</td></tr>`;
    newTable += "</table>";

    const variables = {
        name: request.body.name,
        email: request.body.email,
        delivery: request.body.delivery,
        orderTable: newTable
    };
    response.render("orderConfirmation", variables);
});

app.listen(portNumber);

// Ensure correct argument count
if (process.argv.length != 3) {
    process.stdout.write("Usage supermarketServer.js jsonFile");
    process.exit(1);
}

// Print expected information to terminal
process.stdout.write(`Web server started and running at http://localhost:${portNumber}\n`);
const prompt = "Type itemsList or stop to shutdown the server: ";
process.stdout.write(prompt);

// terminal interface loop
process.stdin.on('readable', () => {
    let dataInput = process.stdin.read();
    if (dataInput !== null) {
        let command = dataInput.trim();
        // stop command
        if (command === "stop") {
            process.stdout.write("Shutting down the server\n")
            process.exit(0);
        }
        // log json
        else if (command === "itemsList") {
            let data = fs.readFileSync(process.argv[2], 'utf8');
            console.log('', json.itemsList);
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