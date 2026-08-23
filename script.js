// Master database of French vocabulary paired with articles & gender notes
const vocabDatabase = [
  // Feminine Nouns (une / la)
  { front: "une voiture", back: "a car", gender: "Feminine (la)", phonetic: "[oon vwah-toor]" },
  { front: "la maison", back: "the house", gender: "Feminine (la)", phonetic: "[lah meh-zohn]" },
  { front: "une pomme", back: "an apple", gender: "Feminine (la)", phonetic: "[oon pohm]" },
  { front: "la rue", back: "the street", gender: "Feminine (la)", phonetic: "[lah roo]" },
  { front: "une eau", back: "a water", gender: "Feminine (l')", phonetic: "[oon oh]" },
  { front: "la ville", back: "the city / town", gender: "Feminine (la)", phonetic: "[lah veel]" },
  { front: "une boulangerie", back: "a bakery", gender: "Feminine (la)", phonetic: "[oon boo-lahn-zhree]" },
  
  // Masculine Nouns (un / le)
  { front: "un café", back: "a coffee / cafe", gender: "Masculine (le)", phonetic: "[uhn kah-fay]" },
  { front: "le pain", back: "the bread", gender: "Masculine (le)", phonetic: "[luh pan]" },
  { front: "un livre", back: "a book", gender: "Masculine (le)", phonetic: "[uhn leev-ruh]" },
  { front: "le travail", back: "the work / job", gender: "Masculine (le)", phonetic: "[luh trah-vy]" },
  { front: "un chien", back: "a dog", gender: "Masculine (le)", phonetic: "[uhn shyan]" },
  { front: "le restaurant", back: "the restaurant", gender: "Masculine (le)", phonetic: "[luh res-toh-rahn]" },
  { front: "un train", back: "a train", gender: "Masculine (le)", phonetic: "[uhn tranh]" },

  // Essential Phrases
  { front: "S'il vous plaît", back: "Please", gender: "Phrase", phonetic: "[seel voo pleh]" },
  { front: "Où sont les toilettes?", back: "Where is the bathroom?", gender: "Phrase", phonetic: "[oo soh leh twah-let]" },
  { front: "Je ne comprends pas", back: "I don't understand", gender: "Phrase", phonetic: "[zhuh nuh kohm-prahn pah]" }
];

// Deterministic shuffle based on the current date (Day of Year) to cycle cards daily
function getDailyDeck() {
  const today = new Date();
  const dayOfYear = Math.floor((today - new Date(today.getFullYear(), 0, 0)) / 1000 / 60 / 60 / 24);
  
  // Pseudo-random daily index shift
  return [...vocabDatabase].sort((a, b) => {
    const hashA = (a.front.length * dayOfYear) % 17;
    const hashB = (b.front.length * dayOfYear) % 17;
    return hashA - hashB;
  });
}

const flashcards = getDailyDeck();
let currentIndex = 0;

function speakFrench(text) {
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'fr-FR';
    utterance.rate = 0.85; // Slightly slower pace for clear listening
    window.speechSynthesis.speak(utterance);
  } else {
    alert("Text-to-speech is not supported in your browser.");
  }
}

function showCard() {
  const current = flashcards[currentIndex];
  document.getElementById("card-front").innerHTML = `
    <div>${current.front}</div>
    <div style="font-size:0.8rem; color:#a0aec0; margin-top:8px;">${current.gender}</div>
  `;
  
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

showCard();
