import { initializeApp } from "firebase/app";
import { addDoc, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { getDoc, setDoc } from "firebase/firestore";
import {
  getAuth,
  signInWithEmailAndPassword,
  onAuthStateChanged,
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
export var nowGroupId;

async function uploadScore(id, data, identity) {
  let s = doc(db, "group", `group_${id}`);
  let b = doc(s, `identity${identity}`, $.cookie("UUID"));
  console.log(data);
  await setDoc(b, data);
}

export const auth = getAuth();

function login(password) {
  return signInWithEmailAndPassword(auth, `${password}@fuyajo.tw`, password);
}

const groupID = onSnapshot(doc(db, "now", "now"), (doc) => {
  init(doc);
  $(".loading-overlay").hide();
});


function init(doc){
  let id = doc.data().end;
  nowGroupId = doc.data().group;
  if(id > 0) $("#group").html(`目前組別 第${nowGroupId}組`);
  else if(id < 0) $("#group").html(`休息中`);
  else if(id == 0) $("#group").html(`晚上 6 點 40 準時開始`);
  if (doc.data().group === doc.data().end) {
    $("#beginRating").hide();
    $("#ratingContainer").show();
    let tmp = $.cookie(`group${id}`);
    if (tmp !== undefined) {
      $("input[name=rating0]")
        .filter(`[value=${parseInt(tmp / 1000)}]`)
        .prop("checked", true);
      $("input[name=rating1]")
        .filter(`[value=${parseInt(tmp / 100) % 10}]`)
        .prop("checked", true);
      $("input[name=rating2]")
        .filter(`[value=${parseInt(tmp / 10) % 10}]`)
        .prop("checked", true);
      $("input[name=rating3]")
        .filter(`[value=${tmp % 10}]`)
        .prop("checked", true);
      $("#typeNumber0").val(parseInt(tmp / 1000000));
      $("#typeNumber1").val(parseInt(tmp / 10000) % 100);
      $("#typeNumber2").val(parseInt(tmp / 100) % 100);
      $("#typeNumber3").val(parseInt(tmp % 100));
      $("#comment").val($.cookie(`group${id}_C`));
      if(!auth.currentUser) {
        $("input").prop("disabled", true);
        $("textarea").prop("disabled", true);
        $("#ratingSubmit").prop("disabled", true);
      }
      $("#msg").html("評分成功");
    }
  } else {
    $("#beginRating").show();
    $("#ratingContainer").hide();
    $("input").prop("checked", false);
    $("input").prop("disabled", false);
    $("textarea").prop("disabled", false);
    $("#comment").val("");
    $("#ratingSubmit").prop("disabled", false);
  }
}

export { uploadScore, login };
