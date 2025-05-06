const apiKey = "KUKSH2XMK8YQ2BKKKM4CJE7WY";
const weatherInfo = document.getElementById("weatherInfo");
const historyList = document.getElementById("historyList");

function getWeather() {
  const cityInput = document.getElementById("cityInput").value;
  if (!cityInput) return;

  const url = `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${cityInput}?unitGroup=metric&key=${apiKey}&contentType=json`;

  fetch(url)
    .then(response => response.json())
    .then(data => {
      if (data.status === 400 || data.code === 400 || data.message?.includes("error")) {
        weatherInfo.innerHTML = "City not found or API error!";
        return;
      }

      const temp = data.currentConditions.temp;
      const description = data.currentConditions.conditions;
      const icon = data.currentConditions.icon;

      // Clean city name
      let cityName = data.resolvedAddress.replace(/[^\x00-\x7F]/g, "").trim();
      if (cityName === "," || cityName === "") {
        cityName = cityInput;
      }

      weatherInfo.innerHTML = `
        <h3>${cityName}</h3>
        <p>${temp}°C</p>
        <p>${description}</p>
        <img src="https://raw.githubusercontent.com/visualcrossing/WeatherIcons/main/PNG/2nd%20Set%20-%20Color/${icon}.png" width="60"/>
      `;

      changeBackground(description);
      saveHistory(cityName);
    })
    .catch(error => {
      weatherInfo.innerHTML = "Error fetching weather.";
      console.error("Fetch error:", error);
    });
}

function changeBackground(desc) {
  desc = desc.toLowerCase();

  if (desc.includes("rain") || desc.includes("drizzle") || desc.includes("thunderstorm")) {
    document.body.style.backgroundImage = "url('rain.png')";
  } else if (desc.includes("cloud") || desc.includes("overcast")) {
    document.body.style.backgroundImage = "url('overcast.png')"; // Local image
  } else if (desc.includes("snow") || desc.includes("sleet") || desc.includes("ice")) {
    document.body.style.backgroundImage = "url('snow.png')";
  } else if (desc.includes("fog") || desc.includes("mist") || desc.includes("haze")) {
    document.body.style.backgroundImage = "url('fog.jpg')";
  } else if (desc.includes("clear") || desc.includes("sun")) {
    document.body.style.backgroundImage = "url('sun.jpg')";
  } else {
    document.body.style.backgroundImage = "url('cloud.png')";
  }

  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}

function saveHistory(city) {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  if (!history.includes(city)) {
    history.push(city);
    localStorage.setItem("weatherHistory", JSON.stringify(history));
    displayHistory();
  }
}

function displayHistory() {
  let history = JSON.parse(localStorage.getItem("weatherHistory")) || [];
  historyList.innerHTML = "";
  history.forEach(city => {
    let li = document.createElement("li");
    li.textContent = city;
    li.style.fontFamily = "Arial, sans-serif";
    li.onclick = () => {
      document.getElementById("cityInput").value = city;
      getWeather();
    };
    historyList.appendChild(li);
  });
}

function clearHistory() {
  localStorage.removeItem("weatherHistory");
  displayHistory();
}

// Initial display
displayHistory();
