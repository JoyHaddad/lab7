// set nickname
document
  .querySelector("#nicknameButton")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const nickname = document.querySelector("#nicknameInput").value;
    if (!nickname) {
      alert("Please enter a nickname");
      return;
    }
    const nicknameForm = document.getElementById("nicknameForm");

    const roomName = window.location.pathname.split("/")[1];

    const response = await fetch(`/${roomName}/nickname`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ nickname }),
    });
    const data = await response.json();
    if (response.ok) {
      nicknameForm.style.display = "none";
      displayChatRoom(roomName, nickname);
    } else {
      alert(data.error);
    }
  });

// send message
document
  .querySelector("#sendMessageBtn")
  .addEventListener("click", async (event) => {
    event.preventDefault();

    const message = document.querySelector("#messageInput").value;
    if (!message) {
      alert("Please enter a message");
      return;
    }

    const roomName = window.location.pathname.split("/")[1];
    const nickname = document.querySelector("#nicknameInput").value;

    const response = await fetch(`/${roomName}/sendMessage`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ sender: nickname, content: message }),
    });
    const data = await response.json();
    if (response.ok) {
      document.querySelector("#messageInput").value = "";
    } else {
      alert(data.error);
    }
  });

// display messages
async function displayChatRoom(roomName, nickname) {
  const chatroomMessages = document.getElementById("chatroomMessages");
  const chatRoomContainer = document.getElementById("chatRoomContainer");
  chatroomMessages.style.display = "block";
  chatRoomContainer.style.visibility = "visible";
  chatroomMessages.innerHTML = "";
  fetchNewMessagesPeriodically(roomName, nickname);
}

function fetchNewMessagesPeriodically(roomName, nickname) {
  setInterval(() => {
    getMessages(roomName, nickname);
  }, 3000); // Fetch every 3 seconds
}

async function getMessages(roomName, nickname) {
  try {
    const chatroomMessages = document.getElementById("chatroomMessages");
    chatroomMessages.innerHTML = "";
    // Fetch messages from the server
    const response = await fetch(`/${roomName}/messages`, {
      method: "GET",
    });

    const data = await response.json();
    console.log(data);

    if (response.ok) {
      // Process each message and append to chatroomMessages container
      data.messages.forEach((message) => {
        const messageDiv = document.createElement("div");
        messageDiv.className = "message flex items-center mb-2";

        // Get user initials from the sender's name
        const userInitials = message.sender
          .split(" ")
          .map((name) => name[0])
          .join("");

        // Check if the message sender is the current user
        if (message.sender === nickname) {
          messageDiv.classList.add("justify-end");
          messageDiv.innerHTML = `
            <div class="bg-green-100 rounded-lg p-3">
              <div class="text-sm font-medium text-gray-900">${message.sender}</div>
              <div class="text-sm text-gray-700">${message.content}</div>
              <div class="text-xs text-gray-500">${message.timestamp}</div>
            </div>
            <div class="flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white ml-3">${userInitials}</div>
          `;
        } else {
          messageDiv.innerHTML = `
            <div class="bg-blue-100 rounded-lg p-3">
              <div class="text-sm font-medium text-gray-900">${message.sender}</div>
              <div class="text-sm text-gray-700">${message.content}</div>
              <div class="text-xs text-gray-500">${message.timestamp}</div>
            </div>
            <div class="flex items-center justify-center h-8 w-8 rounded-full bg-blue-500 text-white ml-3">${userInitials}</div>
          `;
        }

        // Append the message div to the chatroomMessages container
        chatroomMessages.appendChild(messageDiv);
      });
    } else {
      // Show an alert if there's an error in the response
      alert(data.error);
    }
  } catch (error) {
    // Log any errors that occur during the fetch
    console.error("Error fetching messages:", error);
  }
}
