// MovieDB
const { MovieDb } = require("moviedb-promise");
const moviedb = new MovieDb(process.env.REACT_APP_TMDB_API);

export async function getSearchSuggestions(query, searchResultAmount) {
  return moviedb.searchMovie({ query: query }).then((res) => {
    let temp = 0;
    const movieList = [];
    let counter = 0;
    // Get only movies with a rating (vote_average)
    while (temp < searchResultAmount) {
      const movie = res.results[counter];
      if (movie.vote_average) {
        movieList.push(movie)
        movieList[counter].vote_average = Math.round(movie.vote_average * 10) / 10
        temp++;
      }
      counter++;
      if (movieList.length >= searchResultAmount) {
        break;
      }
    }
    return movieList;
  });
}
