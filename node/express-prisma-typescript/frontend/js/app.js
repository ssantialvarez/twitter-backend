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
            const data = await response.json();
            const token = data.token;
        
            if (!token) {
            throw new Error("Token no encontrado en la respuesta.");
            }

            localStorage.setItem("authToken", data.token);
            localStorage.setItem("actualUser", username);
            window.location.href = "/chat"; 
        } else {
          const error = await response.json();
          console.log(error)
          
        }
      } catch (err) {
        
        console.log(err)
      }
    });
});