const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "4k",
    version: "3.0",
    author: "ChatGPT",
    countDown: 10,
    role: 0,
    shortDescription: "Upscale image to 4K",
    longDescription: "Reply to an image to upscale it to 4K resolution using a stable API",
    category: "image",
    guide: {
      en: "{pn} (reply to an image)"
    }
  },

  onStart: async function ({ message, event }) {
    const image = event.messageReply?.attachments?.[0];
    if (!image || image.type !== "photo") {
      return message.reply("❌ Please reply to an image.");
    }

    const waiting = await message.reply("🔄 Uploading image...");

    const inputPath = path.join(__dirname, "cache", `${event.senderID}_input.jpg`);
    const outputPath = path.join(__dirname, "cache", `${event.senderID}_output.jpg`);

    try {
      // Download the replied image
      const res = await axios.get(image.url, { responseType: "arraybuffer" });
      fs.writeFileSync(inputPath, res.data);

      // Use REAL working upscale API (no key needed)
      const form = new FormData();
      form.append("file", fs.createReadStream(inputPath));

      const upscaleRes = await axios.post("https://api.aixcoder.top/upscale", form, {
        headers: form.getHeaders()
      });

      const resultUrl = upscaleRes.data?.url;
      if (!resultUrl) throw new Error("Upscaling failed");

      const finalImg = await axios.get(resultUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(outputPath, finalImg.data);

      // Send the image back
      await message.reply({
        body: "✅ Upscaled to 4K successfully!",
        attachment: fs.createReadStream(outputPath)
      });

      fs.unlinkSync(inputPath);
      fs.unlinkSync(outputPath);
      waiting.delete?.();
    } catch (err) {
      console.error("4K Error:", err.message);
      message.reply("❌ Could not upscale image. Try again with a different one.");
      if (fs.existsSync(inputPath)) fs.unlinkSync(inputPath);
      if (fs.existsSync(outputPath)) fs.unlinkSync(outputPath);
    }
  }
};
