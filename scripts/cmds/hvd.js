module.exports = {
	config: {
		name: "hvd",
		aliases: ["hvdo"],
		version: "1.0",
		author: "RAHAD",
		countDown: 60,
		role: 0,
		shortDescription: "get hentai video",
		longDescription: "it will send hentai video",
		category: "𝟭𝟴+",
		guide: "{p}{n}hvdo",
	},

	sentVideos: [],

	onStart: async function ({ api, event, message }) {
		const senderID = event.senderID;

		// Send loading message
		const loadingMessage = await message.reply({
			body: "🔞 Loading random fuÇk v1d30... Please wait! upto 5min 🤡𝐑𝐀𝐇𝐀𝐃💦",
		});

		// Video links (Google Drive direct download format)
		const link = [
			"https://drive.google.com/uc?export=download&id=1-eEaxo31GJjD_pxY1XWwVbIbPpOYBCDA",
			"https://drive.google.com/uc?export=download&id=1-iPK9Ir1W1XC68gb8xBrdim79DcpIzzA"
		];

		let availableVideos = link.filter(video => !this.sentVideos.includes(video));

		if (availableVideos.length === 0) {
			this.sentVideos = [];
			availableVideos = link;
		}

		if (availableVideos.length === 0) {
			return message.reply("❌ No videos available. Please add more links.");
		}

		const randomVideo = availableVideos[Math.floor(Math.random() * availableVideos.length)];
		this.sentVideos.push(randomVideo);

		try {
			await message.reply({
				body: "💔 Lo tor to GF ar Bou nai... tai enjoy kor ekhon 🤡🍑",
				attachment: await global.utils.getStreamFromURL(randomVideo),
			});
		} catch (err) {
			await message.reply("⚠️ Failed to load the video. Link might be broken or removed.");
		}

		setTimeout(() => {
			if (loadingMessage?.messageID) {
				api.unsendMessage(loadingMessage.messageID);
			}
		}, 5000);
	},
};
