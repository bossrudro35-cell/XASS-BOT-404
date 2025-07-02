const fs = require("fs-extra");
const { utils } = global;

const BAJYID_ID = "100005193854879";

module.exports = {
  config: {
    name: "prefix",
    version: "2.0",
    author: "BaYjid",
    countDown: 5,
    role: 0,
    description: "🛠️ Change the bot prefix in your chat or globally (admin only)",
    category: "⚙️ Configuration",
    guide: {
      en:
        "╔═[ 🌸 𝐌𝐚𝐥𝐯𝐢𝐧𝐚 𝐁𝐛'𝐞 🌸 PREFIX HELP ]═╗\n" +
        "📌 {pn} <new prefix>: Change group prefix\n" +
        "📌 {pn} <new prefix> -g: Change global prefix (admin only)\n" +
        "🛠️ {pn} reset: Reset group prefix to default\n" +
        "🕹️ Type \"prefix\" to see current prefix info\n" +
        "╚════════════════════════════╝"
    }
  },

  langs: {
    en: {
      reset: "✅ Group prefix has been reset to default: %1",
      onlyAdmin: "⚠️ Only bot admins can change the global prefix!",
      onlyAuthor: "⛔️ Sorry, only 🌸 𝐌𝐚𝐥𝐯𝐢𝐧𝐚 𝐁𝐛'𝐞 🌸 can change the prefix!",
      confirmGlobal: "🛡️ React to confirm changing the 𝐆𝐋𝐎𝐁𝐀𝐋 prefix.",
      confirmThisThread: "💬 React to confirm changing the 𝐆𝐑𝐎𝐔𝐏 prefix.",
      successGlobal: "✅ Global prefix updated to: %1",
      successThisThread: "✅ Group prefix updated to: %1",
      myPrefix:
        "╔═[  🌸 𝐌𝐚𝐥𝐯𝐢𝐧𝐚 𝐁𝐛'𝐞 🌸 ]═╗\n" +
        "🌐 𝐆𝐥𝐨𝐛𝐚𝐥 𝐏𝐫𝐞𝐟𝐢𝐱: %1\n" +
        "💬 𝐆𝐫𝐨𝐮𝐩 𝐏𝐫𝐞𝐟𝐢𝐱: %2\n" +
        "⏰ 𝐓𝐢𝐦𝐞: %3\n" +
        "╚════════════╝"
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
    await threadsData.set(event.threadID, new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" }), "data.prefixChangedAt");

    return message.reply(getLang("successThisThread", newPrefix));
  },

  onChat: async function ({ event, message, threadsData, getLang }) {
    const content = event.body?.toLowerCase()?.trim();
    if (content !== "prefix") return;

    const serverTime = new Date().toLocaleString("en-US", { timeZone: "Asia/Dhaka" });
    const prefix = utils.getPrefix(event.threadID);

    return message.reply(getLang(
      "myPrefix",
      global.GoatBot.config.prefix,
      prefix,
      serverTime
    ));
  }
};