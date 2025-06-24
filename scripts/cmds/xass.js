const fs = require("fs");
const path = require("path");

module.exports.config = {
  name: "help2",
  version: "5.0",
  author: "BaYjid",
  description: "",
  role: 0
};

module.exports.onStart = async function ({ message, args }) {
  let filterType = null;
  let filterValue = null;

  if (args[0] === "-c" && args[1]) {
    filterType = "category";
    filterValue = args[1].toLowerCase();
  } else if (args[0] === "-a" && args[1]) {
    filterType = "author";
    filterValue = args[1].toLowerCase();
  }

  const files = fs.readdirSync(__dirname).filter(file =>
    file.endsWith(".js") && file !== "help2.js"
  );

  const commands = [];

  for (const file of files) {
    try {
      const cmd = require(path.join(__dirname, file));
      if (!cmd.config || !cmd.config.name) continue;

      const name = cmd.config.name;
      const desc = cmd.config.description || "No description.";
      const category = cmd.config.category || "Uncategorized";
      const author = cmd.config.author || "Unknown";

      if (filterType === "category" && category.toLowerCase() !== filterValue) continue;
      if (filterType === "author" && author.toLowerCase() !== filterValue) continue;

      const block =
        "┌────────────────┐\n" +
        `│ 🔹 Name    : ${name}\n` +
        `│ 📖 Desc    : ${desc}\n` +
        `│ 🏷️ Category : ${category}\n` +
        `│ 👤 Author  : ${author}\n` +
        "└────────────────┘";

      commands.push(block);

    } catch (err) {
      // Silently ignore broken command files
    }
  }

  if (commands.length === 0) {
    return message.reply("❌ No commands found.");
  }

  const header =
    "╔═══════════════╗\n" +
    "    𝗫𝗔𝗦𝗦  𝗠𝗘𝗡𝗨\n" +
    "╚═══════════════╝";

  const info =
    `📂 Filter : ${filterType ? `${filterType.toUpperCase()} — ${filterValue}` : "All Commands"}\n` +
    `📦 Total  : ${commands.length} command${commands.length > 1 ? "s" : ""}\n`;

  const result = `${header}\n\n${info}\n${commands.join("\n\n")}\n\n🧠 Bot by: 𝗫𝗔𝗦𝗦`;

  return message.reply(result.slice(0, 3999)); // safe limit for Facebook messages
};