// Local
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import DNDlist from "./components/DNDlist";
import { signIn, auth } from "./external/firebase";
import MovieSearchBar from "./components/MovieSearchBar";
import { Col, Container, Row } from "react-bootstrap";
import { useState } from "react";
import HelpPanel from "./components/HelpPanel";

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
  const [viewMode, setViewMode] = useState("");
  const [helping, setHelping] = useState("");

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
          <div id="user-info">
            <p>{userinfo.name}</p>
            <button id="sign-out" onClick={() => googleSignOut()}>
              Sign out
            </button>
          </div>
          <Container fluid className="p-0" id="container">
            <Row className="row m-0">
              <Col xs={12} className="p-0">
                <h1 id="title">FlickSort</h1>
              </Col>
              <Col xs={12} className="p-0">
                <div id="search-area">
                  <MovieSearchBar
                    setHelping={setHelping}
                    searchResultAmount={3}
                  ></MovieSearchBar>
                </div>
              </Col>
              {helping ? (
                <Col xs={12} sm={6} className="p-0">
                  <div id="help-panel">
                    <HelpPanel movie={{ title: "dgfsgagd" }}></HelpPanel>
                  </div>
                </Col>
              ) : null}

              <Col xs={12} className="p-0">
                <div id="movie-list">
                  {/* <button onClick={() => setViewMode("lite")}>lite</button>
                  <button onClick={() => setViewMode("")}>standard</button>
                  <button onClick={() => setViewMode("full")}>full</button> */}
                  <DNDlist view_mode={viewMode}></DNDlist>
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
              alt="Google icon"
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
