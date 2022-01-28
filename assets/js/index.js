$(document).ready(function(){
  var token = localStorage.token
  console.log(token);
  if(token === undefined) {
    window.location.href='login.html'
  }






})