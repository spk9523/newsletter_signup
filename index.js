const express = require("express"); // Import the Express framework
const bodyParser = require("body-parser"); // Import the body-parser middleware
const request = require("request"); // Import the request module
const https = require("https"); // Import the built-in https module
const config = require("./config");

const app = express(); // Create an instance of the Express application

app.use(express.static("public")); // Serve static files from the "public" directory

app.use(bodyParser.urlencoded({extended: true})); // Parse URL-encoded data

app.get("/", function(req, res) {
    res.sendFile(__dirname + "/index.html"); // Send the "index.html" file as the response for GET requests to the root URL ("/")
});

app.post("/", function(req, res) {
    // Extract data from the request body
    const firstName = req.body.fName; // Get the value of the "fName" field from the request body
    const lastName = req.body.lName; // Get the value of the "lName" field from the request body
    const email = req.body.email; // Get the value of the "email" field from the request body

    // Prepare data to be sent to Mailchimp API
    const data = {
        members: [
            {
                email_address: email, // Set the email address of the member
                status: "subscribed", // Set the subscription status as "subscribed"
                merge_fields: {
                    FNAME: firstName, // Set the first name of the member
                    LNAME: lastName // Set the last name of the member
                }
            }
        ]
    };

    const jsonData = JSON.stringify(data); // Convert data to JSON string

    const apiKey = config.API_KEY;
    const listID = config.LIST_ID;


    const url = `https://us10.api.mailchimp.com/3.0/lists/${listID}`; // Mailchimp API endpoint

    const options = {
        method: "POST",
        auth: `prakash:${apiKey}` // API authentication credentials
    };

    // Make an HTTPS request to the Mailchimp API
    const request = https.request(url, options, function(response) {
        if (response.statusCode === 200) {
            res.sendFile(__dirname + "/success.html"); // Send the "success.html" file as the response if the request is successful
        } else {
            res.sendFile(__dirname + "/failure.html"); // Send the "failure.html" file as the response if the request fails
        }
    });

    request.write(jsonData); // Send the JSON data in the request body
    request.end(); // End the request

});

app.post("/failure", function(req, res) {
    res.redirect("/"); // Redirect to the root URL ("/") for POST requests to "/failure"
});

app.listen(process.env.PORT || 3000, function() {
    console.log("Server is running on port 3000"); // Start the server and listen on port 3000
});
