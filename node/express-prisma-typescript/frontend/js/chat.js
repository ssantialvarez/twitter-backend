
const usersList = document.getElementById('usersList');
const token = localStorage.getItem("authToken");
const actualUser = localStorage.getItem("actualUser");

const form = document.getElementById('form');
const input = document.getElementById('input');
const messages = document.getElementById('messages');

let roomId
let actualUserId
let users
let selectedId
const socket = io({
  auth: {
    serverOffset: 0
  }
});

document.addEventListener("DOMContentLoaded", async () => {    
    try {
      let response = await fetch("http://localhost:8080/api/user", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {    
        users = await response.json()
        for(let user of users){
            if(actualUser == user.username){
                actualUserId = user.id
                
            }
        }
      }

      response = await fetch("http://localhost:8080/api/follower/followed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {    
        users = await response.json()
        for(let user of users){
            if(actualUser != user.username){
                const item = document.createElement('option');
                item.textContent = user.username;
                usersList.appendChild(item);
                
            }
        }

        
        
      } else {
        alert("Error");
        window.location.href = "/";
      }
    } catch (err) {
      alert("Error");
      window.location.href = "/";
    }
}); 

usersList.addEventListener('change', async (e) => {
    e.preventDefault();
    while (messages.firstChild) {
      messages.removeChild(messages.lastChild);
    }

    const response = await fetch("http://localhost:8080/api/follower/followed", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    if (response.ok) {    
      users = await response.json()
      for(let user of users){
          if(usersList.value == user.username)
              selectedId = user.id
      }
      
    }
    
    socket.emit('leave room', selectedId, actualUserId)
    socket.emit('join room', selectedId, actualUserId)
    socket.emit('bring room', selectedId, actualUserId)
})

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:8080/api/follower/followed", {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
  
      if (response.ok) {    
        users = await response.json()
        for(let user of users){
            if(usersList.value == user.username)
                selectedId = user.id
        }
        
      } else {
        alert("Error");
        window.location.href = "/";
      }
    } catch (err) {
      alert("Error");
      window.location.href = "/";
    }

    if (input.value) {
      socket.emit('chat message', input.value, selectedId, actualUserId);


      const item = document.createElement('li');
      item.textContent = input.value;
      messages.appendChild(item);
      window.scrollTo(0, document.body.scrollHeight);


      input.value = '';
    }
});

socket.on('chat message', (msg, serverOffset) => {
    const item = document.createElement('li');
    item.textContent = msg;
    messages.appendChild(item);
    window.scrollTo(0, document.body.scrollHeight);
    socket.auth.serverOffset = serverOffset
});

