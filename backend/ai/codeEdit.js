const fs = require("fs");
const path = require("path");
const { OpenAI } = require("openai");
require("dotenv").config();

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

module.exports = async (req, res) => {
  const { template, prompt } = req.body;
  try {
    const codePath = path.join(__dirname, `../../public/templates/${template}/game.js`);
    const originalCode = fs.readFileSync(codePath, "utf-8");

    const systemPrompt = `
You are an expert JavaScript game developer. The user will give you a request to change gameplay behavior in a specific HTML5 game (code provided). Modify only what’s necessary, and return full updated code.
Keep the rest of the code unchanged. DO NOT add explanations or comments.
`;

    const chatRes = await openai.chat.completions.create({
      model: "gpt-4",
      messages: [
        { role: "system", content: systemPrompt },
        { role: "user", content: `Request: ${prompt}\n\n${originalCode}` }
      ]
    });

    const newCode = chatRes.choices[0].message.content;
    res.json({ updatedCode: newCode });

  } catch (err) {
    console.error("❌ AI logic error:", err.message);
    res.status(500).json({ error: "AI failed to generate code." });
  }
};
