const loginForm = document.getElementById("loginForm");

loginForm.addEventListener("submit", async (e) => {
  e.preventDefault();

  const email = document.getElementById("email").value;

  const password = document.getElementById("password").value;

  console.log(email, password);

  try {
    const response = await fetch("http://localhost:5000/api/auth/login", {
      method: "POST",

      headers: {
        "Content-Type": "application/json",
      },

      body: JSON.stringify({
        email,
        password,
      }),
    });

    const data = await response.json();

    console.log(data);

    alert(data.message);

    if (data.token) {
      localStorage.setItem("token", data.token);

      window.location.href = "dashboard.html";
    }
  } catch (error) {
    console.log(error);

    alert("Login failed");
  }
});
