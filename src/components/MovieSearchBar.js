import React, { Component } from "react";
import { getSearchSuggestions } from "../external/movieDB";
import { addToMovieList } from "../external/firebase";
import "./MovieSearchBar.css";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import { year_from_date } from "../utils/converter";

class MovieSearchBar extends Component {
  constructor(props) {
    super(props);
    this.state = {
      searchSuggestions: [],
      query: "",
      searchResultAmount: props.searchResultAmount,
    };
    this.handleSearchQueryChange = this.handleSearchQueryChange.bind(this);
  }

  handleSearchQueryChange(query, searchResultAmount) {
    this.setState({ query: query });
    getSearchSuggestions(query, searchResultAmount).then((res) => {
      this.setState({
        searchSuggestions: res,
      });
    });
  }

  render() {
    return (
      <div>
        <Form className="d-flex" id="search-bar">
          <Form.Control
            id="search-field"
            placeholder="Stalker (1979)..."
            onChange={(e) => {
              this.handleSearchQueryChange(
                e.target.value,
                this.state.searchResultAmount
              );
            }}
          />
          <Button variant="outline-success">Search</Button>
        </Form>
        <div id="movie-suggestion-dropdown">
          {this.state.query.length !== 0 ? (
            this.state.searchSuggestions?.map((suggestion) => (
              <div
                key={suggestion.title + suggestion.vote_average}
                className={"movie-suggestion"}
              >
                <Container>
                  <Row>
                    <Col xs={8}>
                      <h5
                        key={suggestion.title}
                        className="movie-suggestion-content movie-title"
                      >
                        {suggestion.title} (
                        {year_from_date(suggestion.release_date)})
                      </h5>
                    </Col>
                    <Col xs={2}>
                      <button
                        className="movie-suggestion-content add-button"
                        onClick={() => {
                          addToMovieList(suggestion);
                        }}
                      >
                        Add
                      </button>
                    </Col>
                  </Row>
                  <Row>
                    <Col xs={3}>
                      <h5
                        key={suggestion.vote_average}
                        className="movie-suggestion-content"
                      >
                        {suggestion.vote_average}
                      </h5>
                    </Col>
                    <Col xs={3}>
                      <h5
                        key={suggestion.vote_average}
                        className="movie-suggestion-content"
                      >
                        {suggestion.original_language}
                      </h5>
                    </Col>
                    <Col xs={2}>
                      <h5
                        key={suggestion.vote_average}
                        className="movie-suggestion-content"
                      >
                        {suggestion.adult ? <div> * Adult</div> : null}
                      </h5>
                    </Col>
                    {/* <Col xs={2}>
                      <button
                        className="movie-suggestion-content add-button"
                        onClick={() => {
                          this.props.setHelping(suggestion);
                        }}
                      >
                        Help
                      </button>
                    </Col> */}
                  </Row>
                </Container>
              </div>
            ))
          ) : (
            <div></div>
          )}
        </div>
      </div>
    );
  }
}

export default MovieSearchBar;
