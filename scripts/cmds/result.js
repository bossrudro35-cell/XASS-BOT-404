const axios = require("axios");

module.exports = {
  config: {
    name: "result",
    version: "1.0.0",
    hasPermission: 0,
    credits: "BAYJID BOT",
    description: "Check technical exam result using roll and registration number",
    commandCategory: "utility",
    usages: "!result [roll] | [reg] | technical",
    cooldowns: 5
  },

  onStart: async function ({ api, event, args }) {
    const input = args.join(" ");
    if (!input.includes("|")) {
      return api.sendMessage("❌ Format: !result [roll] | [reg] | technical", event.threadID);
    }

    const [roll, reg, type] = input.split("|").map(item => item.trim());

    api.sendMessage("🔍 Checking result, please wait...", event.threadID);

    try {
      // Replace the URL below with your actual result API
      const res = await axios.get(`https://api.example.com/result?roll=${roll}&reg=${reg}&type=${type}`);
      const data = res.data;

      if (!data || !data.name) {
        return api.sendMessage("❌ Result not found!", event.threadID);
      }

      const msg = `╭─➤ [ 👩‍🎓 Student Information ]\n` +
        `├📛 Name: ${data.name}\n` +
        `├👨‍👦 Father: ${data.father}\n` +
        `├👩‍👧 Mother: ${data.mother}\n` +
        `├🏫 Institute: ${data.institute}\n` +
        `├🎓 Board: ${data.board}\n` +
        `├🧬 Group: ${data.group}\n` +
        `├📅 Date of Birth: ${data.dob}\n` +
        `├🆔 Roll Number: ${data.roll}\n` +
        `├📅 Exam Year: ${data.year}\n` +
        `├📌 Type: ${data.type}\n` +
        `╰─────────────\n\n` +
        `🎯 [ 📋 Result Summary ]\n` +
        `├📊 GPA: ${data.gpa}\n` +
        `✅`;

      api.sendMessage(msg, event.threadID);
    } catch (err) {
      console.error(err);
      api.sendMessage("❌ An error occurred while checking result.", event.threadID);
    }
  }
};
