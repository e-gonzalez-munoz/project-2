// Function to get latitude and longitude from postcode
const getCoordinatesFromPostcode = async (postcode) => {
    const response = await fetch(`https://api.postcodes.io/postcodes/${postcode}`);
    const data = await response.json();
    return {
        latitude: data.result.latitude,
        longitude: data.result.longitude
    };
};

// Function to fetch weather data from OpenWeatherMap API
const getWeatherForecast = async (latitude, longitude, apiKey) => {
    const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&appid=${apiKey}`);
    const data = await response.json();
    return data;
};

// Function to initialize and display the map
const initMap = async (latitude, longitude) => {
    const map = L.map('map').setView([latitude, longitude], 13); // Initialize map centered at the latitude and longitude
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png').addTo(map); // Add OpenStreetMap tiles
    L.marker([latitude, longitude]).addTo(map); // Add marker at the latitude and longitude
};

// Function to fetch Four Square Data
const fetchFoursquareData = async (latitude, longitude) => {
    const options = {
        method: 'GET',
        headers: {
            accept: 'application/json',
            Authorization: 'fsq3e+kaG4WTN75dTTWekQCFUs0tl2enjkNCt6JgToBGHAw='
        }
    };

    const url = `https://api.foursquare.com/v3/places/search?ll=${latitude},${longitude}`;

    try {
        const response = await fetch(url, options);
        if (!response.ok) {
            throw new Error('Failed to fetch data from Foursquare API');
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data from Foursquare API:', error);
        return null;
    }
};

// Function to handle form submission
const handleSubmit = async (event) => {
    event.preventDefault(); // Prevent the default form submission behavior
    const userInput = document.querySelector('#postCode');
    const postcode = userInput.value;
    const apiKey = "c2ec54a97eb714e25c3ad89a4fde4e44"; // Replace with your OpenWeatherMap API key

    // Get latitude and longitude for the postcode
    try {
        const { latitude, longitude } = await getCoordinatesFromPostcode(postcode);

        // Get weather forecast for the postcode
        const weatherData = await getWeatherForecast(latitude, longitude, apiKey);
        console.log(weatherData); // Display weather data

        // Fetch data from Foursquare using the postcode coordinates
        const foursquareData = await fetchFoursquareData(latitude, longitude);
        console.log(foursquareData); // Display Foursquare data

        // Initialize and display the map
        initMap(latitude, longitude);
    } catch (error) {
        console.error("Error:", error);
    }
};

// Add event listener to the form
const form = document.querySelector('form');
form.addEventListener('submit', handleSubmit);
