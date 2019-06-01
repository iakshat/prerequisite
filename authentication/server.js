const express = require('express');
const bodyParser = require('body-parser');
const mysql = require("mysql"); 
const bcrypt = require("bcrypt");
const saltrounds = 10;

var connection = mysql.createConnection({
    host : "localhost",
    user : "akshat",
    password : "cheeseMomo",
    database : "user_data"
});

connection.connect((err) => {
    if(err){
        console.log("error in connecting to DB");
    }else{
        console.log("connected to DB");
    }
});

var server = express();

server.use(bodyParser.urlencoded( {extended : false} ));
server.use(bodyParser.json());

server.get("/", (req, res) => {
    res.sendFile(__dirname + "/home.html");
});

server.get('/login', (req, res)=>{
    res.sendFile(__dirname+"/login.html");
});

server.post('/login', (req, res)=>{
    console.log(req.body);
    connection.query("SELECT * FROM user WHERE username = ?",(req.body.username), (err, rows, fields) => {
        if(err){
            console.log("error in searching user");
        }else if(rows.length === 0){
            res.send("not a user");
        }else{
            console.log(rows[0].password.toString());
            console.log(req.body.password);
            bcrypt.compare(req.body.password, rows[0].password.toString(), (err, check)=>{
                if(err){
                    console.log("error in verifying password")
                }else if(check){
                    res.send("user verified");
                }else{
                    res.send("invalid password");
                }
            });
        }
    });
});

server.get('/newuser', (req, res) => {
    res.sendFile(__dirname + "/newUser.html");
});

server.post('/newuser', (req, res) => {
    connection.query("SELECT * FROM user WHERE username = ?;",(req.body.username), (err, rows, fields) => {
        if(err){
            console.log("error while verifying username availability");
        }else if(rows.length != 0){
            res.send("username not available");
        }else{
            var d=req.body;
            bcrypt.hash(d.password, saltrounds, (err, hash) => {
                if(err){
                    console.log("error in hashing");
                }else{

                    connection.query("INSERT INTO user (username, first, last, email, nationality, password) VALUES (?, ?, ?, ?, ?, ?);",
                                                [d.username, d.first, d.last, d.email, d.nationality, hash], (err) => {
                                                    if(err){
                                                        console.log("error in writing to DB");
                                                    }else{
                                                        res.send("success");
                                                        console.log("user added: ");
                                                        console.log(d);
                                                        console.log("Hashed password: " + hash);
                                                    }
                                                });
                }
            })
        }
    } )
});

server.listen(2000, () => {
    console.log('server running on port 2000');
});