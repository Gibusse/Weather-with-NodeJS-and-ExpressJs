'use strict'

const express = require('express')
const fs = require('fs')
const http = require('http')
const devRest = require('dev-rest-proxy')
const bodyParser = require('body-parser')
const ejs = require('ejs')
const struglify = require('strman').slugify
const session = require('express-session')
const where = require('node-where')
const ip = require('ip')
const geoip = require('geoip-lite');

const app = express()



// Middleware
app.use(bodyParser.json(200, {'Content-Type': 'javascript/json'}))
app.use(bodyParser.urlencoded( {extended: true}))
app.use('/assets', express.static('public'));
app.use(session({
    secret: 'weather city',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: true }
}));


app.use(function(req, res, next) {
    where.is(req.ipv, function(err, result) {
        req.geoip = result;
        next();
    });
});

// Moteur de template
app.set('view engine', 'ejs')

//app.set('port', '8080');

let city = ""
var error = {"cod":"404","message":"city not found"}


app.get('/', (req, res) => {
    var weathering ='';
   res.render('index', {title:'Weather', weathering: weathering})

})

app.post('/', (req, res, e) => {
    var weathering = [];
    var main = [];
    var time = [];
    var name = {};
    var country = {};
    var lat = {};
    var long = {};
    var icon = [];
    var min =[];
    var max = [];
    city = req.body.city;
    if (city === undefined || city === ''){
        
        http.get('http://api.openweathermap.org/data/2.5/forecast?q=""&units=metric&appid=0c4bf74af5590acadd0597aded957e0b', (response) => {
            
                var body="";
                response.on('data', (chunk) => {
                        body += chunk
                    })
        
                response.on('end', () => {
                    let weather = JSON.parse(body)
                    if(weather.cod === '404') {
                       
                        res.render('index', {title: 'Weather', weather: weather})
                        res.end();
                    } else {
                        for (let i = 0; i < 5; i++) {
                            min.push(weather.list[i].main.temp_min);
                            max.push(weather.list[i].main.temp_max);
                            main.push(weather.list[i].weather[0].description);
                            icon.push(weather.list[i].weather[0].icon);
                            time.push(weather.list[i].dt_txt)
                        }

                        name = weather.city.name;
                        country = struglify(weather.city.country);
                        lat = weather.city.coord.lat;
                        long = weather.city.coord.lon;
                    }
                    
                 res.render('weather', {title: 'Weather',weather: weather, min: min,max:max, main: main,icon:icon,
                  time: time,country:country,lat :lat,long:long, name:name, city: city})
                });
                
            });
    } else {
        http.get('http://api.openweathermap.org/data/2.5/forecast?q='+city+'&units=metric&appid=0c4bf74af5590acadd0597aded957e0b', (response) => {
            
                var body="";
                response.on('data', (chunk) => {
                        body += chunk
                    })
        
                response.on('end', () => {
                    let weather = JSON.parse(body)

                    if(weather.cod === '404') {
                       
                        res.render('index', {title: 'Weather', weather: weather})
                        res.end();
                    } else {
                        for (let i = 0; i < 5; i++) {
                            min.push(weather.list[i].main.temp_min);
                            max.push(weather.list[i].main.temp_max);
                            main.push(weather.list[i].weather[0].description);
                            icon.push(weather.list[i].weather[0].icon);
                            time.push(weather.list[i].dt_txt)
                        }

                        name = weather.city.name;
                        country = struglify(weather.city.country);
                        lat = weather.city.coord.lat;
                        long = weather.city.coord.lon;
						res.render('weather', {title: 'Weather',weather: weather, min: min,max:max, main: main,icon:icon,
						time: time,country:country,lat :lat,long:long, name:name, city: city})
                    }
                    
                 
                });
                
            });
    }
    
})

app.get('/about', (req, res) => {
    res.render('about', {title:'Weather'})
    res.end()
})

app.listen(3000)
