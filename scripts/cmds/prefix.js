const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { utils } = global;

// Author Protection
const BAJYID_ID = "100005193854879";

// Google Drive Video IDs
const VIDEO_IDS = [
  "1-WKsuSsLsO8BKc2Oil0KAxvgcwcsFTA3",
  "1-8VSzbLm7c2eBesp8YwwvJxdhs0dcFSL",
  "102gwONoMStLZxNUuRH7SQ0j8mmwoGMg6",
  "10QycYgsTagrN90cWJCIWWVwmps2kk_oF"
];

module.exports = {
  config: {
    name: "prefix",
    version: "3.0",
    author: "BaYjid + Rahad",
    countDown: 5,
    role: 0,
    description: "🛠️ Change prefix or show current with random video",
    category: "⚙️ Configuration",
    guide: {
      en:
        "╔═[ PREFIX HELP ]═╗\n" +
        "📌 {pn} <new prefix>: Change group prefix\n" +
        "📌 {pn} <new prefix> -g: Change global prefix (admin only)\n" +
        "🛠️ {pn} reset: Reset group prefix to default\n" +
        "🕹️ Type \"prefix\" to see current prefix info + random video\n" +
        "╚═════════════════╝"
    }
  },

  langs: {
    en: {
      reset: "✅ Group prefix reset to default: %1",
      onlyAdmin: "⚠️ Only bot admins can change the global prefix!",
      onlyAuthor: "⛔️ Only BaYjid can change prefix!",
      confirmGlobal: "🛡️ React to confirm changing the GLOBAL prefix.",
      confirmThisThread: "💬 React to confirm changing the GROUP prefix.",
      successGlobal: "✅ Global prefix updated to: %1",
      successThisThread: "✅ Group prefix updated to: %1",
      myPrefix:
        "╔═[ 📌 𝐏𝐑𝐄𝐅𝐈𝐗 𝐈𝐍𝐅𝐎 ]═╗\n" +
        "🌐 Global Prefix: %1\n" +
        "💬 Group Prefix: %2\n" +
        "⏰ Time: %3\n" +
        "🧑 Edited By: %4\n" +
        "📅 Change Date: %5\n" +
        "╚═════════════════╝"
    }
  },

  onStart: async function ({ message, role, args, commandName, event, threadsData, getLang }) {
    if (!args[0]) return message.SyntaxError();

    if (event.senderID !== BAJYID_ID) {
      return message.reply(getLang("onlyAuthor"));
    }

    if (args[0] === "reset") {
      await threadsData.set(event.threadID, null, "data.prefix");
      await threadsData.set(event.threadID, null, "data.prefixEditor");
      await threadsData.set(event.threadID, null, "data.prefixChangedAt");
      return message.reply(getLang("reset", global.GoatBot.config.prefix));
    }

    const newPrefix = args[0];
    const formSet = {
      commandName,
      author: event.senderID,
      newPrefix,
      setGlobal: args[1] === "-g"
    };

    if (formSet.setGlobal && role < 2) {
      return message.reply(getLang("onlyAdmin"));
    }

    const confirmMessage = formSet.setGlobal ? getLang("confirmGlobal") : getLang("confirmThisThread");
    return message.reply(confirmMessage, (err, info) => {
      if (err || !info) return;
      formSet.messageID = info.messageID;
      global.GoatBot.onReaction.set(info.messageID, formSet);
    });
  },

  onReaction: async function ({ message, threadsData, event, Reaction, getLang }) {
    const { author, newPrefix, setGlobal } = Reaction;
    if (event.userID !== author) return;

    if (setGlobal) {
      global.GoatBot.config.prefix = newPrefix;
      fs.writeFileSync(global.client.dirConfig, JSON.stringify(global.GoatBot.config, null, 2));
      return message.reply(getLang("successGlobal", newPrefix));
    }

    await threadsData.set(event.threadID, newPrefix, "data.prefix");
    await threadsData.set(event.threadID, event.userID, "data.prefixEditor");
    await threadsData.set(
      event.threadID,
      new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }),
      "data.prefixChangedAt"
    );

    return message.reply(getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, threadsData, getLang }) {
    const content = event.body?.toLowerCase()?.trim();
    if (content !== "prefix") return;

    const serverTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    const threadData = await threadsData.get(event.threadID);
    const prefix = utils.getPrefix(event.threadID);
    const editor = threadData?.data?.prefixEditor || "Unknown";
    const date = threadData?.data?.prefixChangedAt || "N/A";

    const infoMessage = getLang(
      "myPrefix",
      global.GoatBot.config.prefix,
      prefix,
      serverTime,
      editor,
      date
    );

    const randomVideoId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
    const videoURL = `https://drive.google.com/uc?export=download&id=${randomVideoId}`;
    const videoPath = path.join(__dirname, `prefix_video_${Date.now()}.mp4`);

    try {
      const response = await axios({
        method: "GET",
        url: videoURL,
        responseType: "stream"
      });

      const writer = fs.createWriteStream(videoPath);
      response.data.pipe(writer);

      writer.on("finish", () => {
        message.reply({
          body: infoMessage,
          attachment: fs.createReadStream(videoPath)
        });
      });

      writer.on("error", () => {
        message.reply(infoMessage + "\n⚠️ ভিডিও পাঠাতে সমস্যা হয়েছে।");
      });
    } catch (err) {
      console.error("Video download failed:", err);
      message.reply(infoMessage + "\n⚠️ ভিডিও ডাউনলোড করতে ব্যর্থ।");
    }
  }
};
