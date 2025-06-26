const axios = require("axios");
const JSZip = require("jszip");
const fs = require("fs");
const path = require("path");

module.exports = async (req, res) => {
  const { gameData, templateName } = req.body;

  try {
    const templatePath = path.join(__dirname, `../public/templates/${templateName}`);
    const files = fs.readdirSync(templatePath);

    const zip = new JSZip();

    // Copy all files from the selected template
    for (const file of files) {
      const fullPath = path.join(templatePath, file);
      if (fs.statSync(fullPath).isFile()) {
        zip.file(file, fs.readFileSync(fullPath));
      }
    }

    // Save user config (for injection inside game)
    const gameConfig = {
      template: templateName,
      settings: gameData.settings,
      themePrompt: gameData.themePrompt,
      musicPrompt: gameData.musicPrompt,
      musicURL: gameData.musicURL || null,
      exportedAt: gameData.date,
    };

    zip.file("gameConfig.json", JSON.stringify(gameConfig, null, 2));

    // Generate and return .zip file
    const zipBuffer = await zip.generateAsync({ type: "nodebuffer" });

    const zipName = `${templateName}-custom-game.zip`;
    const zipPath = path.join(__dirname, `../exports/${zipName}`);
        // If user selected AI image, download and include it
        const selectedImageURL = gameData.selectedImageURL;
        if (selectedImageURL) {
          try {
            const imageResponse = await axios.get(selectedImageURL, { responseType: 'arraybuffer' });
            zip.folder("assets").file("ai-image.png", imageResponse.data); // Save with a consistent name
            console.log("✅ Included AI image in export as assets/ai-image.png");
          } catch (err) {
            console.warn("⚠️ Failed to download AI image:", err.message);
          }
        }
    
    fs.writeFileSync(zipPath, zipBuffer);

    res.download(zipPath, zipName);
  } catch (err) {
    console.error("❌ Export error:", err);
    res.status(500).json({ error: "Failed to export game." });
  }
  const updatedCode = gameData.updatedGameCode;
if (updatedCode) {
  zip.file("game.js", updatedCode);
}

};
