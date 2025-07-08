const axios = require("axios");

module.exports.config = {
  name: "stalk",
  version: "1.0.0",
  credits: "ChatGPT",
  description: "Facebook user info with UID or profile",
  commandCategory: "info",
  usages: ".stalk [uid/link]",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const uid = args[0] || event.senderID;
  const time = new Date().toLocaleString("en-GB", { timeZone: "Asia/Dhaka" });

  try {
    // Dummy data for now, replace with actual API if needed
    const data = {
      name: "MU SH FI Q",
      fast: "MU",
      uid,
      username: "mu.sh.fi.q.775954",
      relationship: "No data!",
      birthday: "No data!",
      followers: "3699",
      home: "Panchagarh, Rājshāhi, Bangladesh",
      local: "en_GB",
      love: "No data!",
      verified: "false",
      web: "No data!",
      quotes: "No data!",
      about: "No data!",
      work: "CYBER71 OFFICIAL",
      gender: "Boy🧍🏻‍♂️",
      nickname: "Siad",
      creationDate: "[ 09/06/2023 ] || [ 09:07:48 ]"
    };

    const msg = `♻️ FACEBOOK ACC INFO ♻️
➥Name: ${data.name}
➥Fast: ${data.fast}
➥UID: ${data.uid}
➥UserName: ${data.username}
➥Relationship: ${data.relationship}
➥Birthday: ${data.birthday}
➥Followers: ${data.followers}
➥Home: ${data.home}
➥Local: ${data.local}
➥Love: ${data.love}
➥Verified: ${data.verified}
➥Web: ${data.web}
➥Quotes: ${data.quotes}
➥About: ${data.about}
➥Works At: ${data.work}
➥Gender: ${data.gender}
➥Nickname: ${data.nickname}
➥Account Creation Date:
${data.creationDate}
━━━━━━━━━━━━━━━━━━━━━`;

    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    return api.sendMessage("❌ Error fetching profile info.", event.threadID, event.messageID);
  }
};
