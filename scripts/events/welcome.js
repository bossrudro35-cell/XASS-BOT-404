const { getTime, drive } = global.utils;

if (!global.temp.welcomeEvent) global.temp.welcomeEvent = {};

module.exports = {
	config: {
		name: "welcome",
		version: "2.1",
		author: "BaYjid",
		category: "events"
	},

	langs: {
		en: {
			session1: "☀ 𝓜𝓸𝓻𝓷𝓲𝓷𝓰",
			session2: "⛅ 𝓝𝓸𝓸𝓷",
			session3: "🌆 𝓐𝓯𝓽𝓮𝓻𝓷𝓸𝓸𝓷",
			session4: "🌙 𝓔𝓿𝓮𝓷𝓲𝓷𝓰",
			welcomeMessage: "-`ღ´🦋𝗠𝗲𝗹𝗶𝘀𝗮🍒🥂\n\n🚀 𝗧𝗵𝗮𝗻𝗸 𝘆𝗼𝘂 𝗳𝗼𝗿 𝗶𝗻𝘃𝗶𝘁𝗶𝗻𝗴 𝗺𝗲!\n⚡ 𝗕𝗼𝘁 𝗣𝗿𝗲𝗳𝗶𝘅: %1\n🔎 𝗧𝗼 𝗰𝗵𝗲𝗰𝗸 𝗮𝗹𝗹 𝗰𝗼𝗺𝗺𝗮𝗻𝗱𝘀, 𝘁𝘆𝗽𝗲: %1help\n\n✨ 𝗛𝗮𝘃𝗲 𝗮 𝗴𝗿𝗲𝗮𝘁 𝘁𝗶𝗺𝗲! ✨",
			multiple1: "🔹 𝖸𝗈𝗎",
			multiple2: "🔹 𝖸𝗈𝗎 𝖦𝗎𝗒𝗌",
			defaultWelcomeMessage: "🎉 『 𝗪𝗘𝗟𝗖𝗢𝗠𝗘 』 🎉\n\n💠 𝗛𝗲𝘆 {userName}!\n🔹 𝗬𝗼𝘂 𝗷𝘂𝘀𝘁 𝗷𝗼𝗶𝗻𝗲𝗱 『 {boxName} 』\n⏳ 𝗧𝗶𝗺𝗲 𝗳𝗼𝗿 𝘀𝗼𝗺𝗲 𝗳𝘂𝗻! 𝗛𝗮𝘃𝗲 𝗮 𝗳𝗮𝗻𝘁𝗮𝘀𝘁𝗶𝗰 {session} 🎊\n\n⚠ 𝗣𝗹𝗲𝗮𝘀𝗲 𝗳𝗼𝗹𝗹𝗼𝘄 𝗮𝗹𝗹 𝗴𝗿𝗼𝘂𝗽 𝗿𝘂𝗹𝗲𝘀! 🚀\n\n👤 𝗔𝗱𝗱𝗲𝗱 𝗯𝘆: {adderName}"
		}
	},

	onStart: async ({ threadsData, message, event, api, getLang }) => {
		if (event.logMessageType !== "log:subscribe") return;

		const { threadID, logMessageData } = event;
		const { addedParticipants } = logMessageData;
		const hours = getTime("HH");
		const prefix = global.utils.getPrefix(threadID);
		const nickNameBot = global.GoatBot.config.nickNameBot;

		if (addedParticipants.some(user => user.userFbId === api.getCurrentUserID())) {
			if (nickNameBot) api.changeNickname(nickNameBot, threadID, api.getCurrentUserID());
			return message.send(getLang("welcomeMessage", prefix));
		}

		if (!global.temp.welcomeEvent[threadID]) {
			global.temp.welcomeEvent[threadID] = { joinTimeout: null, dataAddedParticipants: [] };
		}

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
				if (bannedUsers.some(banned => banned.id === user.userFbId)) continue;
				newMembers.push(user.fullName);
				mentions.push({ tag: user.fullName, id: user.userFbId });
			}

			if (newMembers.length === 0) return;

			const adderID = event.author;
			const adderInfo = await api.getUserInfo(adderID);
			const adderName = adderInfo[adderID]?.name || "Someone";
			mentions.push({ tag: adderName, id: adderID });

			let welcomeMessage = threadData.data.welcomeMessage || getLang("defaultWelcomeMessage");

			welcomeMessage = welcomeMessage
				.replace(/\{userName\}|\{userNameTag\}/g, newMembers.join(", "))
				.replace(/\{boxName\}|\{threadName\}/g, threadName)
				.replace(/\{multiple\}/g, isMultiple ? getLang("multiple2") : getLang("multiple1"))
				.replace(/\{session\}/g,
					hours <= 10 ? getLang("session1") :
					hours <= 12 ? getLang("session2") :
					hours <= 18 ? getLang("session3") : getLang("session4")
				)
				.replace(/\{adderName\}/g, adderName);

			let form = {
				body: welcomeMessage,
				mentions: mentions
			};

			// 🔥 Hardcoded welcome video
			const hardcodedFileId = "1-RV0_mJS0vAZpvO6IDK3f5eJuLIE3jhm";
			try {
				const stream = await drive.getFile(hardcodedFileId, "stream");
				if (stream) {
					form.attachment = [stream];
				}
			} catch (err) {
				console.error("❌ Failed to load welcome video:", err.message);
			}

			message.send(form);
			delete global.temp.welcomeEvent[threadID];
		}, 1500);
	}
};
