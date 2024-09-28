function showSection(section) {
    const sections = document.querySelectorAll('.section');
    sections.forEach((sec) => {
        sec.style.display = 'none'; // Hide all sections
    });
    document.getElementById(section).style.display = 'block'; // Show the selected section

    if (section === 'home') {
        const resultsContainer = document.querySelector('.search-results');
        resultsContainer.innerHTML = ''; // Clear results when switching to home
        resultsContainer.style.display = 'none'; // Hide results container
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const searchInput = document.querySelector('.search-input');
    const searchButton = document.querySelector('.search-button');
    const clearButton = document.querySelector('.clear-button');
    const resultsContainer = document.createElement('div');
    resultsContainer.className = 'search-results';
    document.body.appendChild(resultsContainer);

    // Fetch data from JSON file
    async function fetchData() {
        try {
            const response = await fetch('travel_recommendation_api.json');
            if (!response.ok) {
                throw new Error('Network response was not ok');
            }
            const data = await response.json();
            return data;
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    }

    // Search function
    function searchKeywords(data, keyword) {
        const results = {
            countries: [],
            temples: [],
            beaches: []
        };

        // Search in countries
        data.countries.forEach(country => {
            country.cities.forEach(city => {
                if (city.name.toLowerCase().includes(keyword.toLowerCase()) || 
                    city.description.toLowerCase().includes(keyword.toLowerCase())) {
                    results.countries.push({ country: country.name, city });
                }
            });
        });

        // Search in temples
        data.temples.forEach(temple => {
            if (temple.name.toLowerCase().includes(keyword.toLowerCase()) || 
                temple.description.toLowerCase().includes(keyword.toLowerCase())) {
                results.temples.push(temple);
            }
        });

        // Search in beaches
        data.beaches.forEach(beach => {
            if (beach.name.toLowerCase().includes(keyword.toLowerCase()) || 
                beach.description.toLowerCase().includes(keyword.toLowerCase())) {
                results.beaches.push(beach);
            }
        });

        return results;
    }

    // Display search results
    function displayResults(results) {
        resultsContainer.innerHTML = ''; 
        if (!results.countries.length && !results.temples.length && !results.beaches.length) {
            resultsContainer.innerHTML = '<p>No results found.</p>';
            resultsContainer.style.display = 'block';
            return;
        }

        // Function to create a card
        function createCard(item, isTempleOrBeach = false) {
            const card = document.createElement('div');
            card.className = 'result-card';

            const image = document.createElement('img');
            image.src = item.imageUrl || ''; // Use imageUrl if available
            image.alt = item.name || '';
            card.appendChild(image);

            const name = document.createElement('h3');
            name.textContent = item.name || `${item.city.name}, ${item.country}`;
            card.appendChild(name);

            const description = document.createElement('p');
            description.textContent = item.description || item.city.description;
            card.appendChild(description);

            return card;
        }

        // Display countries and cities
        results.countries.forEach(item => {
            const card = createCard(item.city);
            resultsContainer.appendChild(card);
        });

        // Display temples
        results.temples.forEach(item => {
            const card = createCard(item);
            resultsContainer.appendChild(card);
        });

        // Display beaches
        results.beaches.forEach(item => {
            const card = createCard(item);
            resultsContainer.appendChild(card);
        });

        resultsContainer.style.display = 'block';
    }

    // Event listener for the search button
    searchButton.addEventListener('click', async () => {
        const keyword = searchInput.value.trim();
        if (!keyword) return;

        const data = await fetchData();
        const results = searchKeywords(data, keyword);
        displayResults(results);
    });

    // Event listener for the clear button
    clearButton.addEventListener('click', () => {
        searchInput.value = ''; // Clear the input field
        resultsContainer.innerHTML = ''; // Clear the results
        resultsContainer.style.display = 'none'; // Hide results container
    });
});
