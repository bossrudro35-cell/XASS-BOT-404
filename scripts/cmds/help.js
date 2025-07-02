const { getPrefix } = global.utils;
const { commands, aliases } = global.GoatBot;

module.exports = {
  config: Object.freeze({
    name: "help",
    version: "1.20",
    author: "BaYjid",
    countDown: 5,
    role: 0,
    shortDescription: { en: "📖 View command usage" },
    longDescription: { en: "📜 View command usage and list all commands directly" },
    category: "ℹ️ Info",
    guide: { en: "🔹 {pn} / help cmdName" },
    priority: 1,
  }),

  onStart: async function ({ message, args, event, role }) {
    const { threadID } = event;
    const prefix = getPrefix(threadID);
    let filterAuthor = null;
    let filterCategory = null;

    if (args[0] === "-a" && args[1]) {
      filterAuthor = args.slice(1).join(" ").toLowerCase();
    } else if (args[0] === "-c" && args[1]) {
      filterCategory = args.slice(1).join(" ").toLowerCase();
    } else if (args.length > 0 && !args[0].startsWith("-")) {
      const commandName = args[0].toLowerCase();
      const command = commands.get(commandName) || commands.get(aliases.get(commandName));
      if (!command) return message.reply(`❌ 𝗖𝗼𝗺𝗺𝗮𝗻𝗱 "${commandName}" 𝗻𝗼𝘁 𝗳𝗼𝘂𝗻𝗱.`);

      const configCommand = command.config;
      const roleText = roleTextToString(configCommand.role);
      const usage = (configCommand.guide?.en || "No guide available.")
        .replace(/{pn}/g, prefix)
        .replace(/{n}/g, configCommand.name);

      return message.reply(
`╔═━「 🦋 𝗖𝗢𝗠𝗠𝗔𝗡𝗗 𝗗𝗘𝗧𝗔𝗜𝗟𝗦 」━═╗
🧸 𝗡𝗮𝗺𝗲: ${configCommand.name}
📜 𝗗𝗲𝘀𝗰: ${configCommand.longDescription?.en || "No description"}
🔁 𝗔𝗹𝗶𝗮𝘀𝗲𝘀: ${configCommand.aliases?.join(", ") || "None"}
📦 𝗩𝗲𝗿𝘀𝗶𝗼𝗻: ${configCommand.version || "1.0"}
🛡️ 𝗥𝗼𝗹𝗲: ${roleText}
⏳ 𝗖𝗼𝗼𝗹𝗱𝗼𝘄𝗻: ${configCommand.countDown || 1}s
👑 𝗔𝘂𝘁𝗵𝗼𝗿: ${configCommand.author || "Unknown"}
📘 𝗨𝘀𝗮𝗴𝗲: ${usage}
╚════════════════════╝`
      );
    }

    // If no specific command requested, list all
    const categories = {};
    let total = 0;

    for (const [name, value] of commands) {
      const config = value.config;
      if (config.role > 1 && role < config.role) continue;
      if (filterAuthor && (config.author?.toLowerCase() !== filterAuthor)) continue;
      if (filterCategory && (config.category?.toLowerCase() !== filterCategory)) continue;

      const category = config.category || "Uncategorized";
      if (!categories[category]) categories[category] = [];
      categories[category].push(name);
      total++;
    }

    if (total === 0) {
      const filterMsg = filterAuthor ? `author "${filterAuthor}"` : `category "${filterCategory}"`;
      return message.reply(`🚫 𝗡𝗼 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀 𝗳𝗼𝘂𝗻𝗱 𝗳𝗼𝗿 ${filterMsg}.`);
    }

    let msg = `🌸 𝗠𝗔𝗟𝗩𝗜𝗡𝗔 𝗕𝗢𝗧 𝗠𝗘𝗡𝗨 🌸\n`;

    Object.keys(categories).sort().forEach(category => {
      msg += `\n🕷️ 𝗖𝗮𝘁𝗲𝗴𝗼𝗿𝘆: ${category.toUpperCase()}\n`;
      categories[category].sort().forEach(cmd => {
        msg +=  ⤷ 🎟️ 𝗖𝗺𝗱: \${cmd}\\n;
      });
    });

    msg += \n🌐 𝗧𝗼𝘁𝗮𝗹 𝗖𝗼𝗺𝗺𝗮𝗻𝗱𝘀: ${total};
    msg += \n🔍 𝗧𝗶𝗽: \${prefix}help <command>\ 𝗳𝗼𝗿 𝗱𝗲𝘁𝗮𝗶𝗹𝘀;

    await message.reply(msg);
  },
};

function roleTextToString(role) {
  switch (role) {
    case 0: return "🌍 𝗔𝗹𝗹 𝗨𝘀𝗲𝗿𝘀";
    case 1: return "👑 𝗚𝗿𝗼𝘂𝗽 𝗔𝗱𝗺𝗶𝗻𝘀";
    case 2: return "🤖 𝗕𝗼𝘁 𝗔𝗱𝗺𝗶𝗻𝘀";
    default: return "❓ 𝗨𝗻𝗸𝗻𝗼𝘄𝗻";
  }
}