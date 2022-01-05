import { uploadScore, login, nowGroupId, auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";
import { Modal } from "./assets/js/bootstrap.esm.min.js";

export var loginState = 0;
var isTeacher = 0;
const UUID = _uuid();

function _uuid() {
  var d = Date.now();
  if (
    typeof performance !== "undefined" &&
    typeof performance.now === "function"
  ) {
    d += performance.now();
  }
  return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g, function (c) {
    var r = (d + Math.random() * 16) % 16 | 0;
    d = Math.floor(d / 16);
    return (c === "x" ? r : (r & 0x3) | 0x8).toString(16);
  });
}

const a = $("#ratingSubmit").click((e) => {
  e.preventDefault();
  $("input:radio:checked", this)
    .parent()
    .parent()
    .parent()
    .removeClass("error");
  let score;
  if (!loginState)
    score =
      $("input[name=rating0]:checked").val() * 5 +
      $("input[name=rating1]:checked").val() * 11 +
      $("input[name=rating2]:checked").val() * 3 +
      $("input[name=rating3]:checked").val() * 1;
  else
    score = 
      $("input#typeNumber0").val() * 1+
      $("input#typeNumber1").val() * 1+
      $("input#typeNumber2").val() * 1+
      $("input#typeNumber3").val() * 1;
  let tmpCookie;
  if (!loginState)
    tmpCookie =
      $("input[name=rating0]:checked").val() * 1000 +
      $("input[name=rating1]:checked").val() * 100 +
      $("input[name=rating2]:checked").val() * 10 +
      $("input[name=rating3]:checked").val() * 1;
  else tmpCookie = 
      $("#typeNumber0").val() * 1000000 +
      $("#typeNumber1").val() * 10000 +
      $("#typeNumber2").val() * 100 +
      $("#typeNumber3").val() * 1;
  console.log(tmpCookie);
  let group_id = nowGroupId;
  if (!Number.isNaN(score)) {
    console.log(group_id);
    let identity;
    if (loginState) {
      identity = isTeacher ? 1 : 0;
    } else {
      identity = 2;
    }
    uploadScore(group_id, {
      score: score,
      comment: $("#comment").val(),
    }, identity);
    console.log(tmpCookie);
    $.cookie(`group${group_id}`, tmpCookie, { expires: 1 });
    $.cookie(`group${group_id}_C`, $("#comment").val(), { expires: 1 });
    $("#msg").html("評分成功");
    if(!loginState) {
      $("input").prop("disabled", true);
      $("textarea").prop("disabled", true);
      $("#ratingSubmit").prop("disabled", true);
    }
  } else {
    $("input:radio:not(:checked)", this)
      .parent()
      .parent()
      .parent()
      .addClass("error");
    return false;
  }
});

function hideModal() {
  $("#loginModal").removeClass("in");
  $(".modal-backdrop").remove();
  $("body").removeClass("modal-open");
  $("body").css("padding-right", "");
  $("#loginModal").hide();
}

$("#login").submit((e) => {
  e.preventDefault();
  $("#loginBtn").prop("disabled", true);
  $("#passwordInput").prop("disabled", true);
  login($("#passwordInput").val())
    .then((res) => {
      hideModal();
    })
    .catch((err) => {
      $("#passwordInput").addClass("is-invalid");
      $("#passwordInput").focus();
      console.log(err);
    })
    .finally(() => {
      $("#loginBtn").prop("disabled", false);
      $("#passwordInput").prop("disabled", false);
    });
});

onAuthStateChanged(auth, (user) => {
  if (user) {
    isTeacher = user.email === "fuyajoteacher0106!@fuyajo.tw";
    loginState = 1;
    $("#loginNavBtn").hide();
    if (!isTeacher) $("#userName").html(user.email);
    else $("#userName").html("馬尚彬 教授");
    $(".star").hide();
    $(".number").show();
    $("#dashborad").show();
    $("#ratingContainer").show();
    $("#beginRating").hide();
  } else {
    $(".number").hide();
    $(".star").show();
    $("#loginNavBtn").show();
    $("#userName").html("");
    $("#dashborad").hide();
    loginState = 0;
  }
});

if ($.cookie("UUID") === undefined) {
  $.cookie("UUID", UUID, { expires: 365 });
}

$("#uuid").html(`You UUID is ${$.cookie("UUID")}`);
