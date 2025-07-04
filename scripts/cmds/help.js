const fs = require("fs-extra");
const axios = require("axios");
const path = require("path");
const { getPrefix } = global.utils;
const { commands } = global.GoatBot;

// ✅ List of your 5 tutorial video IDs from Google Drive
const VIDEO_IDS = [
  "1-1iSV2SyuP3TEH8IVkLIGN0_MQ8cVYjm",   // Video 1
  "1-ubkubbvyNcMi4a1HDa0Zl0FtjK_Hbvx",   // Video 2
  "109DxLi5McmXlww8PwIxjE6FsBVLLbScl",   // Video 3
  "108v-RR4HKmg3x8csHphcgh-ZNo3M_Zo2",   // Video 4
  "1-vD0mv3wGnAM0rmztYQuzxB2by2EgCMX"    // Video 5
];

module.exports = {
  config: {
    name: "help",
    version: "1.34",
    author: "Rahad X Bayjid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 Show all commands + direct random guide video" },
    longDescription: { en: "📜 View categorized commands + get a tutorial video sent directly" },
    category: "ℹ️ Info",
    guide: { en: "{pn}help or {pn}help [command]" },
    priority: 1,
  },

  onStart: async function ({ message, event, role }) {
    const prefix = getPrefix(event.threadID);
    const args = event.body.trim().split(/\s+/);

    // 🔍 If user requests help for specific command
    if (args.length > 1) {
      const cmdName = args[1].toLowerCase();
      if (commands.has(cmdName)) {
        const cmd = commands.get(cmdName).config;
        return message.reply(
          `📌 Help for '${cmdName}':\n` +
          `📝 Description: ${cmd.shortDescription?.en || "No description"}\n` +
          `🛠️ Usage: ${cmd.guide?.en || "No usage guide"}\n` +
          `📁 Category: ${cmd.category || "Uncategorized"}`
        );
      } else {
        return message.reply(`❌ No such command: '${cmdName}'`);
      }
    }

    // 🎲 Randomly select a video from VIDEO_IDS
    const randId = VIDEO_IDS[Math.floor(Math.random() * VIDEO_IDS.length)];
    const videoUrl = `https://drive.google.com/uc?export=download&id=${randId}`;
    const videoPath = path.join(__dirname, "cache", `help_${randId}.mp4`);

    // 📚 Collect commands by category
    const categories = {};
    let total = 0;

    for (const [name, command] of commands) {
      const cfg = command.config;
      if (!cfg || cfg.role > role) continue;

      const category = cfg.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(name);
      total++;
    }

    // 📝 Format help text
    let helpText = `🦈 𝗕𝗢𝗧 𝗠𝗘𝗡𝗨\n`;
    for (const cat of Object.keys(categories).sort()) {
      helpText += `\n✦ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${cat.toUpperCase()}\n`;
      for (const cmd of categories[cat].sort()) {
        helpText += `  ⤷ ${cmd}\n`;
      }
    }
    helpText += `\n📘 Total Commands: ${total}`;
    helpText += `\n🛠️ Usage: ${prefix}help <command name>`;

    // 📥 Download video and send it directly (not as link)
    try {
      const res = await axios.get(videoUrl, { responseType: "arraybuffer" });
      fs.ensureDirSync(path.dirname(videoPath));
      fs.writeFileSync(videoPath, Buffer.from(res.data, "binary"));

      await message.reply({
        body: helpText,
        attachment: fs.createReadStream(videoPath)
      }, () => fs.unlinkSync(videoPath)); // Delete after sending
    } catch (err) {
      console.error("Video error:", err.message);
      return message.reply("❌ Couldn't load help video. Try again later.");
    }
  }
};
