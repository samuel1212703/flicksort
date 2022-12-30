import React, { Component } from "react";
import { Button, Col, Container, Form, Row } from "react-bootstrap";
import "./HelpPanel.css";

class HelpPanel extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div id="main">
        <Container>
          <Row>
            <Col>
              <Button>Movie1</Button>
            </Col>
          </Row>
          <Row>
            <Col>
              <Button>Movie2</Button>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default HelpPanel;
