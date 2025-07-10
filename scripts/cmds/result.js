module.exports.config = {
  name: "result",
  version: "1.0.0",
  hasPermission: 0,
  credits: "BAYJID BOT", 
  description: "Check technical exam result",
  commandCategory: "utility",
  usages: "!result [roll] | [reg] | technical",
  cooldowns: 5
};

module.exports.run = async function ({ api, event, args }) {
  const axios = require("axios");

  const input = args.join(" ");
  if (!input.includes("|")) return api.sendMessage("❌ Format: !result [roll] | [reg] | technical", event.threadID, event.messageID);

  const [roll, reg, type] = input.split("|").map(item => item.trim());

  api.sendMessage("🔍 Checking result, please wait...", event.threadID, event.messageID);

  try {
    const res = await axios.get(`https://api.example.com/result?roll=${roll}&reg=${reg}&type=${type}`); // Dummy API
    const data = res.data;

    if (!data || !data.name) return api.sendMessage("❌ Result not found!", event.threadID, event.messageID);

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

    api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    api.sendMessage("❌ An error occurred while checking result.", event.threadID, event.messageID);
  }
};
