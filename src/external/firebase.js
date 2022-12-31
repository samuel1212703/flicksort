import { initializeApp } from "firebase/app";
import {
  getFirestore,
  doc,
  setDoc,
  collection,
  getDocs,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore/lite";
import { getAuth } from "firebase/auth";

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
const auth = getAuth();
let uid = auth.lastNotifiedUid;
if (!uid && auth.currentUser) {
  uid = auth.currentUser.uid;
}

function pleaseSignIn() {
  alert("Please sign in");
}

export async function updateRank(movieList) {
  // WARNING: Write batch can only contain 500 operations
  const batch = writeBatch(db);
  movieList.forEach((movie) => {
    batch.update(doc(db, "users", uid, "movie-list", movie.id.toString()), {
      rank: movie.rank,
    });
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
    setDoc(doc(db, "users", uid, "movie-list", movie.id.toString()), movie);
  }
}

async function createMovieList() {
  await setDoc(doc(db, "users", uid, "movie-list"), {});
}

export async function getMovieList() {
  const movieList = [];
  try {
    console.log(uid);
    if (uid) {
      const moviesRef = collection(db, "users", uid, "movie-list");
      const sortedMovies = await getDocs(query(moviesRef, orderBy("rank")));
      sortedMovies.forEach((doc) => {
        movieList.push(doc.data());
      });
    } else {
      pleaseSignIn();
    }
  } catch (e) {
    console.log("GetMovieList had an error: ", e);
    await createMovieList();
    return [];
  }
  return movieList;
}
