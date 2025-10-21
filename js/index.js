const form = document.querySelector("form");
const cityName = document.getElementById("cit-name");
const stateName = document.getElementById("stat-name");
const countryInput = document.getElementById("country-code");
const resultContainer = document.getElementById("results-container");

const cityStateForm = document.getElementById("city-state-form");
const latLongForm = document.getElementById("lat-long-form");

const cityContent = document.getElementById("city");
const stateContent = document.getElementById("state-content");
const countryContent = document.getElementById("country-content");
const populationContent = document.getElementById("population-content");

const cloudCoverage = document.getElementById("cloud-coverage");
const windDirection = document.getElementById("wind-direction");
const windSpeed = document.getElementById("wind-speed");
const windGust = document.getElementById("wind-gust");
const humidity = document.getElementById("humidity");
const lat = document.getElementById("lat");
const long = document.getElementById("long");

const latitudeNumber = document.getElementById("latitude-number");
const longitudeNumber = document.getElementById("longitude-number");

// Second container
const nightDay = document.getElementById("night-day");
const temperature = document.getElementById("temperature");
const rainAmmount = document.getElementById("rain-ammount");
const infoSection = document.getElementById("info");

function getWindDirection(wind_direction) {
  if (wind_direction >= 315 || wind_direction < 45) {
    return "N";
  } else if (wind_direction >= 45 && wind_direction < 135) {
    return "E";
  } else if (wind_direction >= 135 && wind_direction < 225) {
    return "S";
  } else if (wind_direction >= 225 && wind_direction < 315) {
    return "W";
  } else {
    return "";
  }
}
cityStateForm.style.display = "flex";

form.addEventListener("submit", (e) => {
  e.preventDefault();

  //Fetching Data
  const getData = async (name1, state, country1) => {
    try {
      //Geo Data

      const geoResponse = await fetch(
        `https://geocoding-api.open-meteo.com/v1/search?name=${name1}&admin1=${state}&country_code=${country1}&count=10&language=en&format=json`
      );

      if (!geoResponse.ok) {
        throw new Error("");
      }
      const gData = await geoResponse.json();

      const geoData = gData.results;
      const data = geoData.find(
        (item) =>
          item.name === name1 &&
          state === item.admin1 &&
          item.country_code === country1
      );

      const { admin1, name, latitude, longitude, population, country } = data;

      const geoWeatherResponse = await fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&hourly=uv_index,is_day&current=temperature_2m,relative_humidity_2m,is_day,wind_direction_10m,wind_speed_10m,wind_gusts_10m,rain,cloud_cover&timezone=auto&forecast_days=1&wind_speed_unit=mph&temperature_unit=fahrenheit&precipitation_unit=inch&hourly=precipitation`
      );
      if (!geoWeatherResponse.ok) {
        throw new Error("");
      }

      const gWData = await geoWeatherResponse.json();

      const geoWData = gWData.current;

      let precipitation = gWData.hourly.precipitation;
      let totalPrecipitation = 0;
      precipitation.forEach((element) => {
        totalPrecipitation += element;
      });

      const {
        cloud_cover,
        is_day, //
        relative_humidity_2m,
        temperature_2m, //
        wind_direction_10m,
        wind_gusts_10m,
        wind_speed_10m,
      } = geoWData;

      console.log(
        cloud_cover,
        is_day,

        relative_humidity_2m,
        temperature_2m,
        wind_direction_10m,
        wind_gusts_10m,
        wind_speed_10m
      );

      cityContent.textContent = name;
      stateContent.textContent = admin1;
      countryContent.textContent = `${!country ? countryInput.value : country}`;
      populationContent.textContent = population.toLocaleString();

      cloudCoverage.textContent = cloud_cover + " %";
      windDirection.textContent = getWindDirection(wind_direction_10m);
      windSpeed.textContent = wind_speed_10m + " mph";
      windGust.textContent = wind_gusts_10m + " mph";
      humidity.textContent = relative_humidity_2m + " %";
      lat.textContent = latitude.toFixed(2) + "°";
      long.textContent = longitude.toFixed(2) + "°";
      rainAmmount.textContent = totalPrecipitation.toFixed(3) + " inch";

      if (is_day === 0) {
        infoSection.style.backgroundImage = "url('/images/night.png')";
      } else {
        infoSection.style.backgroundImage = "url('/images/day.png')";
      }
      nightDay.textContent = is_day === 0 ? "Night" : "Day";
      temperature.textContent = temperature_2m + " °F";

      resultContainer.style.display = "flex";

      form.reset();
    } catch (error) {
      console.log("Having Problems With the Fetch. Error : ", error);
      alert("Data Not Found , try with a different input");
      form.reset();
    }
  };

  getData(
    cityName.value.trim(),
    stateName.value.trim(),
    countryInput.value.trim()
  );
});
