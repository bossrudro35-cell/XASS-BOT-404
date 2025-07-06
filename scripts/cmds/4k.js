const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const FormData = require("form-data");

module.exports = {
  config: {
    name: "4k",
    version: "1.0",
    author: "ChatGPT",
    countDown: 10,
    role: 0,
    shortDescription: "Upscale image to 4K",
    longDescription: "Enhance image resolution using AI (Torch-SRGAN)",
    category: "image",
    guide: {
      en: "{pn} (reply to an image to upscale it to 4K)"
    }
  },

  onStart: async function ({ message, event }) {
    const image = event.messageReply?.attachments?.[0];
    if (!image || image.type !== "photo") {
      return message.reply("❌ Please reply to an image to upscale it to 4K.");
    }

    const waitingMsg = await message.reply("🕐 Upscaling image to 4K...");

    try {
      const imgUrl = image.url;
      const imgPath = path.join(__dirname, "cache", `${event.senderID}_input.jpg`);
      const outPath = path.join(__dirname, "cache", `${event.senderID}_output.jpg`);

      const response = await axios.get(imgUrl, { responseType: "arraybuffer" });
      fs.writeFileSync(imgPath, Buffer.from(response.data, "binary"));

      const formData = new FormData();
      formData.append("image", fs.createReadStream(imgPath));

      const upscaleRes = await axios.post("https://api.deepai.org/api/torch-srgan", formData, {
        headers: {
          "Api-Key": "YOUR_DEEPAI_API_KEY",
          ...formData.getHeaders()
        }
      });

      if (!upscaleRes.data.output_url) {
        throw new Error("Upscaling failed.");
      }

      const upscaledImage = await axios.get(upscaleRes.data.output_url, { responseType: "arraybuffer" });
      fs.writeFileSync(outPath, Buffer.from(upscaledImage.data, "binary"));

      await message.reply({
        body: "✅ Here's your 4K upscaled image!",
        attachment: fs.createReadStream(outPath)
      });

      fs.unlinkSync(imgPath);
      fs.unlinkSync(outPath);
      waitingMsg.delete?.();
    } catch (err) {
      console.error(err);
      message.reply("❌ Failed to upscale the image.");
    }
  }
};
