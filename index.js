import { uploadScore, login, currentUser, auth } from "./firebase.js";
import { onAuthStateChanged } from "firebase/auth";

var loginState = 0;

const a = $("#ratingSubmit").click((e) => {
  e.preventDefault();
  $("input:radio:checked", this)
    .parent()
    .parent()
    .parent()
    .removeClass("error");
  var score =
    $("input[name=rating0]:checked").val() * 5 +
    $("input[name=rating1]:checked").val() * 11 +
    $("input[name=rating2]:checked").val() * 3 +
    $("input[name=rating3]:checked").val() * 1;
  if (!Number.isNaN(score)) {
    uploadScore($("#group").val(), {score: score, comment: $("#comment").val()});
    $("input").prop("disabled", true);
    $("textarea").prop("disabled", true);
    $("#ratingSubmit").prop("disabled", true);
  } else {
    $("input:radio:not(:checked)", this)
      .parent()
      .parent()
      .parent()
      .addClass("error");
    return false;
  }
});

$("#login").submit((e) => {
  e.preventDefault();
  $("#loginBtn").prop("disabled", true);
  $("#passwordInput").prop("disabled", true);
  login($("#passwordInput").val())
    .then((res) => {
      $("#loginModal").model("hide");
    })
    .catch((err) => {
      
    })
    .finally(() => {
      $("#loginBtn").prop("disabled", false);
      $("#passwordInput").prop("disabled", false);
    });
})

onAuthStateChanged(auth, (user) => {
  if(user){
    $("#loginNavBtn").hide();
    $("#userName").html(user.email);
    $("#dashborad").show();
    $("#ratingContainer").show();
    $("#beginRating").hide();
    loginState = 1;
  }
  else{
    $("#loginNavBtn").show();
    $("#userName").html('');
    $("#dashborad").hide();
    loginState = 0;
  }
});