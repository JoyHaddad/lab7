document.addEventListener("DOMContentLoaded", () => {
  const chatroomMessages = document.getElementById("chatroomMessages");
  const messageInput = document.getElementById("messageInput");
  const sendMessageBtn = document.getElementById("sendMessageBtn");

  sendMessageBtn.addEventListener("click", () => {
    const messageText = messageInput.value.trim();
    if (messageText) {
      const messageDiv = document.createElement("div");
      messageDiv.className = "message flex items-center mb-2 justify-end";

      const userName = "BB";
      const userInitials = userName
        .split(" ")
        .map((name) => name[0])
        .join("");

      messageDiv.innerHTML = `
          <div class="bg-green-100 rounded-lg p-3">
            <div class="text-sm font-medium text-gray-900">${userName}</div>
            <div class="text-sm text-gray-700">${messageText}</div>
            <div class="text-xs text-gray-500">${new Date().toLocaleTimeString(
              [],
              { hour: "2-digit", minute: "2-digit" }
            )}</div>
          </div>
          <div class="flex items-center justify-center h-8 w-8 rounded-full bg-green-500 text-white ml-3">${userInitials}</div>
        `;

      chatroomMessages.appendChild(messageDiv);
      messageInput.value = "";
    }
  });
});
