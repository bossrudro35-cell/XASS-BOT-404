
const profile = {
  projects: [
    // 🚀 Noobx Tools by ©BaYjid
    {
      name: 'Noobx TestGround',
      url: 'https://www.noobx.work.gd/explore',
      description: 'Playground for testing APIs and scripts.',
    },
    {
      name: 'Noobx Downloader',
      url: 'https://www.noobx.work.gd/downloader',
      description: 'Media downloader with clean UI.',
    },
    {
      name: 'Noobx Uploader',
      url: 'https://www.noobx.work.gd/uploader',
      description: 'Simple file uploader — no nonsense.',
    },
    {
      name: 'Noobx Weather',
      url: 'https://www.noobx.work.gd/weather',
      description: 'Real-time weather updates for your city.',
    },
    {
      name: 'Noobx Translator',
      url: 'https://www.noobx.work.gd/translator',
      description: 'Quick language translation tool powered by AI.',
    },

    // 📥 Noobs API Tools
    {
      name: 'YouTube Downloader',
      url: 'https://noobs-api.top/youtube?url=',
      description: 'Download YouTube videos with just a URL.',
    },
    {
      name: 'Facebook Video Downloader',
      url: 'https://noobs-api.top/facebook?url=',
      description: 'Grab Facebook videos by pasting a link.',
    },
    {
      name: 'TikTok Video Downloader',
      url: 'https://noobs-api.top/tiktok?url=',
      description: 'Download TikTok videos, no watermark.',
    },
    {
      name: 'Instagram Reel Downloader',
      url: 'https://noobs-api.top/instagram?url=',
      description: 'Download Instagram reels and stories.',
    },
    {
      name: 'Twitter Video Downloader',
      url: 'https://noobs-api.top/twitter?url=',
      description: 'Download Twitter/X videos.',
    },
    {
      name: 'Random Joke',
      url: 'https://noobs-api.top/joke',
      description: 'Get a random joke for a quick laugh.',
    },
    {
      name: 'Anime Quote',
      url: 'https://noobs-api.top/anime/quote',
      description: 'Pull inspiring anime quotes.',
    },
    {
      name: 'AI Chat',
      url: 'https://noobs-api.top/ai/chat?text=Hello',
      description: 'Chat with an AI bot using natural language.',
    },
    {
      name: 'Meme Generator',
      url: 'https://noobs-api.top/meme',
      description: 'Generate memes automatically.',
    },
    {
      name: 'QR Code Generator',
      url: 'https://noobs-api.top/qr?text=Hello',
      description: 'Create a QR code instantly.',
    },
    {
      name: 'Random Facts',
      url: 'https://noobs-api.top/fact',
      description: 'Learn a new random fact.',
    },
    {
      name: 'Noobs API Docs',
      url: 'https://noobs-api.top/docs',
      description: 'Browse the full Noobs API documentation.',
    },

    // 🧠 Mesbah API - AI & Tools
    {
      name: 'GPT-4o Chat',
      url: 'https://api.mesbah-saxx.is-best.net/api/ai/gpt4o',
      description: 'Chat with GPT-4o — OpenAI’s powerful model.',
    },
    {
      name: 'Niji Image Generator',
      url: 'https://api.mesbah-saxx.is-best.net/api/ai/niji',
      description: 'Generate anime-style images using Niji.',
    },
    {
      name: 'All-in-One Video Downloader',
      url: 'https://api.mesbah-saxx.is-best.net/api/media/alldl',
      description: 'Download from 700+ platforms (music/video).',
    },
    {
      name: 'Google Drive Video Downloader',
      url: 'https://api.mesbah-saxx.is-best.net/api/media/gdrive',
      description: 'Download videos/files from Google Drive.',
    },
    {
      name: 'Fancy Text Generator',
      url: 'https://api.mesbah-saxx.is-best.net/api/utility/font',
      description: 'Convert your text into cool Unicode styles.',
    },
    {
      name: 'Pinterest Image Search',
      url: 'https://api.mesbah-saxx.is-best.net/api/utility/pinterest',
      description: 'Search Pinterest for beautiful images.',
    },
    {
      name: 'Temp Mail Generator',
      url: 'https://api.mesbah-saxx.is-best.net/api/utility/tempmail/gen',
      description: 'Get temporary email for signups & verifications.',
    },
    {
      name: 'SIM Bot Teach Mode',
      url: 'https://api.mesbah-saxx.is-best.net/api/sim/teach',
      description: 'Teach question-answer pairs to the SIM bot.',
    },
  ],
};

module.exports.config = {
  name: "api",
  version: "6.9",
  author: "BaYjid",
  countDown: 5,
  role: 0,
  category: "info",
  description: "Get info about your projects",
  guide: {
    en: "Use {pn}project or {pn}project <number> to get project details",
  },
};

module.exports.onStart = async ({ api, event, message, args, prefix }) => {
  try {
    if (!args.length) {
      let reply = `📦 𝐘𝐨𝐮𝐫 𝐏𝐫𝐨𝐣𝐞𝐜𝐭𝐬 𝐋𝐢𝐬𝐭:\n\n`;
      profile.projects.forEach((project, i) => {
        reply += `🔹 ${i + 1}. ${project.name}\n`;
      });
      reply += `\n📌 Use "${prefix}api <number>" to get full info about that project.`;
      return api.sendMessage(reply, event.threadID, event.messageID);
    }

    const index = parseInt(args[0], 10) - 1;
    if (isNaN(index) || index < 0 || index >= profile.projects.length) {
      return api.sendMessage("❌ Invalid project number! Try again with a valid one.", event.threadID, event.messageID);
    }

    const project = profile.projects[index];
    const msg = `📁 𝗣𝗿𝗼𝗷𝗲𝗰𝘁: ${project.name}\n🔗 𝗨𝗥𝗟: ${project.url}\n📝 𝗗𝗲𝘀𝗰𝗿𝗶𝗽𝘁𝗶𝗼𝗻: ${project.description}\n\n🚀 Go explore it like a pro.`;
    return api.sendMessage(msg, event.threadID, event.messageID);
  } catch (err) {
    console.error(err);
    return api.sendMessage("⚠️ Error fetching project info. Try again later!", event.threadID, event.messageID);
  }
};