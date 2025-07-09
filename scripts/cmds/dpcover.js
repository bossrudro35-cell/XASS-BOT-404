const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "dpcover",
    version: "3.5",
    author: "Bbz x GPT",
    countDown: 3,
    role: 0,
    shortDescription: "DP + cover in canvas style",
    longDescription: "Fetches profile photo, cover, gender & UID in a stylish canvas image",
    category: "info",
    guide: "{pn} [mention/reply/self]"
  },

  onStart: async function ({ api, event, Users }) {
    const targetID = event.type === "message_reply"
      ? event.messageReply.senderID
      : event.mentions && Object.keys(event.mentions).length > 0
        ? Object.keys(event.mentions)[0]
        : event.senderID;

    const userInfo = await api.getUserInfo(targetID);
    const name = userInfo[targetID].name;
    const gender = userInfo[targetID].gender === 1 ? "🚹 Male" : userInfo[targetID].gender === 2 ? "🚺 Female" : "⚧️ Unknown";

    const dpUrl = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    // Try to get cover
    let coverUrl;
    try {
      const res = await axios.get(`https://graph.facebook.com/${targetID}?fields=cover&access_token=EAAAAUaZA8jlABABZCZD`);
      coverUrl = res.data.cover?.source || "https://i.ibb.co/FmJf2n2/default-cover.jpg";
    } catch (e) {
      coverUrl = "https://i.ibb.co/FmJf2n2/default-cover.jpg"; // fallback
    }

    // Load images
    const dpImg = await loadImage(dpUrl);
    const coverImg = await loadImage(coverUrl);

    // Resize
    const canvas = createCanvas(1120, 500);
    const ctx = canvas.getContext("2d");

    // Background
    ctx.fillStyle = "#ffffff";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw images
    ctx.drawImage(dpImg, 0, 100, 400, 400);
    ctx.drawImage(coverImg, 400, 100, 720, 400);

    // Draw texts
    ctx.font = "bold 30px DejaVu Sans";
    ctx.fillStyle = "#000000";
    ctx.fillText(`👤 Name: ${name}`, 10, 40);

    ctx.font = "24px DejaVu Sans";
    ctx.fillText(`🔻 Gender: ${gender}`, 10, 75);
    ctx.fillText(`🆔 UID: ${targetID}`, 10, 105);

    // Save output
    const filePath = path.join(__dirname, "cache", `${targetID}_canvas.jpg`);
    fs.ensureDirSync(path.join(__dirname, "cache"));
    fs.writeFileSync(filePath, canvas.toBuffer("image/jpeg"));

    // Send to chat
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  }
};
