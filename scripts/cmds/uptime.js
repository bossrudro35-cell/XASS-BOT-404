module.exports = {
  config: {
    name: "uptime",
    aliases: ["upt", "up"],
    version: "2.0",
    author: "BaYjid",
    role: 0,
    shortDescription: "🕒 Check bot uptime",
    longDescription: "⏳ Dekhun bot kotokkhon dhore online ache",
    category: "📊 System",
    guide: {
      en: "{pn} - shows how long the bot has been online"
    }
  },

  onStart: async function ({ message }) {
    const totalSeconds = process.uptime();
    const days = Math.floor(totalSeconds / 86400);
    const hours = Math.floor((totalSeconds % 86400) / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = Math.floor(totalSeconds % 60);

    const uptimeString = [
      days ? `${days}d` : null,
      hours ? `${hours}h` : null,
      minutes ? `${minutes}m` : null,
      seconds ? `${seconds}s` : null
    ].filter(Boolean).join(" ");

    const box = `
╭──[ 🤖 BOT UPTIME ]──╮
│ 🟢 Online: ${uptimeString.padStart(15, " ")} 
╰─────────────────╯
`;

    message.reply(box);
  }
};