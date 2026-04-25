const express = require('express');
const http = require('http');
const { WebSocketServer } = require('ws');
const path = require('path');

const app = express();
const server = http.createServer(app);
const wss = new WebSocketServer({ server });

app.use(express.static(__dirname));

wss.on('connection', (ws) => {
  ws.on('message', (data) => {
    let text;
    try {
      text = data.toString();
    } catch (e) {
      return;
    }
    if (!text || !text.trim()) return;

    const payload = JSON.stringify({
      text: text.trim(),
      time: Date.now(),
    });

    wss.clients.forEach((client) => {
      if (client.readyState === 1) {
        client.send(payload);
      }
    });
  });
});

const PORT = parseInt(process.env.PORT, 10) || 5000;
server.listen(PORT, '0.0.0.0', () => {
  console.log(`Server running on port ${PORT}`);
});
