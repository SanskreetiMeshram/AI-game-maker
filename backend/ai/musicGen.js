const axios = require('axios');
require('dotenv').config();

module.exports = async (req, res) => {
  const { prompt } = req.body;
  console.log("🎵 Music prompt:", prompt);

  try {
    const response = await axios.post('https://api.mubert.com/v2/RecordTrackTTM', {
      method: "RecordTrackTTM",
      params: {
        apiKey: process.env.MUBERT_API_KEY,
        text: prompt,
        duration: 30, // seconds
        format: "wav",
      }
    });

    const musicUrl = response.data.data?.trackUrl;
    if (!musicUrl) throw new Error("No track returned");

    res.json({ music: musicUrl });
  } catch (err) {
    console.error("Music generation error:", err.message);
    res.status(500).json({ error: "Failed to generate music" });
  }
};
