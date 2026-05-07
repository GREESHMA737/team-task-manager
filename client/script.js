const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", (e) => {
  e.preventDefault();

  alert("Login Successful");

  window.location.href = "dashboard.html";
});
