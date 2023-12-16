import firebase from 'firebase/compat/app';
import 'firebase/compat/auth';
import 'firebase/compat/firestore';

// const app = firebase.initializeApp({
//   apiKey: "AIzaSyDf97WU66sT83OKX0fxD-JNOQF8mQN2qZI",
//   authDomain: "apartment-system-8d6c0.firebaseapp.com",
//   projectId: "apartment-system-8d6c0",
//   storageBucket: "apartment-system-8d6c0.appspot.com",
//   messagingSenderId: "216158807674",
//   appId: "1:216158807674:web:cd996fcf938cae0bf17dc3"
// });

const app = firebase.initializeApp({
  apiKey: "AIzaSyAn7skGwPGcBpXbyV9TNwcTJYaMVGvE5no",
  authDomain: "apartment-management-c1384.firebaseapp.com",
  projectId: "apartment-management-c1384",
  storageBucket: "apartment-management-c1384.appspot.com",
  messagingSenderId: "1009034824420",
  appId: "1:1009034824420:web:983ce15fdbc81b858fbaf1",
  measurementId: "G-T0YEY8KFVR"
});

export const auth = app.auth();
export const db = app.firestore();
export default app;