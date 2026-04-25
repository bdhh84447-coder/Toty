const sendBtn = document.getElementById('send-btn');
const userInput = document.getElementById('user-input');
const chatBox = document.getElementById('chat-box');

const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
const ws = new WebSocket(`${wsProtocol}//${window.location.host}`);

let myLastMessages = [];

ws.addEventListener('open', () => {
    addSystemMessage('تم الاتصال بالخادم ✓');
});

ws.addEventListener('close', () => {
    addSystemMessage('انقطع الاتصال بالخادم');
});

ws.addEventListener('message', (event) => {
    try {
        const data = JSON.parse(event.data);
        const isMine = myLastMessages.includes(data.text);
        if (isMine) {
            const idx = myLastMessages.indexOf(data.text);
            myLastMessages.splice(idx, 1);
        }
        addMessage(data.text, isMine ? 'sent' : 'received');
    } catch (e) {}
});

function addMessage(text, type) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', type);
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function addSystemMessage(text) {
    const div = document.createElement('div');
    div.classList.add('message', 'system');
    div.textContent = text;
    chatBox.appendChild(div);
    chatBox.scrollTop = chatBox.scrollHeight;
}

function sendMessage() {
    const text = userInput.value.trim();
    if (text === "") return;
    if (ws.readyState !== WebSocket.OPEN) {
        addSystemMessage('ليس متصل بالخادم');
        return;
    }
    myLastMessages.push(text);
    ws.send(text);
    userInput.value = "";
}

sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', function (e) {
    if (e.key === 'Enter') {
        sendMessage();
    }
});
