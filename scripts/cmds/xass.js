module.exports.config = {
  name: "help2",
  version: "5.0",
  author: "Xass",
  description: "Command list by category or author",
  role: 0
};

module.exports.onStart = async function({ message, args }) {
  const fs = require("fs");
  const path = require("path");

  let filterType = null;
  let filterValue = null;

  
  if (args[0] === "-c" && args[1]) {
    filterType = "category";
    filterValue = args[1].toLowerCase();
  } else if (args[0] === "-a" && args[1]) {
    filterType = "author";
    filterValue = args[1].toLowerCase();
  }

  const files = fs.readdirSync(__dirname).filter(function(file) {
    return file.endsWith(".js") && file !== "help2.js";
  });

  let commands = [];

  for (let i = 0; i < files.length; i++) {
    const file = files[i];
    try {
      const cmd = require(`./${file}`);
      if (!cmd.config || !cmd.config.name) continue;

      const name = cmd.config.name;
      const description = cmd.config.description || "No description";
      const category = cmd.config.category || "Uncategorized";
      const author = cmd.config.author || "Unknown";

      
      if (filterType === "category" && category.toLowerCase() !== filterValue) continue;
      if (filterType === "author" && author.toLowerCase() !== filterValue) continue;

      commands.push(
        "🔹" + name + "\n" +
        "    └ 📖 " + description + "\n" +
        "    └ 🏷️ Category: " + category + " | 👤 Author: " + author
      );

    } catch (e) {
      commands.push("⚠️ " + file + " (Load error)");
    }
  }

  if (commands.length === 0) {
    return message.reply("❌ No commands found for " + (filterType || "all"));
  }

  const reply =
"╔════════════════╗\n" +
"     𝗫𝗔𝗦𝗦 𝗠𝗘𝗡𝗨\n" +
"╚════════════════╝\n\n" +
"📂 Filter: " + (filterType ? (filterType.toUpperCase() + " — " + filterValue) : "All Commands") + "\n" +
"🧩 Total: " + commands.length + " command" + (commands.length > 1 ? "s" : "") + "\n\n" +
commands.join("\n\n") + "\n\n" +
"━━━━━━━━━━━━━━━━━━\n" +
"🔍 Usage:\n" +
"• help2             → 𝐗𝐀𝐒𝐒 𝐁𝐎𝐓__/:;)🤍\n" +
"• help2 -c      →  info category\n" +
"• help2 -a bayjid   → only admin";

  message.reply(reply);
);

