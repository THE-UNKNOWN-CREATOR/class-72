import firebase from 'firebase'
import 'firebase/firestore'

const firebaseConfig = {
    apiKey: "AIzaSyDEVDRwwyNxUOMhdstxndeC3bijWPeM3AI",
    authDomain: "wireless-library-d91c8.firebaseapp.com",
    databaseURL: "https://wireless-library-d91c8.firebaseio.com",
    projectId: "wireless-library-d91c8",
    storageBucket: "wireless-library-d91c8.appspot.com",
    messagingSenderId: "366915418263",
    appId: "1:366915418263:web:c86df4f1d99dba9be011d2"
  };

  // Initialize Firebase
firebase.initializeApp(firebaseConfig);
export default firebase;