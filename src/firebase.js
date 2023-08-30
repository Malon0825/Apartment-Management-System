import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

const app = firebase.initializeApp({
  apiKey: "AIzaSyDf97WU66sT83OKX0fxD-JNOQF8mQN2qZI",
  authDomain: "apartment-system-8d6c0.firebaseapp.com",
  projectId: "apartment-system-8d6c0",
  storageBucket: "apartment-system-8d6c0.appspot.com",
  messagingSenderId: "216158807674",
  appId: "1:216158807674:web:cd996fcf938cae0bf17dc3"
});

export const auth = app.auth();
export const db = app.firestore();
export default app;