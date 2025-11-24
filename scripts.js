
async function getWeather() {
  const city = document.getElementById('cityInput').value.trim();
  const apiKey = "031bf2b415b90cf98cbbae0cad7021d2";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  if (!city) {
    alert("Please enter a city name!");
    return;
  }

  try {
    const response = await fetch(url);
    const data = await response.json();
    const weatherBox = document.getElementById('weatherResult');

    if (data.cod === 200) {
      const weatherMain = data.weather[0].main.toLowerCase();
      const weatherDesc = data.weather[0].description.toLowerCase();

      setBackground(weatherMain, weatherDesc);

      let emoji = getEmoji(weatherMain, weatherDesc);
      weatherBox.innerHTML = `
        <h2>${emoji} ${data.name}, ${data.sys.country}</h2>
        <p>🌡️ Temperature: ${data.main.temp}°C</p>
        <p>🌤️ Weather: ${data.weather[0].description}</p>
        <p>💧 Humidity: ${data.main.humidity}%</p>
      `;

      // Store coordinates for yesterday/tomorrow forecast
      const { lon, lat } = data.coord;
      document.getElementById("forecastContent").innerHTML = "Choose a tab to view forecast.";
      setupTabs(city, lat, lon);
    } else {
      weatherBox.innerHTML = `<p>⚠️ ${data.message}</p>`;
    }
  } catch (error) {
    document.getElementById('weatherResult').innerHTML = `<p>❌ Error fetching data</p>`;
    console.error(error);
  }
}

function setupTabs(city, lat, lon) {
  const yesterdayBtn = document.getElementById("yesterdayTab");
  const todayBtn = document.getElementById("todayTab");
  const tomorrowBtn = document.getElementById("tomorrowTab");

  const buttons = [yesterdayBtn, todayBtn, tomorrowBtn];

  buttons.forEach(btn => btn.classList.remove("active"));
  todayBtn.classList.add("active");
  loadToday(city);

  yesterdayBtn.onclick = () => {
    setActive(yesterdayBtn, buttons);
    loadYesterday(lat, lon);
  };
  todayBtn.onclick = () => {
    setActive(todayBtn, buttons);
    loadToday(city);
  };
  tomorrowBtn.onclick = () => {
    setActive(tomorrowBtn, buttons);
    loadTomorrow(city);
  };
}

function setActive(activeBtn, allBtns) {
  allBtns.forEach(b => b.classList.remove("active"));
  activeBtn.classList.add("active");
}

function getEmoji(main, desc = "") {
  let emoji = "🌤️";
  if (main.includes("clear")) emoji = "☀️";
  else if (main.includes("cloud")) emoji = "☁️";
  else if (main.includes("rain") || desc.includes("rain")) emoji = "🌧️";
  else if (main.includes("thunderstorm")) emoji = "⛈️";
  else if (main.includes("snow")) emoji = "❄️";
  else if (main.includes("mist") || main.includes("fog") || main.includes("haze")) emoji = "🌫️";
  return emoji;
}

async function loadToday(city) {
  document.getElementById("forecastContent").innerHTML = "Loading today’s weather...";
  const apiKey = "031bf2b415b90cf98cbbae0cad7021d2";
  const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();
  const emoji = getEmoji(data.weather[0].main, data.weather[0].description);
  document.getElementById("forecastContent").innerHTML = `
    <p>${emoji} ${data.weather[0].description}</p>
    <p>🌡️ ${data.main.temp}°C | 💧 ${data.main.humidity}% humidity</p>
  `;
}

async function loadTomorrow(city) {
  document.getElementById("forecastContent").innerHTML = "Loading tomorrow’s forecast...";
  const apiKey = "031bf2b415b90cf98cbbae0cad7021d2";
  const url = `https://api.openweathermap.org/data/2.5/forecast?q=${city}&appid=${apiKey}&units=metric`;

  const res = await fetch(url);
  const data = await res.json();

  if (data.cod === "200") {
    const tomorrow = data.list[8]; // 24 hours later
    const emoji = getEmoji(tomorrow.weather[0].main, tomorrow.weather[0].description);
    document.getElementById("forecastContent").innerHTML = `
      <p>${emoji} ${tomorrow.weather[0].description}</p>
      <p>🌡️ ${tomorrow.main.temp}°C | 💧 ${tomorrow.main.humidity}% humidity</p>
    `;
  } else {
    document.getElementById("forecastContent").innerHTML = `<p>⚠️ Forecast not available</p>`;
  }
}

async function loadYesterday(lat, lon) {
  document.getElementById("forecastContent").innerHTML = "Loading yesterday’s weather...";
  const apiKey = "031bf2b415b90cf98cbbae0cad7021d2";
  const yesterdayTimestamp = Math.floor(Date.now() / 1000) - 86400;
  const url = `https://api.openweathermap.org/data/2.5/onecall/timemachine?lat=${lat}&lon=${lon}&dt=${yesterdayTimestamp}&appid=${apiKey}&units=metric`;

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.current) {
      const main = data.current.weather[0].main.toLowerCase();
      const desc = data.current.weather[0].description;
      const emoji = getEmoji(main, desc);
      document.getElementById("forecastContent").innerHTML = `
        <p>${emoji} ${desc}</p>
        <p>🌡️ ${data.current.temp}°C | 💧 ${data.current.humidity}% humidity</p>
      `;
    } else {
      document.getElementById("forecastContent").innerHTML = `<p>⚠️ Yesterday's data not available</p>`;
    }
  } catch (error) {
    console.error(error);
    document.getElementById("forecastContent").innerHTML = `<p>❌ Error loading yesterday’s weather</p>`;
  }
}

function setBackground(weatherMain, weatherDesc) {
  let bgImage = "default.jpg";

  if (weatherMain.includes("clear")) bgImage = "clear2.avif";
  else if (weatherDesc.includes("overcast")) bgImage = "overcast.png";
  else if (weatherMain.includes("cloud")) bgImage = "cloudy2.png";
  else if (weatherMain.includes("mist")) bgImage = "mist.png";
  else if (weatherMain.includes("rain") || weatherDesc.includes("rain")) {
    if (weatherDesc.includes("light rain")) bgImage = "lightrain.avif";
    else if (weatherDesc.includes("heavy rain")) bgImage = "heavyrain.avif";
    else bgImage = "heavyrain.webp";
  } else if (weatherMain.includes("thunderstorm")) bgImage = "thunder.avif";
  else if (weatherMain.includes("snow")) bgImage = "snow.webp";
  else if (weatherMain.includes("fog") || weatherMain.includes("haze")) bgImage = "fog2.png";
  else if (weatherMain.includes("sunny")) bgImage = "sunny.png";

  document.body.style.backgroundImage = `url('${bgImage}')`;
  document.body.style.backgroundSize = "cover";
  document.body.style.backgroundPosition = "center";
  document.body.style.backgroundRepeat = "no-repeat";
}
