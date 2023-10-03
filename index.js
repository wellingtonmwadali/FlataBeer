// Define the API endpoints
const baseURL = 'http://localhost:3000'; // Base URL for the local API
const beersEndpoint = '/beers';
const beerDetailsEndpoint = '/beers/1';

// Function to make a GET request to the API
async function fetchData(url) {
    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }
        const data = await response.json();
        return data;
    } catch (error) {
        console.error('Error fetching data:', error);
        return null;
    }
}

// Function to populate the menu of beers
async function populateBeerMenu() {
    const menuElement = document.getElementById('beer-menu');
    const beersData = await fetchData(`${baseURL}${beersEndpoint}`);
    if (beersData) {
        // Loop through the beers and create menu items
        beersData.forEach((beer) => {
            const menuItem = document.createElement('li');
            menuItem.textContent = beer.name;
            // Add a click event listener to each menu item
            menuItem.addEventListener('click', async () => {
                // Load and display details of the selected beer
                await displayBeerDetails(beer.id);
            });
            menuElement.appendChild(menuItem);
        });
    }
}

// Function to display beer details
async function displayBeerDetails(beerId) {
    const beerDetailsElement = document.getElementById('beer-details');
    const beerDetailsData = await fetchData(`${baseURL}${beersEndpoint}/${beerId}`);
    if (beerDetailsData) {
        // Update the UI with beer details
        document.getElementById('beer-name').textContent = beerDetailsData.name;
        document.getElementById('beer-image').src = beerDetailsData.image_url;
        document.getElementById('beer-description').textContent = beerDetailsData.description;

        // Display reviews
        const reviewList = document.getElementById('review-list');
        reviewList.innerHTML = ''; // Clear existing reviews
        beerDetailsData.reviews.forEach((review) => {
            const listItem = document.createElement('li');
            listItem.textContent = review;
            reviewList.appendChild(listItem);
        });
    }
}

// Event listener for review submission form
const reviewForm = document.getElementById('review-form');
reviewForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newReview = document.getElementById('new-review').value;
    const beerId = 1;

    // Fetch the current reviews from the server
    const beerDetailsData = await fetchData(`${baseURL}${beersEndpoint}/${beerId}`);
    if (beerDetailsData) {
        // Append the new review to the existing reviews
        beerDetailsData.reviews.push(newReview);

        // Send a PATCH request to update the reviews on the server
        try {
            const response = await fetch(`${baseURL}${beersEndpoint}/${beerId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ reviews: beerDetailsData.reviews }),
            });

            if (!response.ok) {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }

            // Clear the review submission form
            document.getElementById('new-review').value = '';

            // Fetch and display the updated data from the server
            displayFirstBeerDetails(); 
        } catch (error) {
            console.error('Error submitting review:', error);
        }
    }
});

// Event listener for description update form
const descriptionForm = document.getElementById('description-form');
descriptionForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    
    const newDescription = document.getElementById('new-description').value;
    const beerId = 1;

    // Send a PATCH request to update the description on the server
    try {
        const response = await fetch(`${baseURL}${beersEndpoint}/${beerId}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ description: newDescription }),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        // Update the description on the page
        document.getElementById('beer-description').textContent = newDescription;

        // Clear the description update form
        document.getElementById('new-description').value = '';

        // Fetch and display the updated data from the server
        displayFirstBeerDetails();
    } catch (error) {
        console.error('Error updating description:', error);
    }
});




// Initialize the application by populating the beer menu
populateBeerMenu();

// Initially, display details of the first beer
displayBeerDetails(1);
