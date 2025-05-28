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
    const msg = event.body.toLowerCase();

    if (msg === "xass" || msg === "bayjid") {
      api.sendMessage(
        {
          body: 
`┏━━━✦✗✦━━━┓
 𝐗𝐀𝐒𝐒 𝐁𝐎𝐓 𝐇𝐞𝐑𝐞  
┗━━━✦✗✦━━━┛
> Nickname: - BiJu•-🦈🕸️🫀
> Owner: -𝐗𝐀𝐒𝐒 - 𝐁𝐚𝐘𝐣𝐢𝐝•-🕷️🕸️🫀 (Etx)
> 𝐗𝐀𝐒𝐒 𝐁𝐎𝐓__/:;)🤍
🦈🫀`,
          attachment: await global.utils.getStreamFromURL("http://160.191.129.54:5000/cdn/gTPVJrZLd.jpg"),
        },
        event.threadID,
        event.messageID
      );
    }
  } catch (err) {
    api.sendMessage(`Error: ${err.message}`, event.threadID, event.messageID);
  }
};
