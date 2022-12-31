import { getAuth, signInWithPopup, GoogleAuthProvider, signInWithRedirect, getRedirectResult } from "firebase/auth";

const provider = new GoogleAuthProvider();
const auth = getAuth();

export async function signIn() {
  // signInWithRedirect(auth, provider);
  // return getRedirectResult(auth)
  //   .then((result) => {
  //     return GoogleAuthProvider.credentialFromResult(result).accessToken;
  //   })
  //   .catch((error) => {
  //     const errorMessage = error.message;
  //     console.log(errorMessage);
  //     return "";
  //   });
  return signInWithPopup(auth, provider)
    .then((result) => {
      const credential = GoogleAuthProvider.credentialFromResult(result);
      return credential.accessToken;
    })
    .catch((error) => {
      console.log(error.message);
    });
}
