const express = require('express');
const bodyParser = require('body-parser');
const jwt = require('jsonwebtoken');
const key = "SAVGAQFasdfwgf432fgfghg5wqefewT"
const app = new express();

app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())


var movies = [
    {
        name:'The Shawshank Redemption',
        year:1994,
        addedby : 'admin'
    },
    {
        name:'The Green Mile',
        year: 1999,
        addedby : 'admin'
    }
]


var middleware = function (req, res, next) {
    if(req.headers['authorization']){
       jwt.verify(req.headers['authorization'], key, (err, decoded)=>{
       if(decoded && decoded.username){
         req.body.addedby = decoded.username;
         next();
       }else{
        res.send("Invalid request.. please call login")
       }})
    }else{
        res.send("Invalid request.. please call login")
    }
  }


app.get('/login',(req, res)=>{
    var username = req.headers.username;
    var token = jwt.sign({ 
        username: username,
        issuedby: 'express-jwt',
        issuedat: Date.now()}, key);
    console.log(token);
    res.send(token);
})  

app.get('/movies',(req, res)=>{
    res.json(movies);
})

app.post('/movies', middleware, (req, res)=>{
    var movie = req.body;
    movies.push(movie);
    res.status(201).json(movie);
})

app.listen(3000,(res)=>{
    console.log('working on 3000')
})