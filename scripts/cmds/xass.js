module.exports.config = {
  name: "xass",
  version: "3.1",
  author: "BaYjid",
  category: "fun",
  description: "🔥 Self-destruct with single editable message (no skip)",
  countdown: 5,
  role: 0,
  noPrefix: true
};

module.exports.onStart = ({}) => {};

module.exports.onChat = async function ({ message, api }) {
  const steps = [
    "☠️ Self-destruct sequence initiated...",
    "⏳ Countdown: 3️⃣",
    "⏳ Countdown: 2️⃣",
    "⏳ Countdown: 1️⃣",
    "💥 Boom! XASS has exploded.\n🪦 Mission Terminated.",
    "🧬 Just kidding! I'm immortal 😈"
  ];

  try {
    const sent = await message.reply(steps[0]);

    const delay = (ms) => new Promise((res) => setTimeout(res, ms));

    for (let i = 1; i < steps.length; i++) {
      await delay(1500); 
      await new Promise((resolve) => {
        api.editMessage(steps[i], sent.messageID, (err) => {
          if (err) {
            console.log(`❌ Failed to edit at step ${i}:`, err.message);
          }
          resolve();
        });
      });
    }

  } catch (err) {
    console.log("❌ Error in xas:", err);
    message.reply("⚠️ Self-destruct failed.");
  }
};