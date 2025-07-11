const fs = require("fs");
const request = require("request");

module.exports.config = {
  name: "groupinfo",
  version: "1.0.0",
  hasPermssion: 1,
  credits: "Rahad",
  description: "View group information",
  commandCategory: "Box",
  usages: "groupinfo",
  cooldowns: 0
};

module.exports.run = async function ({ api, event }) {
  try {
    const threadInfo = await api.getThreadInfo(event.threadID);
    const threadName = threadInfo.threadName || "Unnamed Group";
    const threadID = threadInfo.threadID;
    const emoji = threadInfo.emoji || "❓";
    const approvalMode = threadInfo.approvalMode ? "Turned On" : "Turned Off";
    const totalMessages = threadInfo.messageCount || "N/A";
    const totalMembers = threadInfo.participantIDs.length;
    const adminCount = threadInfo.adminIDs.length;
    const imageSrc = threadInfo.imageSrc;

    let male = 0, female = 0;
    for (let user of threadInfo.userInfo) {
      if (user.gender === "MALE") male++;
      else if (user.gender === "FEMALE") female++;
    }

    const msg =
`╭─────────────⭓
┃ 🛠️ 𝗚𝗖 𝗡𝗮𝗺𝗲: 『 ${threadName} 』
┃ 🆔 𝗚𝗥𝗢𝗨𝗣 𝗜𝗗: ${threadID}
┃ ✅ 𝗔𝗽𝗽𝗿𝗼𝘃𝗮𝗹 𝗠𝗼𝗱𝗲: ${approvalMode}
┃ 😊 𝗘𝗺𝗼𝗷𝗶: ${emoji}
┃ 👥 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${totalMembers}
┃ ♂️ 𝗠𝗮𝗹𝗲 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${male}
┃ ♀️ 𝗙𝗲𝗺𝗮𝗹𝗲 𝗠𝗲𝗺𝗯𝗲𝗿𝘀: ${female}
┃ 🛡️ 𝗔𝗱𝗺𝗶𝗻𝘀: ${adminCount}
┃ 💬 𝗧𝗼𝘁𝗮𝗹 𝗠𝗲𝘀𝘀𝗮𝗴𝗲𝘀: ${totalMessages}
╰─────────────⭓

✨ 𝗠𝗮𝗱𝗲 𝘄𝗶𝘁𝗵 ❤️ 𝗯𝘆: 𝗥𝗔𝗛𝗔𝗗 ✨`;

    const sendMessage = (imagePath) => {
      api.sendMessage({
        body: msg,
        attachment: imagePath ? fs.createReadStream(imagePath) : null
      }, event.threadID, () => {
        if (imagePath && fs.existsSync(imagePath)) fs.unlinkSync(imagePath);
      }, event.messageID);
    };

    if (imageSrc) {
      const imagePath = `${__dirname}/cache/group_avatar.png`;
      request(encodeURI(imageSrc))
        .pipe(fs.createWriteStream(imagePath))
        .on("close", () => sendMessage(imagePath));
    } else {
      sendMessage();
    }

  } catch (err) {
    console.error("GroupInfo Error:", err);
    api.sendMessage("❌ Failed to fetch group info.", event.threadID, event.messageID);
  }
};
