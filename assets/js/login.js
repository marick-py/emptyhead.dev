import { initializeApp } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-app.js";
import { getAuth, signInAnonymously, linkWithCredential , EmailAuthProvider, onAuthStateChanged } from "https://www.gstatic.com/firebasejs/11.8.1/firebase-auth.js";

const firebaseConfig = {
    apiKey: "AIzaSyBYuNXKMAlqIiYYIqsGzKkmgpB095jO2qY",
    authDomain: "emptyhead-counter.firebaseapp.com",
    databaseURL: "https://emptyhead-counter-default-rtdb.europe-west1.firebasedatabase.app",
    projectId: "emptyhead-counter",
    storageBucket: "emptyhead-counter.firebasestorage.app",
    messagingSenderId: "395254759620",
    appId: "1:395254759620:web:651b5738ddd107901a4991",
    measurementId: "G-PK1YVTG6NP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

const auth = getAuth();

signInAnonymously(auth)
.then(() => {
    console.log("User signed in anonymously");
})
.catch((error) => {
    const errorCode = error.code;
    const errorMessage = error.message;
    console.error("Error signing in anonymously:", errorCode, errorMessage);
});

onAuthStateChanged(auth, (user) => {
    if (user) {
        // https://firebase.google.com/docs/reference/js/auth.user
        window.firebaseUser = user;
        console.log("User signed in with UID:", user.uid);
    } else {
        console.log("User signed out");
    }
});


// Function to link anonymous user with email and password
// const email = "ricomari2006@gmail.com";
// const password = "MaRick06";

// const credential = EmailAuthProvider.credential(email, password);
// linkWithCredential(auth.currentUser, credential)
// .then((usercred) => {
//     const user = usercred.user;
//     console.log("Anonymous account successfully upgraded", user);
// }).catch((error) => {
//     console.log("Error upgrading anonymous account", error);
// });