// list all chatrooms
document
  .getElementById("toggleChatRooms")
  .addEventListener("click", async () => {
    const chatRoomsGrid = document.getElementById("chatRoomsGrid");

    try {
      const response = await fetch("/listRooms");
      const chatrooms = await response.json();

      if (response.ok) {
        console.log(chatrooms);
        chatRoomsGrid.innerHTML = ""; // Clear any existing content

        chatrooms.forEach((chatroom) => {
          const a = document.createElement("a");
          a.href = `/${chatroom.roomName}`;

          const div = document.createElement("div");
          div.className =
            "chatroom-item bg-blue-300 border border-black p-4 ml-5";
          div.textContent = chatroom.roomName;

          a.appendChild(div);
          chatRoomsGrid.appendChild(a);
        });
      } else {
        alert("Failed to load chat rooms");
      }
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  });

// createChatroom button
document
  .querySelector("#create-room-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const roomName = document.querySelector("#room-name-input").value;

    const response = await fetch("/create", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ roomName }),
    });
    const data = await response.json();
    if (response.ok) {
      window.location.href = `/${data.roomName}`;
    } else {
      alert(data.error);
    }
  });
