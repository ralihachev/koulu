require ('rootpath')();
var express = require('express');
var app = express();
var session = require('express-session');
var bodyParser = require('body-parser');
var expressJwt = require('express-jwt');
var config = require ('config.json');
var port = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', __dirname + '/views');
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(session({secret: config.secret, resave: false, saveUninitialized: true}));

app.use('/api', expressJwt({secret: config.secret}).unless({path: ['/api/users/authenticate', '/api/users/register']}));

app.use('/login', require('./controllers/login.controller'));
app.use('/register', require('./controllers/register.controller'));
app.use('/app', require('./controllers/app.controller'));
app.use('/api/users', require('./controllers/api/users.controller'));

app.get('/', function (req, res){
    return res.redirect('/app')
});



var server = app.listen(port, function(){
    console.log('Server listening on port 3000')
});