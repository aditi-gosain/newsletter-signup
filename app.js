const express = require("express");
const https = require("https");
//const request = require("request");
const bodyParser = require("body-parser");
const { dirname } = require("path");
//const bootstrap = require("bootstrap");

const app = express();
app.use(bodyParser.urlencoded({extended: true}));

app.use(express.static("public"));

app.get("/", function(req,res){
    res.sendFile(__dirname+"/signup.html");
});

app.post("/", function(req,res){
    const firstName = req.body.fName;
    const lastName = req.body.lName;
    const email = req.body.email;
    console.log(firstName, lastName);

    const data = {
        members: [{
             email_address: email, 
             status: "subscribed",
             merge_fields: {
                FNAME: firstName,
                LNAME: lastName
             }
        }]
    }
    const jsonData = JSON.stringify(data)

    const url = "https://us9.api.mailchimp.com/3.0/lists/374e7d636d"

    const options = {
        method: "POST",
        auth: "aditi:f271620e8de73a0a264bb3bd9febf006-us9"
    }

    const request = https.request(url, options, function(response){

        if(response.statusCode === 200){
            res.sendFile(__dirname+"/success.html");
        }
        else
        {
            res.sendFile(__dirname+"/failure.html");
        }

        response.on("data", function(data){
            console.log(JSON.parse(data));
        })
    })

    request.write(jsonData);
    request.end();
})

app.post("/failure", function(req, res){
    res.redirect("/")
})

app.listen(process.env.PORT || 3000, function()
{
    console.log("Server is running on port 3000");
    //console.log(__dirname + "/public");
});

//api key
//f271620e8de73a0a264bb3bd9febf006-us9

//audience id
//374e7d636d