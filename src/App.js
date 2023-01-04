// Local
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HelpPanel from "./components/HelpPanel";
import DNDlist from "./components/DNDlist";
import { signIn, auth } from "./external/firebase";
import MovieSearchBar from "./components/MovieSearchBar";
import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";

// Variables
const userinfo = { name: "", token: "", email: "" };

async function googleSignIn(setIsLoggedIn) {
  try {
    userinfo.token = await signIn();
    setIsLoggedIn(true);
  } catch {
    alert("Could not sign in...");
  }
}

function googleSignOut() {
  auth.signOut().then(function () {
    console.log("User signed out.");
  });
}

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  if (auth.currentUser && userinfo.name === "") {
    userinfo.name = auth.currentUser.displayName;
    userinfo.email = auth.currentUser.email;
  }

  auth.onAuthStateChanged(() => {
    if (auth.currentUser) {
      setIsLoggedIn(true);
    } else {
      setIsLoggedIn(false);
    }
  });

  return (
    <div className="App" id="site">
      {isLoggedIn ? (
        <div>
          <div>
            <p id="left-top-locked1">{userinfo.name}</p>
            <button id="left-top-locked2" onClick={() => googleSignOut()}>
              Sign out
            </button>
          </div>
          <Container fluid className="p-0" id="container">
            <Row className="row m-0">
              <Col xs={12} sm={6} className="p-0">
                <h1 id="title">FlickSort</h1>
              </Col>
              <Col xs={12} sm={6} className="p-0">
                <div id="search-area">
                  <MovieSearchBar searchResultAmount={3}></MovieSearchBar>
                </div>
              </Col>
            </Row>
            <Row className="row m-0">
              <Col xs={12} sm={6} className="p-0">
                <div id="help-panel">
                  <HelpPanel></HelpPanel>
                </div>
              </Col>
              <Col xs={12} sm={6} className="p-0">
                <div id="movie-list">
                  <DNDlist></DNDlist>
                </div>
              </Col>
            </Row>
          </Container>
        </div>
      ) : (
        <div id="page-lock">
          <button
            id="center-locked"
            onClick={() => googleSignIn(setIsLoggedIn)}
          >
            <img
              className="google-icon"
              src="https://upload.wikimedia.org/wikipedia/commons/5/53/Google_%22G%22_Logo.svg"
            />
            <p className="btn-text">
              <b>Sign in with google</b>
            </p>
          </button>
        </div>
      )}
    </div>
  );
}

export default App;
