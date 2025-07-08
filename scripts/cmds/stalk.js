const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "stalk",
    version: "5.1",
    author: "GPT BossMod",
    role: 0,
    shortDescription: "Stalk FB with profile pic + info",
    longDescription: "Get Facebook info + profile and cover photo from UID / mention / reply",
    category: "info",
    guide: {
      en: "{pn} <uid | profile link | @mention> or reply to a message"
    }
  },

  onStart: async function ({ event, message, args }) {
    let uid;

    // ✅ 1. Reply diye use korle
    if (event.type === "message_reply") {
      uid = event.messageReply.senderID;
    }

    // ✅ 2. Naile argument/mention theke UID
    else {
      uid = args[0] || Object.keys(event.mentions)[0];
    }

    if (!uid) return message.reply("❗ Provide a UID, FB link, or reply to someone.");

    // ✅ 3. Link banai
    const profileUrl = uid.includes("facebook.com")
      ? uid.replace("www.", "mbasic.")
      : `https://mbasic.facebook.com/profile.php?id=${uid}`;

    message.reply("🔍 Scraping FB profile, wait...");

    try {
      // 🔍 Scrape shuru
      const res = await axios.get(profileUrl, {
        headers: { "User-Agent": "Mozilla/5.0" }
      });

      const $ = cheerio.load(res.data);
      const name = $("title").text()?.split("|")[0]?.trim() || "No data!";
      const infoText = $("div").text();

      // 🔍 Info fetch function
      const getField = (label) => {
        const match = infoText.match(new RegExp(`${label}:\\s*(.*?)\\n`));
        return match ? match[1] : "No data!";
      };

      // ✅ Profile & cover photo
      const dp = $('img[src*="profile_pic"]').attr("src") || null;
      const cover = $('img[src*="cover"]').attr("src") || null;

      // 📋 Info message
      const replyText = `♻️ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗖𝗖 𝗜𝗡𝗙𝗢 ♻️
━━━━━━━━━━━━━
➥Name: ${name}
➥UID: ${uid}
➥Relationship: ${getField("Relationship")}
➥Birthday: ${getField("Birthday")}
➥Followers: ${getField("followers")}
➥Home: ${getField("Lives in") || "No data"}
➥Works At: ${getField("Works at")}
➥Gender: ${getField("Gender") || "No data!"}
➥Nickname: ${getField("Nickname")}
➥Account Creation Date: [Unknown] || [Unknown]
━━━━━━━━━━━━━`;

      // 📎 Attach image
      const attachment = [];

      if (dp) {
        const dpImg = (await axios.get(dp, { responseType: "stream" })).data;
        attachment.push(dpImg);
      }

      if (cover) {
        const coverImg = (await axios.get(cover, { responseType: "stream" })).data;
        attachment.push(coverImg);
      }

      return message.reply({ body: replyText, attachment });

    } catch (err) {
      console.error("STALK ERROR:", err.message);
      return message.reply("❌ Couldn't fetch info. Maybe private or invalid.");
    }
  }
};
