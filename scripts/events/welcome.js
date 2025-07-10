const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"],
  version: "3.0.0",
  credits: "Malvina-GPT",
  description: "Welcome with video, no link, full mention system"
};

module.exports.onStart = async function({ api, event }) {
  const threadID = event.threadID;

  // 🔒 Check if welcome is enabled
  const threadData = global.GoatBot.threadData.get(threadID) || {};
  if (!threadData.welcome) return;

  const added = event.logMessageData.addedParticipants[0];
  const addedID = added.userFbId;
  const addedName = added.fullName;

  const inviterID = event.logMessageData.author;
  const inviterName = (await api.getUserInfo(inviterID))[inviterID].name;

  const videoURL = "https://drive.google.com/uc?export=download&id=1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm";
  const cacheDir = path.join(__dirname, "..", "cache");
  if (!fs.existsSync(cacheDir)) fs.mkdirSync(cacheDir);
  const videoPath = path.join(cacheDir, `welcome_${threadID}.mp4`);

  try {
    const response = await axios.get(videoURL, { responseType: "stream" });
    const writer = fs.createWriteStream(videoPath);
    response.data.pipe(writer);
    await new Promise((res, rej) => {
      writer.on("finish", res);
      writer.on("error", rej);
    });

    const groupInfo = await api.getThreadInfo(threadID);
    const groupName = groupInfo.threadName || "this group";

    await api.sendMessage({
      body: `👋 Welcome @${addedName}!\n🎉 Added by: @${inviterName}\n🏠 Group: ${groupName}`,
      mentions: [
        { tag: `@${addedName}`, id: addedID },
        { tag: `@${inviterName}`, id: inviterID }
      ],
      attachment: fs.createReadStream(videoPath)
    }, threadID);

    fs.unlinkSync(videoPath);
  } catch (err) {
    console.error("❌ Welcome error:", err);
    api.sendMessage("❌ Could not send welcome video.", threadID);
  }
};
