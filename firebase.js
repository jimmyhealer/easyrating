import { initializeApp } from "firebase/app";
import { addDoc, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { collection, setDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged
} from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyCaCXyd8Y-oZwQwuHXqqDM0H-kIzliaIy0",
  authDomain: "easyrating-da9fc.firebaseapp.com",
  projectId: "easyrating-da9fc",
  storageBucket: "easyrating-da9fc.appspot.com",
  messagingSenderId: "98943291005",
  appId: "1:98943291005:web:4c61d0fb0d763c1136ab14",
  measurementId: "G-CDE34TZ3PM",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const groupID = onSnapshot(doc(db, "now", "now"), (doc) => {
  $("#group").html(doc.data().group);
  if(doc.data().group === doc.data().end){
    $("#beginRating").hide();
    $("#ratingContainer").show();
  }
  else{
    $("#beginRating").show();
    $("#ratingContainer").hide();
  }
});

async function uploadScore(id, data) {
  let s = doc(db, "group", `group_${id}`);
  let b = collection(s, "student_scores_set");
  await addDoc(b, data);
}

export const auth = getAuth();

function login(password) {
  return signInWithEmailAndPassword(auth, `${password}@fuyajo.tw`, password);
}

export { uploadScore, login };
