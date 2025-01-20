document.addEventListener("DOMContentLoaded", () => {
    const form = document.getElementById("login-form");
    
  
    form.addEventListener("submit", async (event) => {
      event.preventDefault();
  
      const username = form.username.value;
      const password = form.password.value;
  
      try {
          
        const response = await fetch("/api/auth/login", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username: username, password: password }),
        });
  
        if (response.ok) {
            // Asumiendo que la respuesta es JSON y contiene un campo "token".
            const data = await response.json();
            const token = data.token;
        
            if (!token) {
            throw new Error("Token no encontrado en la respuesta.");
            }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("actualUser", username);
            // Redirect to a new page after successful login
            window.location.href = "/chat"; // Replace with your target page
        } else {
          const error = await response.json();
          console.log(error)
          
        }
      } catch (err) {
        
        console.log(err)
      }
    });
});