const flashcards = [
  { front: "Bonjour", back: "Hello / Good day", phonetic: "[bohn-zhoor]" },
  { front: "Merci beaucoup", back: "Thank you very much", phonetic: "[mair-see boh-koo]" },
  { front: "S'il vous plaît", back: "Please", phonetic: "[seel voo pleh]" },
  { front: "Comment allez-vous?", back: "How are you?", phonetic: "[koh-mahn tah-lay voo]" },
  { front: "Au revoir", back: "Goodbye", phonetic: "[oh ruh-vwahr]" },
  { front: "Où sont les toilettes?", back: "Where is the bathroom?", phonetic: "[oo soh leh twah-let]" },
  { front: "Je ne comprends pas", back: "I don't understand", phonetic: "[zhuh nuh kohm-prahn pah]" },
  { front: "Combien ça coûte?", back: "How much does it cost?", phonetic: "[kohm-byan sah koot]" },
  { front: "Je voudrais un café", back: "I would like a coffee", phonetic: "[zhuh voo-dreh ahn kah-fay]" },
  { front: "À bientôt", back: "See you soon", phonetic: "[ah byan-toh]" }
];

let currentIndex = 0;

// Text-to-Speech function for French audio
function speakFrench(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop any previous audio
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.9; // Slightly slower pace for clear learning
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech is not supported in your browser.");
  }
}

function showCard() {
  const current = flashcards[currentIndex];
  document.getElementById("card-front").innerText = current.front;
  document.getElementById("card-back").innerHTML = `
    <p class="translation">${current.back}</p>
    <p class="phonetic">${current.phonetic}</p>
    <button onclick="event.stopPropagation(); speakFrench('${current.front.replace(/'/g, "\\'")}')" style="margin-top:10px; padding:6px 12px; background:#e74c3c; color:white; border:none; border-radius:4px; cursor:pointer; font-weight:bold;">
      🔊 Listen
    </button>
  `;
  document.getElementById("card-back").classList.add("hidden");
  document.getElementById("card-front").classList.remove("hidden");
  document.getElementById("card-num").innerText = `${currentIndex + 1} / ${flashcards.length}`;
}

function flipCard() {
  document.getElementById("card-front").classList.toggle("hidden");
  document.getElementById("card-back").classList.toggle("hidden");
}

function nextCard() {
  currentIndex = (currentIndex + 1) % flashcards.length;
  showCard();
}

function prevCard() {
  currentIndex = (currentIndex - 1 + flashcards.length) % flashcards.length;
  showCard();
}

function switchTab(tabId) {
  document.querySelectorAll(".tab-content").forEach(el => el.classList.remove("active"));
  document.querySelectorAll(".tab-btn").forEach(el => el.classList.remove("active"));
  
  document.getElementById(tabId).classList.add("active");
  event.currentTarget.classList.add("active");
}

function sendMessage() {
  const input = document.getElementById("user-input");
  const text = input.value.trim();
  if (!text) return;

  const chatBox = document.getElementById("chat-box");
  chatBox.innerHTML += `<div class="user-msg"><strong>You:</strong> ${text}</div>`;
  input.value = "";

  setTimeout(() => {
    chatBox.innerHTML += `<div class="bot-msg"><strong>Tutor:</strong> Très bien! Continuez d'pratiquer.<br><em>(Very good! Keep practicing.)</em></div>`;
    chatBox.scrollTop = chatBox.scrollHeight;
  }, 600);

  chatBox.scrollTop = chatBox.scrollHeight;
}

function handleKey(e) {
  if (e.key === "Enter") sendMessage();
}

// Initialize on page load
showCard();