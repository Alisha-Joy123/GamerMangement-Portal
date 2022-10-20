require('./models/db');

const express= require('express');
const path = require('path');
const expres = require('express-handlebars');
const bodyParser= require('body-parser')

const userController = require('./controllers/userController');
const exphbs = require('express-handlebars');

var app = express();
app.use(bodyParser.urlencoded({
    extended:true
}));
app.use(bodyParser.json());
app.use(express.static(__dirname + '/public'));
app.use(express.static(__dirname + '/script'));
app.set('views',path.join(__dirname,'/views/'));

app.engine('hbs',exphbs.engine({extname:'hbs',defaultLayout:'mainLayout',layoutsDir: __dirname + 
'/views/layouts/'}));
app.set('view engine','hbs');

app.listen(3000,() => {
    console.log("Express server started at port :3000");
});

app.use('/',userController);