module.exports.config = {
  name: "xass",
  version: 0.5,
  author: "BaYjid",
  category: "npx",
  description: "Xass bot fun mode 🤖",
  countdown: 3,
  role: 0,
  noPrefix: true
};

module.exports.onStart = ({}) => {};

module.exports.onChat = async function ({ event, message, api }) {
  const msg = event.body.toLowerCase();

  if (msg.includes("xass")) return message.reply("👑 Xass server active — bol ki lagbe boss?");
  if (msg.includes("bot")) return message.reply("🤖 Bot active. Smart, silent, dangerous!");
  if (msg.includes("hi") || msg.includes("hello")) return message.reply("👋 Oi salam/namaskar!");
  if (msg.includes("bye")) return message.reply("👋 Biday... abar fire asish!");
  if (msg.includes("valo aso") || msg.includes("kemon aso")) return message.reply("👌 Bot bhalo thake sobshomoy! Tui kemon?");
  if (msg.includes("love")) return message.reply("❤️ Bot love means Binary 0110 feelings!");
  if (msg.includes("bash")) return message.reply("🔥 Bash dia dilam! Vibe ase!");
  if (msg.includes("thanks") || msg.includes("thank you")) return message.reply("🙏 Don’t mention it. Xass er service 24/7!");
  if (msg.includes("help")) return message.reply("🆘 Bol ki dorkar? Command likh: /help");
  if (msg.includes("murgi")) return message.reply("🐔 Bok bok boss!");
  if (msg.includes("dim")) return message.reply("🥚 Dim ready. Khabi?");
  if (msg.includes("kha")) return message.reply("🍽️ Khawar dorkar nai... bot battery diya chole!");
  if (msg.includes("kichu bolo")) return message.reply("😶 Shanto thakis... Xass observe kortese!");
  if (msg.includes("ki khabi")) return message.reply("🍗 Broast, Dim & Murgi biryani!");
  if (msg.includes("murda")) return message.reply("💀 Murda toder idea hoye jabe... Xass immortal!");
  if (msg.includes("guli")) return message.reply("🔫 Guli cholche... dim urche!");
  if (msg.includes("ami valo na")) return message.reply("🥺 Valo thak... Xass roye gese!");
  if (msg.includes("na re") || msg.includes("na vai")) return message.reply("❌ Nai nai nai!");
  if (msg.includes("ha re") || msg.includes("ha vai")) return message.reply("✅ Ha re pagla!");
  if (msg.includes("joss") || msg.includes("awesome")) return message.reply("🚀 Xass level joss!");
  if (msg.includes("de") && msg.includes("dim")) return message.reply("🥚 Ekta dim diya dilam bhai!");
  if (msg.includes("mara") || msg.includes("death")) return message.reply("💣 Bok bok boom!");
  if (msg.includes("ghum")) return message.reply("😴 Bot ghumay na... tui ghum!");
  if (msg.includes("pagol")) return message.reply("🤪 Bot pagol holeo controlled!");
  if (msg.includes("ami ke")) return message.reply("🔍 Tui hoili boss, Xass'er bondhu!");
  if (msg.includes("kichu")) return message.reply("💭 Kichu kichu ekta hobe...");
  if (msg.includes("photo")) return message.reply("📸 Murgi'r selfie lagbe?");
  if (msg.includes("video")) return message.reply("🎥 Bot video pathate pare... but jhamela ase!");
  if (msg.includes("crash")) return message.reply("💥 System crash? Na boss, Xass er bot stable!");
  if (msg.includes("fire") || msg.includes("flame")) return message.reply("🔥🔥🔥 Fire e full vibe!");

  // Optional random fallback
  // if (Math.random() < 0.03) return message.reply("💡 Xass AI observe korse... interesting...");
};