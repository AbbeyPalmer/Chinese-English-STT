// Check for browser support
if (!('webkitSpeechRecognition' in window)) {
    alert('Your browser does not support the Web Speech API. Please use Chrome or Edge.');
  }
  
  // Variables
  const startButton = document.getElementById('start');
  const stopButton = document.getElementById('stop');
  const mandarinOutput = document.getElementById('mandarinOutput');
  const englishOutput = document.getElementById('englishOutput');
  
  let recognition;
  
  // Initialize Speech Recognition
  function initializeRecognition() {
    recognition = new webkitSpeechRecognition(); // Use SpeechRecognition in supported browsers
    recognition.continuous = true; // Keep listening
    recognition.interimResults = false; // Show only finalized results
    recognition.lang = 'zh-CN'; // Mandarin
  
    recognition.onresult = async (event) => {
      let mandarinText = '';
      for (let i = 0; i < event.results.length; i++) {
        mandarinText += event.results[i][0].transcript + ' ';
      }
      mandarinOutput.textContent = mandarinText.trim();
  
      // Translate to English
      const englishText = await translateText(mandarinText.trim());
      englishOutput.textContent = englishText;
    };
  
    recognition.onerror = (event) => {
      console.error('Recognition error:', event.error);
    };
  
    recognition.onend = () => {
      startButton.disabled = false;
      stopButton.disabled = true;
    };
  }
  
  // Start recording
  startButton.addEventListener('click', () => {
    initializeRecognition();
    recognition.start();
    startButton.disabled = true;
    stopButton.disabled = false;
    mandarinOutput.textContent = 'Listening...';
    englishOutput.textContent = 'Translating...';
  });
  
  // Stop recording
  stopButton.addEventListener('click', () => {
    recognition.stop();
    startButton.disabled = false;
    stopButton.disabled = true;
  });
  
  // Translate text using MyMemory API
  async function translateText(text) {
    try {
      const response = await fetch(`https://api.mymemory.translated.net/get?q=${encodeURIComponent(text)}&langpair=zh-CN|en`);
      const data = await response.json();
      return data.responseData.translatedText;
    } catch (error) {
      console.error('Translation error:', error);
      return 'Translation failed.';
    }
  }
  