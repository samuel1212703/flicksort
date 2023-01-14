import React, { Component } from "react";
import { Button, Col, Container, Row } from "react-bootstrap";
import "./HelpPanel.css";

class HelpPanel extends Component {
  constructor(props) {
    super(props);
    this.state = {
      movie: props.movie,
      randomMovie: { title: "fgds" },
      currentRank: 0,
    };
  }

  render() {
    return (
      <div id="main">
        <Container>
          <Row>
            {this.state.movie.title ? (
              <Col>
                <Button>{this.state.movie.title}</Button>
              </Col>
            ) : (
              <div></div>
            )}
            {this.state.randomMovie.title ? (
              <Col>
                <Button>{this.state.randomMovie.title}</Button>
              </Col>
            ) : (
              <div></div>
            )}
          </Row>
        </Container>
      </div>
    );
  }
}

export default HelpPanel;
