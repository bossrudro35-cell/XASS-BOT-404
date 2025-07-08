const axios = require("axios");
const cheerio = require("cheerio");

module.exports = {
  config: {
    name: "stalk",
    version: "2.0",
    author: "GPT Stable Mod",
    countDown: 3,
    role: 0,
    shortDescription: "Stalk FB user (no token)",
    longDescription: "Get public Facebook info using UID or tag without token",
    category: "info",
    guide: {
      en: "{pn} <uid> or reply/tag a user"
    }
  },

  onStart: async function ({ event, message, args }) {
    let uid = args[0] || Object.keys(event.mentions)[0];
    if (!uid) return message.reply("📌 Please provide a UID or mention someone.");

    if (!/^\d{10,20}$/.test(uid)) return message.reply("❗ Invalid UID format.");

    const url = `https://mbasic.facebook.com/profile.php?id=${uid}`;

    try {
      const res = await axios.get(url, {
        headers: {
          "User-Agent": "Mozilla/5.0"
        }
      });

      const $ = cheerio.load(res.data);

      const name = $("title").text() || "No data!";
      const infoText = $("div").text();

      const getInfo = (label) => {
        const regex = new RegExp(label + ": (.*?)\\n");
        const match = infoText.match(regex);
        return match ? match[1] : "No data!";
      };

      const output = `♻️ 𝗙𝗔𝗖𝗘𝗕𝗢𝗢𝗞 𝗔𝗖𝗖 𝗜𝗡𝗙𝗢 ♻️
━━━━━━━━━━━━━━━━━━
➥Name: ${name}
➥UID: ${uid}
➥Username: No data!
➥Relationship: ${getInfo("Relationship")}
➥Birthday: ${getInfo("Birthday")}
➥Followers: ${getInfo("followers") || "No data!"}
➥Home: ${getInfo("Lives in")}
➥Local: en_GB
➥Love: ${getInfo("Love")}
➥Verified: false
➥Web: ${getInfo("Website")}
➥Quotes: ${getInfo("Quote")}
➥About: ${getInfo("About")}
➥Works At: ${getInfo("Works at")}
➥gender: Boy🧍‍♂️
➥Nickname: ${getInfo("Nickname")}
➥Account Creation Date: [Unknown] || [Unknown]
━━━━━━━━━━━━━━━━━━`;

      return message.reply(output);
    } catch (e) {
      return message.reply("❌ Error fetching data. Private profile or FB blocked bot.");
    }
  }
};
