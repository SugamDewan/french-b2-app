async function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div class="user-msg"><strong>You:</strong> ${text}</div>`;
  input.value = "";
  chatBox.scrollTop = chatBox.scrollHeight;

  const loadingId = "loading-" + Date.now();
  chatBox.innerHTML += `<div class="bot-msg" id="${loadingId}"><strong>Tutor:</strong> <em>Thinking...</em></div>`;
  chatBox.scrollTop = chatBox.scrollHeight;

  try {
    const response = await fetch("/api/chat", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ message: text })
    });

    const data = await response.json();
    document.getElementById(loadingId).innerHTML = `<strong>Tutor:</strong> ${data.reply.replace(/\n/g, '<br>')}`;
  } catch (err) {
    document.getElementById(loadingId).innerHTML = `<strong>Tutor:</strong> <em>Error fetching response. Try again.</em>`;
  }

  chatBox.scrollTop = chatBox.scrollHeight;
}
