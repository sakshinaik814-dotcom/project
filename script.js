/*async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const apiKey = '031bf2b415b90cf98cbbae0cad7021d2'; // Replace with your OpenWeatherMap API key
    const url = `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`;

    try {
        const response = await fetch(url);
        const data = await response.json();

        if(data.cod === 200){
            const icon = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`;

            document.getElementById('weatherResult').innerHTML = `
                <h2>${data.name}, ${data.sys.country}</h2>
                <img src="${icon}" alt="Weather Icon">
                <p>Temperature: ${data.main.temp}°C</p>
                <p>Weather: ${data.weather[0].description}</p>
                <p>Humidity: ${data.main.humidity}%</p>
            `;
        } else {
            document.getElementById('weatherResult').innerHTML = `<p>${data.message}</p>`;
        }
    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data</p>`;
    }
*/
async function getWeather() {
    const city = document.getElementById('cityInput').value;
    const url = `https://wttr.in/${city}?format=j1`; // free API, no key needed

    try {
        const response = await fetch(url);
        const data = await response.json();

        const current = data.current_condition[0];
        const temp = current.temp_C;
        const weatherDesc = current.weatherDesc[0].value;
        const humidity = current.humidity;

        document.getElementById('weatherResult').innerHTML = `
            <h2>${city}</h2>
            <p>Temperature: ${temp}°C</p>
            <p>Weather: ${weatherDesc}</p>
            <p>Humidity: ${humidity}%</p>
        `;
    } catch (error) {
        document.getElementById('weatherResult').innerHTML = `<p>Error fetching weather data</p>`;
    }
}

