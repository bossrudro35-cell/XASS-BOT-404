const { getTime } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
  config: {
    name: "welcome",
    version: "3.1",
    author: "BaYjid",
    category: "events"
  },

  langs: {
    en: {
      session1: "☀ Morning",
      session2: "⛅ Noon",
      session3: "🌆 Afternoon",
      session4: "🌙 Evening",
      welcomeMessage: "🌸 Malvina Bb'e 🌸\n\n🚀 Thank you for inviting me!\n⚡ Bot Prefix: %1\n🔎 Type %1help to see all commands.",
      multiple1: "🔹 You",
      multiple2: "🔹 You guys",
      defaultWelcomeMessage: "🎉『 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 』🎉\n\n💠 Hey {userName}!\n🔹 You just joined 『 {boxName} 』\n✨ Have a fantastic {session}!\n\n👤 Added by: {adderName}"
    }
  },

  onStart: async ({ threadsData, message, event, api, getLang }) => {
    if (event.logMessageType !== "log:subscribe") return;

    const { threadID, logMessageData, author } = event;
    const { addedParticipants } = logMessageData;
    const hours = getTime("HH");
    const prefix = global.utils.getPrefix(threadID);
    const botID = api.getCurrentUserID();
    const nickNameBot = global.GoatBot.config.nickNameBot;

    if (addedParticipants.some(user => user.userFbId === botID)) {
      if (nickNameBot) api.changeNickname(nickNameBot, threadID, botID);
      return message.send(getLang("welcomeMessage", prefix));
    }

    if (!global.temp.welcomeEvent[threadID])
      global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };

    global.temp.welcomeEvent[threadID].dataAddedParticipants.push(...addedParticipants);
    clearTimeout(global.temp.welcomeEvent[threadID].joinTimeout);

    global.temp.welcomeEvent[threadID].joinTimeout = setTimeout(async () => {
      const threadData = await threadsData.get(threadID);
      if (threadData.settings.sendWelcomeMessage === false) return;

      const dataAddedParticipants = global.temp.welcomeEvent[threadID].dataAddedParticipants;
      const bannedUsers = threadData.data.banned_ban || [];
      const threadName = threadData.threadName;

      let newMembers = [], mentions = [];
      let isMultiple = dataAddedParticipants.length > 1;

      for (const user of dataAddedParticipants) {
        if (bannedUsers.some(b => b.id === user.userFbId)) continue;
        newMembers.push(user.fullName);
        mentions.push({ tag: user.fullName, id: user.userFbId });
      }

      if (newMembers.length === 0) return;

      let adderName = "Someone";
      try {
        const adderInfo = await api.getUserInfo(author);
        adderName = adderInfo[author]?.name || "Someone";
        mentions.push({ tag: adderName, id: author });
      } catch (e) {
        console.error("[WELCOME] Error getting adder info:", e.message);
      }

      let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");

      welcomeMessage = welcomeMessage
        .replace(/\{userName\}|\{userNameTag\}/g, newMembers.join(", "))
        .replace(/\{boxName\}|\{threadName\}/g, threadName)
        .replace(/\{multiple\}/g, isMultiple ? getLang("multiple2") : getLang("multiple1"))
        .replace(/\{session\}/g,
          hours <= 10 ? getLang("session1") :
          hours <= 12 ? getLang("session2") :
          hours <= 18 ? getLang("session3") : getLang("session4"))
        .replace(/\{adderName\}/g, adderName);

      let form = {
        body: welcomeMessage,
        mentions
      };

      // ✅ If welcome video is set via `attachment_id`, include it
      if (threadData.data.welcomeVideoAttachmentID) {
        form.attachment = [{
          type: "video",
          payload: {
            attachment_id: threadData.data.welcomeVideoAttachmentID
          }
        }];
      }

      await message.send(form);
      delete global.temp.welcomeEvent[threadID];
    }, 1500);
  }
};
