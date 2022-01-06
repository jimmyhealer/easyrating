import { initializeApp } from "firebase/app";
import { addDoc, collection, getFirestore } from "firebase/firestore";
import { doc, onSnapshot } from "firebase/firestore";
import { getDocs, setDoc, updateDoc } from "firebase/firestore";
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

async function updateGroup(now, op) {
  if (op === "group") await updateDoc(doc(db, "now", "now"), { group: now });
  else if (op === "end") await updateDoc(doc(db, "now", "now"), { end: now });
  else if (op === "msg") await updateDoc(doc(db, "now", "now"), { msg: now });
}

async function calcScores(group_id) {
  let score = [0, 0, 0];
  let s = doc(db, "group", `group_${group_id}`);
  for (let i = 0; i < 3; i++) {
    let size = 0;
    const querySnapshot = await getDocs(collection(s, `identity${i}`));
    querySnapshot.forEach((doc) => {
      score[i] += doc.data().score;
      size++;
    });
    if (size === 0) {
      score[i] = 0;
      continue;
    }
    score[i] /= size;
  }
  $(`#dashboard_group_${group_id}`).html(
    `老師評分: ${score[1].toFixed(2)}, 我們: ${score[0].toFixed(
      2
    )}, 其他: ${score[2].toFixed(2)}, 共 ${score[0] * 0.1 + score[1] * 0.6 + score[2] * 0.3} 分`
  );
}

const groupID = onSnapshot(doc(db, "now", "now"), (doc) => {
  init(doc);
  $(".loading-overlay").hide();
});

function init(doc) {
  let id = doc.data().end,
    msg = doc.data().msg;
  nowGroupId = doc.data().group;
  if (msg !== "") $("#group").html(msg);
  else if (nowGroupId > 0) $("#group").html(`目前組別 第${nowGroupId}組`);
  else if (id < 0) $("#group").html(`休息中`);
  else if (id == 0) $("#group").html(`晚上 6 點 40 準時開始`);
  if (nowGroupId && doc.data().group === doc.data().end) {
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
      if (!auth.currentUser) {
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
    $("#msg").html("");
  }
}

export { uploadScore, login, updateGroup, calcScores };
