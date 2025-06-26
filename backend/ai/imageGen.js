const { OpenAI } = require("openai");
require('dotenv').config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

module.exports = async (req, res) => {
  try {
    const { prompt } = req.body;
    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 2,
      size: "512x512"
    });

    const imageUrls = response.data.map(img => img.url);
    res.json({ images: imageUrls });
  } catch (err) {
    console.error("Image generation failed:", err);
    res.status(500).json({ error: "Image generation failed" });
  }
};
