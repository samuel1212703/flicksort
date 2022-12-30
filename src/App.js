// Local
import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import HelpPanel from "./components/HelpPanel";
import DNDlist from "./components/DNDlist";
import { signIn } from "./external/google_sign_in";
import MovieSearchBar from "./components/MovieSearchBar";
// Firebase
import { getAuth, onAuthStateChanged } from "firebase/auth";
import { Col, Container, Row } from "react-bootstrap";

// Variables
const userinfo = { name: "", token: "", email: "" };

// Firebase
const auth = getAuth();

async function googleSignIn() {
  userinfo.token = signIn();
}

function App() {
  if (auth.currentUser && userinfo.name === "") {
    userinfo.name = auth.currentUser.displayName;
    userinfo.email = auth.currentUser.email;
  }
  onAuthStateChanged(auth, (user) => {
    if (user) {
      userinfo.name = user.displayName;
      userinfo.email = user.email;
    }
  });

  return (
    <div className="App">
      {auth.currentUser ? (
        <div>
          <p className="left-top-locked">{userinfo.name}</p>
          <button onClick={() => googleSignIn()}>
            Sign out
          </button>
        </div>
      ) : (
        <div id="page-lock">
          <button id="center-locked" onClick={() => googleSignIn()}>
            Sign in
          </button>
        </div>
      )}
      <Container fluid className="p-0">
        <Row>
          <Col xs={12} sm={6} className="p-0">
            <h1 id="title">FlickSort</h1>
          </Col>
          <Col xs={12} sm={6} className="p-0">
            <div id="search-area">
              <MovieSearchBar searchResultAmount={3}></MovieSearchBar>
            </div>
          </Col>
        </Row>
        <Row>
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
  );
}

export default App;
