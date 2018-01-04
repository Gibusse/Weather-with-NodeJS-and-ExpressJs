var getWeather = function(){
    http.get(link, (response) => {
    
        var body="";
        response.on('data', (chunk) => {
                body += chunk
            })

        
        response.on('end', () => {
            let weather = JSON.parse(body)
            for (let i = 0; i < 5; i++) {
                weathering.push(weather.list[i].main.temp);
               console.log(weathering);
               
            }
         res.render('index', {title: 'Weather', weathering: weathering})
        });
        
    });
}

exports.module = getWeather