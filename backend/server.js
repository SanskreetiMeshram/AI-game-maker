require('dotenv').config();
const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const imageGen = require('./ai/imageGen');
const musicGen = require('./ai/musicGen');
const exportGame = require('./gameExport');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(bodyParser.urlencoded({ extended: true }));
app.post("/ai-code-edit", require("./ai/codeEdit"));

// Test route
app.get('/', (req, res) => {
  res.send('🎮 GameGen Backend is Running');
});

// AI Image generation
app.post('/api/generate-image', imageGen);

// AI Music generation
app.post('/api/generate-music', musicGen);

// Export game
app.post('/api/export-game', exportGame);

app.listen(PORT, () => {
  console.log(`🚀 Server running on http://localhost:${PORT}`);
});
app.use('/view/:gameId', (req, res) => {
    const id = req.params.gameId;
    const gameFolder = path.join(__dirname, `../publicGames/${id}`);
    res.sendFile(path.join(gameFolder, "index.html"));
  });
  
  app.use('/view', express.static(path.join(__dirname, '../publicGames')));
  