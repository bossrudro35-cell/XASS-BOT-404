const axios = require("axios");

module.exports = {
  config: {
    name: "horny",
    aliases: ["hornyv", "hrn"],
    version: "1.0",
    author: "Rahad Ff",
    countDown: 30,
    role: 0,
    shortDescription: "Send horny video",
    longDescription: "Sends a random horny video (direct download, no link shown)",
    category: "fun",
    guide: "{p}horny"
  },

  sentVideos: [],

  onStart: async function ({ api, event, message }) {
    const loadingMessage = await message.reply("📤 Loading video...");

    const link = [
      "https://drive.google.com/uc?export=download&id=10Ys_2678cokQV4TeJtRAr9BVw309c1pv",
      "https://drive.google.com/uc?export=download&id=11YN3kaZ5rhc1ef3aDcGl7ArWscscxuP8",
      "https://drive.google.com/uc?export=download&id=11Up7cQitEn8lQJc3PNtqAMssAAE7uKIV",
      "https://drive.google.com/uc?export=download&id=11T2M6nXssbp_kD1-BseotqUFfQI2XARV",
      "https://drive.google.com/uc?export=download&id=11HDm2n6hGxDi3H5AhW-54dlxjCD-exWk",
      "https://drive.google.com/uc?export=download&id=11Cf0TO__kR5KYA2LtHZwRWDUHPB2dKKR",
      "https://drive.google.com/uc?export=download&id=11BhK9Xj0plnPJOPi4kaYd-WBPV-xzhMs",
      "https://drive.google.com/uc?export=download&id=110aaSe1lXuNc04tO2xtLqwX2JSz4OA3G",
      "https://drive.google.com/uc?export=download&id=10um0URusP-8n_77ZaycjMk0-BVmC9gZb",
      "https://drive.google.com/uc?export=download&id=10tybVZkOclJXo7QLc0yFChRgWZe6_NOx",
      "https://drive.google.com/uc?export=download&id=10gcdekElRssGZGKqFYGMC45lcZZBRXtR"
    ];

    const availableVideos = link.filter(video => !this.sentVideos.includes(video));

    if (availableVideos.length === 0) {
      this.sentVideos = [];
      availableVideos.push(...link);
    }

    const randomIndex = Math.floor(Math.random() * availableVideos.length);
    const randomVideo = availableVideos[randomIndex];
    this.sentVideos.push(randomVideo);

    try {
      await message.reply({
        body: "💦 Here's your video!",
        attachment: await global.utils.getStreamFromURL(randomVideo)
      });
    } catch (err) {
      await message.reply("❌ Failed to load video.");
    }

    setTimeout(() => {
      api.unsendMessage(loadingMessage.messageID);
    }, 3000);
  }
};
