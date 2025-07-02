// JavaScript for connecting HTML UI to Flask backend
const chatLog = document.getElementById('chat-log');
const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');

chatForm.addEventListener('submit', async function(e) {
    e.preventDefault();
    const text = userInput.value.trim();
    if (!text) return;
    addMessage('You', text, 'user');
    userInput.value = '';
    chatLog.scrollTop = chatLog.scrollHeight;
    // Show bot thinking
    const thinkingMsg = addMessage('MoodBot 🤖', 'Let me think...', 'bot');
    chatLog.scrollTop = chatLog.scrollHeight;
    // Send to Flask backend
    try {
        const res = await fetch('http://127.0.0.1:5000/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: text })
        });
        const data = await res.json();
        // Replace 'Let me think...' with real response
        thinkingMsg.querySelector('.text').textContent = data.response;
    } catch (err) {
        thinkingMsg.querySelector('.text').textContent = 'Sorry, server error.';
    }
    chatLog.scrollTop = chatLog.scrollHeight;
});

function addMessage(sender, text, type) {
    const msgDiv = document.createElement('div');
    msgDiv.className = `message ${type}`;
    msgDiv.innerHTML = `<span class="sender">${sender}: </span><span class="text">${text}</span>`;
    chatLog.appendChild(msgDiv);
    return msgDiv;
}
