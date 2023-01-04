import { initializeApp } from "firebase/app";
import {
  getAuth,
  signInWithPopup,
  GoogleAuthProvider,
  onAuthStateChanged,
} from "firebase/auth";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  writeBatch,
  deleteDoc,
} from "firebase/firestore/lite";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: process.env.REACT_APP_PROJECT_ID,
  storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
  messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
  appId: process.env.REACT_APP_APP_ID,
  measurementId: process.env.REACT_APP_MEASUREMENT_ID,
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
export let auth = getAuth(app);
let user = auth.currentUser;

auth.onAuthStateChanged(() => {
  user = auth.currentUser;
});

function alertUser(message) {
  alert(message);
}

const provider = new GoogleAuthProvider();

export async function signIn() {
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential.accessToken;
    })
    .catch((error) => {
      console.log(error.message);
      alert("There was an error signing in");
    });
}

export async function updateRank(movieList) {
  // WARNING: Write batch can only contain 500 operations
  const batch = writeBatch(db);
  movieList.forEach((movie) => {
    batch.update(
      doc(db, "users", user.uid, "movie-list", movie.id.toString()),
      {
        rank: movie.rank,
      }
    );
  });
  await batch.commit();
}

export async function addToMovieList(movie) {
  const movieList = await getMovieList();
  // Check if the movie has already been added
  let alreadyAdded = false;
  movieList.forEach((movieInList) => {
    if (movieInList.id === movie.id) {
      alreadyAdded = true;
    }
  });
  // If it hasn't already been added, add it
  if (!alreadyAdded) {
    movie["rank"] = 0;
    setDoc(
      doc(db, "users", user.uid, "movie-list", movie.id.toString()),
      movie
    );
  }
}

export async function removeFromMovieList(movie) {
  const movieList = await getMovieList();
  const movieListCol = collection(db, "users", user.uid, "movie-list");
  let movieID = "";
  movieList.forEach((movieDoc) => {
    if (movieDoc.id == movie.id) {
      movieID = movie.id.toString();
    }
  });
  await deleteDoc(doc(movieListCol, movieID));
}

async function createMovieList() {
  await setDoc(doc(db, "users", user.uid, "movie-list"), {});
}

export async function getMovieList() {
  const movieList = [];
  if (auth.currentUser) {
    try {
      const movies = collection(db, "users", user.uid, "movie-list");
      const sortedMovies = await getDocs(query(movies, orderBy("rank")));
      sortedMovies.forEach((doc) => {
        movieList.push(doc.data());
      });
    } catch (e) {
      console.log("GetMovieList had an error: ", e);
      await createMovieList();
      return [];
    }
  } else {
    alertUser("Please sign in");
  }
  return movieList;
}
