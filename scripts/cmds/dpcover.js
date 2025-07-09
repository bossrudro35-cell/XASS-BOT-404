const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");
const { createCanvas, loadImage } = require("canvas");

module.exports = {
  config: {
    name: "dpcover",
    version: "3.0",
    author: "Bbz x GPT",
    countDown: 3,
    role: 0,
    shortDescription: "DP + cover in canvas style",
    longDescription: "Fetches profile photo, cover, gender & UID in stylish image",
    category: "info",
    guide: "{pn} [mention/reply/self]"
  },

  onStart: async function ({ api, event, Users }) {
    const targetID = event.type === "message_reply" ? event.messageReply.senderID :
      event.mentions && Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] :
      event.senderID;

    const userInfo = await api.getUserInfo(targetID);
    const name = userInfo[targetID].name;
    const gender = userInfo[targetID].gender === 1 ? "🚹 Male" : userInfo[targetID].gender === 2 ? "🚺 Female" : "⚧️ Unknown";

    const dpUrl = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;

    let coverUrl;
    try {
      const res = await axios.get(`https://graph.facebook.com/${targetID}?fields=cover&access_token=EAAAAUaZA8jlABABZCZD`);
      coverUrl = res.data.cover?.source || "https://i.imgur.com/O3G6t9W.jpg";
    } catch {
      coverUrl = "https://i.imgur.com/O3G6t9W.jpg"; // fallback
    }

    const dpImg = await loadImage(dpUrl);
    const coverImg = await loadImage(coverUrl);

    const canvas = createCanvas(dpImg.width + coverImg.width, 500);
    const ctx = canvas.getContext("2d");

    // Background white
    ctx.fillStyle = "white";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Draw DP & cover
    ctx.drawImage(dpImg, 0, 100, 400, 400);
    ctx.drawImage(coverImg, 400, 100, 720, 400);

    // Draw Text
    ctx.font = "bold 30px DejaVu Sans";
    ctx.fillStyle = "black";
    ctx.fillText(`👤 Name: ${name}`, 10, 40);
    ctx.font = "24px DejaVu Sans";
    ctx.fillText(`🔻 Gender: ${gender}`, 10, 75);
    ctx.fillText(`🆔 UID: ${targetID}`, 10, 105);

    // Save
    const filePath = path.join(__dirname, "cache", `${targetID}_canvas.jpg`);
    fs.ensureDirSync(path.join(__dirname, "cache"));
    const buffer = canvas.toBuffer("image/jpeg");
    fs.writeFileSync(filePath, buffer);

    // Send to user
    api.sendMessage({
      body: "",
      attachment: fs.createReadStream(filePath)
    }, event.threadID, () => fs.unlinkSync(filePath), event.messageID);
  }
};
