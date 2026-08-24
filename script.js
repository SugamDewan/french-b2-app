document.addEventListener("DOMContentLoaded", () => {
  const vocabDatabase = [
    { front: "une voiture", back: "a car", gender: "Feminine (la)", phonetic: "[oon vwah-toor]" },
    { front: "la maison", back: "the house", gender: "Feminine (la)", phonetic: "[lah meh-zohn]" },
    { front: "une pomme", back: "an apple", gender: "Feminine (la)", phonetic: "[oon pohm]" },
    { front: "la rue", back: "the street", gender: "Feminine (la)", phonetic: "[lah roo]" },
    { front: "un café", back: "a coffee / cafe", gender: "Masculine (le)", phonetic: "[uhn kah-fay]" },
    { front: "le pain", back: "the bread", gender: "Masculine (le)", phonetic: "[luh pan]" },
    { front: "un livre", back: "a book", gender: "Masculine (le)", phonetic: "[uhn leev-ruh]" },
    { front: "le travail", back: "the work / job", gender: "Masculine (le)", phonetic: "[luh trah-vy]" }
  ];

  let currentIndex = 0;

  // TAB SWITCHING
  const tabButtons = document.querySelectorAll(".tab-btn");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach(btn => {
    btn.addEventListener("click", () => {
      const targetTab = btn.getAttribute("data-tab");
      
      tabButtons.forEach(b => b.classList.remove("active"));
      tabContents.forEach(c => c.classList.remove("active"));

      btn.classList.add("active");
      document.getElementById(targetTab).classList.add("active");
    });
  });

  // FLASHCARD LOGIC
  const cardFront = document.getElementById("card-front");
  const cardBack = document.getElementById("card-back");
  const flashcard = document.getElementById("flashcard");
  const cardNum = document.getElementById("card-num");

  function speakFrench(text) {
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'fr-FR';
      utterance.rate = 0.85;
      window.speechSynthesis.speak(utterance);
    }
  }

  function showCard() {
    const current = vocabDatabase[currentIndex];
    cardFront.innerHTML = `<div>${current.front}</div><div style="font-size:0.8rem; color:#a0aec0; margin-top:8px;">${current.gender}</div>`;
    cardBack.innerHTML = `
      <p class="translation">${current.back}</p>
      <p class="phonetic">${current.phonetic}</p>
      <button id="listen-btn" style="margin-top:10px; padding:6px 12px; background:#e74c3c; color:white; border:none; border-radius:4px; cursor:pointer;">🔊 Listen</button>
    `;
    
    cardBack.classList.add("hidden");
    cardFront.classList.remove("hidden");
    cardNum.innerText = `${currentIndex + 1} / ${vocabDatabase.length}`;

    const listenBtn = document.getElementById("listen-btn");
    if (listenBtn) {
      listenBtn.addEventListener("click", (e) => {
        e.stopPropagation();
        speakFrench(current.front);
      });
    }
  }

  flashcard.addEventListener("click", () => {
    cardFront.classList.toggle("hidden");
    cardBack.classList.toggle("hidden");
  });

  document.getElementById("next-btn").addEventListener("click", () => {
    currentIndex = (currentIndex + 1) % vocabDatabase.length;
    showCard();
  });

  document.getElementById("prev-btn").addEventListener("click", () => {
    currentIndex = (currentIndex - 1 + vocabDatabase.length) % vocabDatabase.length;
    showCard();
  });

  // AI CHAT LOGIC
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("send-btn");
  const chatBox = document.getElementById("chat-box");

  async function sendMessage() {
    const text = userInput.value.trim();
    if (!text) return;

    chatBox.innerHTML += `<div class="user-msg"><strong>You:</strong> ${text}</div>`;
    userInput.value = "";
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
      const reply = data.reply || data.error || "No response received.";
      document.getElementById(loadingId).innerHTML = `<strong>Tutor:</strong> ${reply.replace(/\n/g, '<br>')}`;
    } catch (err) {
      document.getElementById(loadingId).innerHTML = `<strong>Tutor:</strong> <em>Error connecting to serverless function.</em>`;
    }

    chatBox.scrollTop = chatBox.scrollHeight;
  }

  sendBtn.addEventListener("click", sendMessage);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") sendMessage();
  });

  showCard();
});
