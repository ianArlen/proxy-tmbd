const express = require('express');
const cors = require('cors');

const app = express();
app.use(cors());


app.get('/searchMovies', async (req, res) => {
  try {
    const apiKey = '37970060192c1719051a1cc617fb1d58';
    const title = req.query.title; // Obtener el término de búsqueda desde la URL

    if (!title) {
      return res.status(400).json({ error: 'You must provide a search term.' });
    }

    // Make a TMDb API request to search for movies by title
    const response = await fetch(`https://api.themoviedb.org/3/search/movie?api_key=${apiKey}&language=es&query=${encodeURIComponent(title)}`);

    if (!response.ok) {
      throw new Error('Movie search failed');
    }

    const data = await response.json();

    // Map the results in the desired format
    const resultados = data.results.map((pelicula) => ({
      movieId: pelicula.id,
      title: pelicula.title,
      releaseYear: pelicula.release_date.split('-')[0],
      movieImage: `https://image.tmdb.org/t/p/w500${pelicula.poster_path}`,
      description: pelicula.overview,
    }));

    res.json(resultados);
  } catch (error) {
    console.error('Error when searching for movies:', error);
    res.status(500).json({ error: 'There was a problem searching for movies.' });
  }
});

app.get('/getMovieDetails', async (req, res) => {
  try {
    const apiKey = '37970060192c1719051a1cc617fb1d58';
    const movieId = req.query.movieId; // Get the movie ID from the URL

    if (!movieId) {
      return res.status(400).json({ error: 'You must provide a movie ID.' });
    }

    // Make a TMDb API request to get movie details by ID
    const response = await fetch(`https://api.themoviedb.org/3/movie/${movieId}?api_key=${apiKey}&language=es`);

    if (!response.ok) {
      throw new Error('Failed to fetch movie details');
    }

    const movieDetails = await response.json();

    // Extract the desired fields from movieDetails
    const result = {
      movieId: movieDetails.id,
      title: movieDetails.title,
      duration: movieDetails.runtime, // Movie duration in minutes
      genres: movieDetails.genres.map((genre) => genre.name), // Movie genres
      averageRating: movieDetails.vote_average, // Movie's average rating
      movieImage: `https://image.tmdb.org/t/p/w500${movieDetails.poster_path}`,
      description: movieDetails.overview,
    };

    res.json(result);
  } catch (error) {
    console.error('Error when fetching movie details:', error);
    res.status(500).json({ error: 'There was a problem fetching movie details.' });
  }
});



app.listen(4000, () => {
  console.log('Server on port 4000');
});

