document.addEventListener("DOMContentLoaded", function() {
    const apiKey = "L5281iKxuN9BvDUuGUdbsQInuVP3QUFr"; 
    const form = document.getElementById("cityForm");
    const weatherDiv = document.getElementById("weather");

    form.addEventListener("submit", function(event) {
        event.preventDefault();
        const city = document.getElementById("cityInput").value;
        getWeather(city);
    });

    function getWeather(city) {
        const url = `http://dataservice.accuweather.com/locations/v1/cities/search?apikey=${apiKey}&q=${city}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    const locationKey = data[0].Key;
                    fetchWeatherData(locationKey);
                    fetch5dayForecast(locationKey); 
                    fetchHourlyForeCast(locationKey); 
                } else {
                    weatherDiv.innerHTML = `<p>City not found.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching location data:", error);
                weatherDiv.innerHTML = `<p>Error fetching location data.</p>`;
            });
    }

    function fetchWeatherData(locationKey) {
        const url = `http://dataservice.accuweather.com/currentconditions/v1/${locationKey}?apikey=${apiKey}`;

        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length > 0) {
                    displayWeather(data[0]);
                } else {
                    weatherDiv.innerHTML = `<p>No weather data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching weather data:", error);
                weatherDiv.innerHTML = `<p>Error fetching weather data.</p>`;
            });
    }
    
    function fetch5dayForecast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/daily/5day/${locationKey}?apikey=${apiKey}`;
      
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.DailyForecasts) {
                    display5dayForecast(data.DailyForecasts);
                } else {
                    weatherDiv.innerHTML = `<p>No forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }
    function fetchHourlyForeCast(locationKey) {
        const url = `http://dataservice.accuweather.com/forecasts/v1/hourly/12hour/${locationKey}?apikey=${apiKey}&metric=true`;
      
        fetch(url)
            .then(response => response.json())
            .then(data => {
                if (data && data.length) {
                    displayHourlyForecast(data);
                } else {
                    weatherDiv.innerHTML = `<p>No Hourly forecast data available.</p>`;
                }
            })
            .catch(error => {
                console.error("Error fetching forecast data:", error);
                weatherDiv.innerHTML = `<p>Error fetching forecast data.</p>`;
            });
    }
      
    function displayWeather(data) {
        const temperature = data.Temperature.Metric.Value;
        const weather = data.WeatherText;
        const weatherContent = `
            <h2>Current Weather</h2>
            <p>Temperature: ${temperature}°C</p>
            <p>Weather: ${weather}</p>
        `;
        weatherDiv.innerHTML = weatherContent;
    }
    
    function display5dayForecast(forecast) {
        let forecastContent = `
            <h2>5 Day Forecast</h2>
        `;
        forecast.forEach(day => {
            const date = new Date(day.Date);
            const dayOfWeek = date.toLocaleDateString('en-US', { weekday: 'long' });
            const minimumTemp = day.Temperature.Minimum.Value;
            const maximumTemp = day.Temperature.Maximum.Value;
            const weather = day.Day.IconPhrase;
            
            forecastContent += `
                <div>
                    <h3>${dayOfWeek}</h3>
                    <p> Date: ${date}</p>
                    <p>Temperature: ${minimumTemp}°C - ${maximumTemp}°C</p>
                    <p>Weather: ${weather}</p>
                </div>
            `;
        });
        weatherDiv.innerHTML += forecastContent;
    }

    function displayHourlyForecast(data) {
       let forecastContent = `<h2> Hourly Forecast </h2>`;
       data.forEach(hourData => {
        const time = new Date(hourData.DateTime).toLocaleTimeString('en-US', {hour: 'numeric', hour12: true});
        const temp = hourData.Temperature.Value;
        forecastContent += `
            <p> ${time} : ${temp}°C</p>
        `;
       });
       weatherDiv.innerHTML += forecastContent;
    }
    
    
});
