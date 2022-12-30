// MovieDB
const { MovieDb } = require("moviedb-promise");
const moviedb = new MovieDb(process.env.REACT_APP_TMDB_API);

export async function getSearchSuggestions(query, searchResultAmount) {
  return moviedb.searchMovie({ query: query }).then((res) => {
    return res.results.slice(0, searchResultAmount);
  });
}
