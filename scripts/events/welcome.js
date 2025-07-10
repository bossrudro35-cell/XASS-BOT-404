const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "2.2.0",
  credits: "Malvina-GPT",
  description: "Welcome with video attachment, mention user and who added"
};

module.exports.onStart = async function({ api, event }) {
  const { threadID, logMessageData } = event;
  const added = logMessageData.addedParticipants[0];
  const addedID = added.userFbId;
  const addedName = added.fullName;

  const inviterID = logMessageData.author;
  const inviterInfo = await api.getUserInfo(inviterID);
  const inviterName = inviterInfo[inviterID].name;

  const videoUrl = "https://drive.google.com/uc?export=download&id=1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm";
  const filePath = path.join(__dirname, "cache", `welcome_${threadID}.mp4`);

  try {
    const res = await axios.get(videoUrl, { responseType: "stream" });
    const stream = fs.createWriteStream(filePath);
    res.data.pipe(stream);
    await new Promise((resolve, reject) => {
      stream.on("finish", resolve);
      stream.on("error", reject);
    });

    const groupInfo = await api.getThreadInfo(threadID);
    const groupName = groupInfo.threadName;

    const message = {
      body: `👋 Hello @${addedName}\n💌 Added by: @${inviterName}\n🏠 Group: ${groupName}\n🆔 GC ID: ${threadID}\n🎉 Enjoy your stay!`,
      mentions: [
        { tag: `@${addedName}`, id: addedID },
        { tag: `@${inviterName}`, id: inviterID }
      ],
      attachment: fs.createReadStream(filePath)
    };

    await api.sendMessage(message, threadID);
    fs.unlinkSync(filePath);
  } catch (err) {
    console.error("Welcome Error:", err);
    api.sendMessage("❌ Could not send welcome video.", threadID);
  }
};
