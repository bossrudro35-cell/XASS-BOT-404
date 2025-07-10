const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "2.2.0",
  credits: "Malvina-GPT",
  description: "Welcome video file attached, no link exposure; mentions both new user & inviter"
};

module.exports.run = async function({ api, event }) {
  const { threadID, logMessageData } = event;
  const added = logMessageData.addedParticipants[0];
  const addedID = added.userFbId;
  const addedName = added.fullName;

  const inviterID = logMessageData.author;
  const invInfo = await api.getUserInfo(inviterID);
  const inviterName = invInfo[inviterID].name;

  const videoUrl = "https://drive.google.com/uc?export=download&id=1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm";
  const cacheDir = path.join(__dirname, "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const videoPath = path.join(cacheDir, `welcome_${threadID}.mp4`);

  try {
    // Download video
    const res = await axios.get(videoUrl, { responseType: "stream" });
    await new Promise((resv, rej) => {
      const ws = fs.createWriteStream(videoPath);
      res.data.pipe(ws);
      ws.on("finish", resv);
      ws.on("error", rej);
    });

    // Build welcome text
    const threadInfo = await api.getThreadInfo(threadID);
    const groupName = threadInfo.threadName;
    const msgBody = `
👋 Hello @${addedName}
💌 You were added by: @${inviterName}
🏠 Group: ${groupName}
🆔 GC ID: ${threadID}
🎉 Enjoy your stay!
`;

    // Send video as file attachment
    await api.sendMessage({
      body: msgBody,
      mentions: [
        { tag: `@${addedName}`, id: addedID },
        { tag: `@${inviterName}`, id: inviterID }
      ],
      attachment: fs.createReadStream(videoPath)
    }, threadID);

    fs.unlinkSync(videoPath);
  } catch (err) {
    console.error("Welcome Error:", err);
    api.sendMessage("❌ Could not send welcome video.", threadID);
  }
};
