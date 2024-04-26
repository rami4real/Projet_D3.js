// Function to fetch data from the API
async function fetchData() {
    try {
        const response = await fetch('https://restcountries.com/v3.1/all?fields=name,capital,currencies,capitalInfo,region');
        if (!response.ok) {
            throw new Error('Failed to fetch data');
        }
        const data = await response.json();
        visualizeData(data); // Call function to visualize data
        visualizeCurrencies(data);
        visualizeRegionDistribution(data);
    } catch (error) {
        console.error(error);
    }
}

// Function to visualize data using D3.js
function visualizeData(data) {
    // Set up Leaflet map
    const map = L.map('map').setView([34, 10], 6); // Set the map view and zoom level

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        attribution: '© OpenStreetMap contributors',
    }).addTo(map);

    // Loop through the data and add markers for each country's capital
    data.forEach(country => {
        const capitalCoords = country.capitalInfo.latlng;
        if (capitalCoords && capitalCoords.length === 2) {
            const capitalName = country.capital[0];
            // Create marker for the capital
            const marker = L.marker(capitalCoords).addTo(map);
            // Add popup with capital name
            marker.bindPopup(capitalName);
            // Add event listener to display country information on click
            marker.on('click', async () => {
                const currencyParagraph = document.getElementById('selected-currency');
                currencyParagraph.innerText = 'Currency: ' + Object.values(country.currencies)[0].name;
                const regionParagraph = document.getElementById('selected-region');
                regionParagraph.innerText = 'Region: ' + country.region;
                const nameParagraph = document.getElementById('selected-name');
                nameParagraph.innerText = 'Official Name: ' + country.name.official;
                // Fetch currency rate for the selected country
                const currencyCode = Object.keys(country.currencies)[0];
                const currencyRate = await fetchCurrencyRate(currencyCode);
                const currencyRateParagraph = document.getElementById('currency-rate');

                // Format the currency rates as a string
                const formattedCurrencyRates = Object.entries(currencyRate)
                    .map(([currency, rate]) => `${currency}: ${rate}`)
                    .join(', ');

                currencyRateParagraph.innerText = 'Currency Rates: ' + formattedCurrencyRates;

            });
        }
    });
}

// Function to visualize currencies using D3.js
function visualizeCurrencies(data) {
    // Implementation of visualizeCurrencies function
}

function visualizeRegionDistribution(data) {
    // Implementation of visualizeRegionDistribution function
}

// Function to fetch currency rate
async function fetchCurrencyRate(currencyCode) {
    try {
        const response = await fetch('https://api.fastforex.io/fetch-multi?from=' + currencyCode + '&to=USD,EUR,GBP&api_key=5112f3dd96-a54adb92c1-scenjv');
        if (!response.ok) {
            throw new Error('Failed to fetch currency rate');
        }
        const data = await response.json();
        return data.results; // Assuming you want to get the rate against USD
    } catch (error) {
        console.error(error);
    }
}

// Call the function to fetch data
fetchData();
