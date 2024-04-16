// Get DOM elements
const searchInput = document.getElementById('searchInput');
const searchButton = document.getElementById('searchButton');
const movieList = document.getElementById('movieList');
const nowPlaying = document.getElementById('nowPlaying');
const genres = document.getElementById('genres');
const languages = document.getElementById('languages');
const popup = document.getElementById('popup');
const popupTitle = document.getElementById('popupTitle');
const popupImg = document.getElementById('popupImg');
const popupDetails = document.getElementById('popupDetails');
const closeBtn = document.getElementById('closeBtn');
const apiKey = 'd4a7e0b'; // API key for OMDB API

// Initial fetch for homepage movies
fetchMovies('tt3896198', 6); 

// Event listeners for navbar and search functionality
searchButton.addEventListener('click', searchMovies);
nowPlaying.addEventListener('click', () => fetchMovies('tt3896198'));
genres.addEventListener('click', () => fetchMovies('genres'));
languages.addEventListener('click', () => fetchMovies('languages'));
closeBtn.addEventListener('click', closePopup);

// Go to Top button functionality
const goToTopBtn = document.getElementById('goToTopBtn');

// Display "Go to Top" button when scrolling down
window.addEventListener('scroll', () => {
    if (window.pageYOffset > 300) {
        goToTopBtn.style.display = 'block';
    } else {
        goToTopBtn.style.display = 'none';
    }
});

// Scroll to top when "Go to Top" button is clicked
goToTopBtn.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
});

// Function to search movies based on input
async function searchMovies() {
    const searchTerm = searchInput.value;
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&s=${searchTerm}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Response === 'True') {
            displayMovies(data.Search);
        } else {
            movieList.innerHTML = '<p>No movies found</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to fetch movies based on category
async function fetchMovies(category, limit = 10) {
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${category}`;

    try {
        const response = await fetch(apiUrl);
        const data = await response.json();

        if (data.Response === 'True') {
            const genre = data.Genre.split(',')[0]; 
            const similarResponse = await fetch(`http://www.omdbapi.com/?apikey=${apiKey}&s=${genre}&type=movie`);
            const similarData = await similarResponse.json();

            if (similarData.Response === 'True') {
                displayMovies(similarData.Search.slice(0, limit)); 
            } else {
                movieList.innerHTML = '<p>No similar movies found</p>';
            }
        } else {
            movieList.innerHTML = '<p>No movies found</p>';
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

// Function to display movies on the page
function displayMovies(movies) {
    movieList.innerHTML = '';

    movies.forEach(movie => {
        const movieElement = document.createElement('div');
        movieElement.classList.add('movie');

        const img = document.createElement('img');
        img.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450';
        img.alt = `${movie.Title} Poster`;

        const movieInfo = document.createElement('div');

        const h2 = document.createElement('h2');
        h2.textContent = movie.Title;

        const p = document.createElement('p');
        p.textContent = `Year: ${movie.Year}`;

        movieInfo.appendChild(h2);
        movieInfo.appendChild(p);

        movieElement.appendChild(img);
        movieElement.appendChild(movieInfo);

        movieList.appendChild(movieElement);

        // Event listener to show movie details when a movie is clicked
        movieElement.addEventListener('click', () => {
            fetchMovieDetails(movie.imdbID);
        });
    });
}

// Function to fetch and display detailed movie information in a popup
async function fetchMovieDetails(movieId) {
    const apiUrl = `http://www.omdbapi.com/?apikey=${apiKey}&i=${movieId}`;

    try {
        const response = await fetch(apiUrl);
        const movieDetails = await response.json();
        showMovieDetails(movieDetails);
    } catch (error) {
        console.error('Error fetching movie details:', error);
    }
}

// Function to display detailed movie information in a popup
function showMovieDetails(movie) {
    popupTitle.textContent = movie.Title;
    popupImg.src = movie.Poster !== 'N/A' ? movie.Poster : 'https://via.placeholder.com/300x450';

    const details = `
        <div class="description">
            <p><strong>Year:</strong> ${movie.Year}</p>
            <p><strong>Rated:</strong> ${movie.Rated}</p>
            <p><strong>Released:</strong> ${movie.Released}</p>
            <p><strong>Genre:</strong> ${movie.Genre}</p>
            <p><strong>Director:</strong> ${movie.Director}</p>
            <p><strong>Actors:</strong> ${movie.Actors}</p>
            <p><strong>Plot:</strong> ${movie.Plot}</p>
        </div>
    `;

    popupDetails.innerHTML = details;

    popup.style.visibility = 'visible';
    popup.style.opacity = '1';
}

// Function to close the movie details popup
function closePopup() {
    popup.style.visibility = 'hidden';
    popup.style.opacity = '0';
}
