const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");

module.exports.config = {
  name: "welcome",
  eventType: ["log:subscribe"], // must match exactly
  version: "2.2.1",
  credits: "Malvina-GPT",
  description: "Auto welcome new member with video if welcome is turned ON"
};

module.exports.onStart = async function({ api, event }) {
  const threadID = event.threadID;
  // Check if users enabled welcome in this thread
  const threadSettings = global.GoatBot.threadData.get(threadID) || {};
  if (!threadSettings.welcome) return; // exit if welcome off

  const added = event.logMessageData.addedParticipants[0];
  const addedID = added.userFbId;
  const addedName = added.fullName;

  const inviterID = event.logMessageData.author;
  const inviterName = (await api.getUserInfo(inviterID))[inviterID].name;

  const videoUrl = "https://drive.google.com/uc?export=download&id=1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm";
  const cache = path.join(__dirname, "..", "cache");
  if (!fs.existsSync(cache)) fs.mkdirSync(cache);
  const file = path.join(cache, `welcome_${threadID}.mp4`);

  try {
    const res = await axios.get(videoUrl, { responseType: "stream" });
    const w = res.data.pipe(fs.createWriteStream(file));
    await new Promise((r, j) => {
      w.on("finish", r);
      w.on("error", j);
    });

    const groupName = (await api.getThreadInfo(threadID)).threadName;
    const msg = {
      body:
        `👋 Hello @${addedName}\n` +
        `💌 Added by: @${inviterName}\n` +
        `🏠 Group: ${groupName}\n` +
        `🎉 Enjoy your stay!`,
      mentions: [
        { tag: `@${addedName}`, id: addedID },
        { tag: `@${inviterName}`, id: inviterID }
      ],
      attachment: fs.createReadStream(file)
    };

    await api.sendMessage(msg, threadID);
    fs.unlinkSync(file);
  } catch (err) {
    console.error("Welcome Error:", err);
    api.sendMessage("❌ Couldn't send welcome video.", threadID);
  }
};
