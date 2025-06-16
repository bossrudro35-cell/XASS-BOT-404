module.exports.config = {
  name: "xass",
  version: 0.2,
  author: "BaYjid",
  category: "npx",
  description: "xass bot",
  countdown: 5,
  role: 0,
};

module.exports.onStart = ({}) => {};

module.exports.onChat = async ({ api, event, args }) => {
  try {
    const msg = (event.body || "").toLowerCase();

    if (msg === "xass" || msg === "bayjid") {
      const attachment = await global.utils.getStreamFromURL(
        "https://i.imgur.com/tCUHoib.jpeg",
        {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/117.0.0.0 Safari/537.36",
        }
      );

      api.sendMessage(
        {
          body: `┏━━━✦✗✦━━━┓
 𝐗𝐀𝐒𝐒 𝐁𝐎𝐓 𝐇𝐞𝐑𝐞  
┗━━━✦✗✦━━━┛
> Nickname: - BiJu•-🦈🕸️🫀
> Owner: -𝐗𝐀𝐒𝐒 - 𝐁𝐚𝐘𝐣𝐢𝐝•-🕷️🕸️🫀 (Etx)
> 𝐗𝐀𝐒𝐒 𝐁𝐎𝐓__/:;)🤍
🦈🫀`,
          attachment: attachment,
        },
        event.threadID,
        event.messageID
      );
    }
  } catch (err) {
    api.sendMessage(
      `Error: ${err.message}`,
      event.threadID,
      event.messageID
    );
  }
};
