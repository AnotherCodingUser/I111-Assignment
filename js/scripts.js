const CountryField = document.getElementById("Country");
const CityField = document.getElementById("City");
const TemperatureField = document.getElementById("Temperature");
const DescriptionField = document.getElementById("Description");
const WindSpeedField = document.getElementById("WindSpeed");
const CurrentImgField = document.getElementById("current-weather");

const ApiKey = 'openweathermap_API_KEY_HERE';

var map = L.map('map').setView([-40.35, 175.6167], 12);
var marker = L.marker([-40.35, 175.6167]).addTo(map);

function updateComboChange() {
    let inputValue = document.getElementById('cityInputValue').value,
    currentCity = inputValue;

    const CurrentWeatherApiUrl = `https://api.openweathermap.org/data/2.5/weather?q=${currentCity},NZ&units=metric&appid=${ApiKey}`
    fetch(CurrentWeatherApiUrl).then((response) => response.json()).then(data => {
        let description = data.weather[0].description;
        TemperatureField.innerHTML = `${data.main.temp}&deg; C`;
        DescriptionField.innerHTML = description;
        WindSpeedField.innerHTML = `${data.wind.speed} m/s`;
        let ImgToDisplay;
        let AltenativeText;

        if (description.includes("light rain")){
            ImgToDisplay = "images/weather/rain.jpg";
            AltenativeText = "light rain";
        }   
        if (description.includes("sun") || description.includes("clear")){
            ImgToDisplay = "images/weather/sun.jpg";
            AltenativeText = "clear and/or sunny";
        }   
        if (description.includes("cloud")){
            ImgToDisplay = "images/weather/cloud.jpg";
            AltenativeText = "cloudy";
        }   

        CurrentImgField.innerHTML = `<img src="${ImgToDisplay}" alt="Image displaying the current weather of ${AltenativeText}">`;
    
    });

    
    const WeatherField = document.getElementById("weather-info-grid");
    let first = true;
    const WeatherApiUrl = `https://api.openweathermap.org/data/2.5/forecast?q=${currentCity},NZ&units=metric&appid=${ApiKey}`;
    fetch(WeatherApiUrl).then((response) => response.json()).then(data => {
        let CityValue = data.city;
        CountryField.innerHTML = CityValue.country;
        CityField.innerHTML = CityValue.name;

        let forcastOutput =+ data.list.forEach(forecastLoop);
            L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png', {
            maxZoom: 19,
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        }).addTo(map);

        map.panTo(new L.LatLng(CityValue.coord.lat, CityValue.coord.lon));
        marker.setLatLng([CityValue.coord.lat, CityValue.coord.lon]);
    });

    let text = "";
    function forecastLoop(forecast) {
        const weekday = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
        let DatePrased = new Date(forecast.dt_txt)

        let description = forecast.weather[0].description;

        if (DatePrased.getHours() == 0) {
        
            text = text + `<div class="card">
                        <div class="header">
                            <h5>${weekday[DatePrased.getDay()]} noon</h5>
                            <img src="https://openweathermap.org/img/wn/${forecast.weather[0].icon}@2x.png" alt=${description}>
                        </div>
                        <p>${forecast.main.temp}&deg; C</p>
                        <p>${description}</p>
                    </div>`;
        if (first)
        {
            

            first = false;
        }
            WeatherField.innerHTML = text;
        }
        
    }
    
}
updateComboChange();
