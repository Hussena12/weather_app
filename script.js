"use strict";

const blankData = document.querySelector(".blank");
const balnkInfo = document.querySelector(".blank-info");
const weekData = document.querySelector(".weekSec");
const weekContainer = document.querySelector(".week-data");
const hourlyData = document.querySelector(".hourlyData");
const hourlyContainer = document.querySelector(".hourContent");
////////////////////////////////////////

let insertWeek;
let insertHourly;;
let seven;
/////////////////////

const blankFill = function (cityName, getweather) {
    const html = `
    <div class="blank-info">
              <div class="city">
                <p class="city-name">${cityName}</p>
                <p class="blank-rain">Chance of rain: 0%</p>
                <p class="blank-temp">${
                  getweather.current_weather.temperature
                }</p>
              </div>
              <img class="blank-img" src="${
                weatherIcon[getweather.current_weather.weathercode]
              }" />
            </div>
  `;
  
    blankData.innerHTML = "";
    blankData.insertAdjacentHTML("afterbegin", html);
    blankData.style.opacity = 1;
  };

  

  const weatherIcon = {
    0: "images/sun.png",
    1: " images/weather.png",
    2: " images/cloudy.png",
    3: " images/overcast.png",
    45: " 🌫️",
    48: " ❄️",
    51: " 🌦️",
    61: " images/heavy-rain.png",
    71: "images/snowflake.png",
    95: " ⛈️",
  };
  
  const weatherCodes = {
    0: "Clear sky ",
    1: "Mainly clear ",
    2: "Partly cloudy ",
    3: "Overcast ",
    45: "Fog ",
    48: "Depositing rime fog ",
    51: "Drizzle ",
    61: "Rain ",
    71: "Snowfall ",
    95: "Thunderstorm ",
  };
  

  
document.addEventListener("DOMContentLoaded", function () {
    const inputValue = document.getElementById("city-input");
  
    if (!inputValue) {
      console.error("Element with ID 'city-input' not found.");
      return; // Stop execution if input is missing
    }
  
    inputValue.addEventListener("keydown", async function (e) {
      if (e.key === "Enter") {
        e.preventDefault();
        const cityName = inputValue.value.trim(); // Trim to remove extra spaces
  
        try {
          // get coordinates by city name
          const coords = await fetch(
            `https://api.openweathermap.org/geo/1.0/direct?q=${cityName}&limit=5&appid=6fdd4316b0fdb901903680eda8e785d2`
          );
          if (!coords) throw new Error("can't get the coordinates");
  
          const getcoords = await coords.json();
          const { lat, lon } = getcoords?.[0];
  
          // get  weather data by coordinates
          const weatherInfo = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current_weather=true&hourly=weathercode`
          );
          if (!weatherInfo) throw new Error("can't get the weather data");
  
          const getWeather = await weatherInfo.json();
          console.log(getWeather);
  
          // getting the blank data
          blankFill(cityName, getWeather);
          ///
  
          
        insertHourly = getWeather.hourly.weathercode.map((code, index) => ({
            temp: getWeather.current_weather.temperature,
            icon: weatherIcon[code],
          }));
          
          const getweek = insertHourly
           seven = getweek.slice(0,6)
          console.log(seven)

          hourlyFill()

  
          // get 7  days weather data
          const weekWeatherData = await fetch(
            `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&daily=weathercode,temperature_2m_max&timezone=Africa/Nairobi`
          );
          if (!weekWeatherData) throw new Error(" can't get the 7 days data");
  
          const getWeekly = await weekWeatherData.json();
          console.log(getWeekly);

          insertWeek = getWeekly.daily.weathercode.map((code, index) => ({
            icon: weatherIcon[code],
            temp: getWeekly.daily.temperature_2m_max[index],
            weather: weatherCodes[code],
          }));

          console.log(insertWeek)
          weekOrg();
  
        } catch (err) {
          console.error(err);
        }
      }
    });
  });
  

  
const weekOrg = function () {
    const weekDays = ["Sun", "Mon", "Tue", "Wedn", "Thur", "Fri", "Sat"];
    weekData.innerHTML = "";
  
    insertWeek.forEach(function ({ icon, temp, weather }, index) {
      const today = new Date();
      const dayIndex = (today.getDay() + index) % 7;
      const getDay = index === 0 ? "Today" : weekDays[dayIndex];
  
      const html = `
      <div class="week-data">
              <p class="week-day">${getDay}</p>
              <div class="week-weather">
                <img class="week-img" src="${icon}" alt="weather-img" />
                <p class="day-weather">${weather}</p>
              </div>
              <p class="week-temp"><span>${temp}</span></p>
            </div>
      `;
  
      weekContainer.insertAdjacentHTML("beforeend", html);
      weekData.innerHTML += html;
    });
  };


  const hourlyFill = function () {
      hourlyData.innerHTML = "";

    seven.forEach(function ({ icon, temp },i) {
      let time = new Date();
      let getTime = `${time.getHours()}`;
      let nextHour;

          nextHour = (Number(getTime) + i) % 24;
  
        const html = ` <div class="hourContent">
      <p class="hour">${nextHour}:00</p>
      <img
         class="hourImg"
         src="${icon}"
        alt="weather image"
      />
      <p class="temp">${temp}</p>
     </div>`;
  
        hourlyContainer.insertAdjacentHTML("beforeend", html);
        hourlyContainer.style.opacity = 1;
        hourlyData.innerHTML += html;
    
      
    });
  };
  