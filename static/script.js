document.addEventListener("DOMContentLoaded", () => {

    const sendBtn = document.getElementById("sendBtn");
    const voiceBtn = document.getElementById("voiceBtn");

    sendBtn.onclick = sendMessage;
    voiceBtn.onclick = startVoice;

    function sendMessage() {
        let input = document.getElementById("chat").value;

        if (!input) return;

        addMessage(input, "user");

        fetch("/ask", {
            method: "POST",
            headers: {"Content-Type": "application/json"},
            body: JSON.stringify({question: input})
        })
        .then(res => res.json())
        .then(data => {
            addMessage(data.answer, "bot");
            speak(data.answer);
        });
    }

    function addMessage(text, type) {
        let div = document.createElement("div");
        div.className = type;
        div.innerText = text;
        document.getElementById("chatBox").appendChild(div);
    }

    // 🔊 Text-to-Speech
    function speak(text) {
        let speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speechSynthesis.speak(speech);
    }

    // 🎤 Voice Input
    function startVoice() {
        let recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";

        recognition.start();

        recognition.onresult = function(event) {
            let text = event.results[0][0].transcript;
            document.getElementById("chat").value = text;
            sendMessage();
        };
    }

})