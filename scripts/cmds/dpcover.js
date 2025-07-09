const axios = require("axios");
const fs = require("fs-extra");
const path = require("path");

module.exports = {
  config: {
    name: "dpcover",
    version: "2.1",
    author: "Bbz x GPT",
    countDown: 3,
    role: 0,
    shortDescription: "Fetch DP + cover + gender",
    longDescription: "Shows profile picture, cover photo, gender & name of user",
    category: "info",
    guide: "{pn} [mention/reply/self]"
  },

  onStart: async function ({ api, event, Users }) {
    const targetID = 
      event.type === "message_reply" ? event.messageReply.senderID :
      event.mentions && Object.keys(event.mentions).length > 0 ? Object.keys(event.mentions)[0] :
      event.senderID;

    const userInfo = await api.getUserInfo(targetID);
    const name = userInfo[targetID].name;
    const gender = userInfo[targetID].gender === 1 ? "🚹 Male" : userInfo[targetID].gender === 2 ? "🚺 Female" : "⚧️ Unknown";

    const profilePicUrl = `https://graph.facebook.com/${targetID}/picture?width=720&height=720&access_token=350685531728|62f8ce9f74b12f84c123cc23437a4a32`;
    const coverUrl = `https://graph.facebook.com/${targetID}?fields=cover&access_token=EAAAAUaZA8jlABABZCZD`;

    // ✅ Ensure cache folder
    const cachePath = path.join(__dirname, "cache");
    fs.ensureDirSync(cachePath);

    const img1 = path.join(cachePath, `${targetID}_dp.jpg`);
    const img2 = path.join(cachePath, `${targetID}_cover.jpg`);

    const downloadImage = async (url, path) => {
      const res = await axios.get(url, { responseType: "arraybuffer" });
      fs.writeFileSync(path, Buffer.from(res.data, "binary"));
    };

    // Download profile pic
    await downloadImage(profilePicUrl, img1);

    // Try to get cover photo
    let hasCover = false;
    try {
      const coverRes = await axios.get(coverUrl);
      if (coverRes.data.cover && coverRes.data.cover.source) {
        await downloadImage(coverRes.data.cover.source, img2);
        hasCover = true;
      }
    } catch (e) {
      hasCover = false;
    }

    // Prepare and send
    const msg = {
      body: `👤 Name: ${name}\n🔻 Gender: ${gender}\n🆔 UID: ${targetID}`,
      attachment: hasCover 
        ? [fs.createReadStream(img1), fs.createReadStream(img2)]
        : fs.createReadStream(img1)
    };

    api.sendMessage(msg, event.threadID, () => {
      fs.unlinkSync(img1);
      if (hasCover) fs.unlinkSync(img2);
    });
  }
};
