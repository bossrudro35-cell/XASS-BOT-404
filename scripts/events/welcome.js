const fs = require('fs-extra');
const path = require('path');
const moment = require('moment-timezone');
const { createCanvas, loadImage, registerFont } = require('canvas');

// Register a font
registerFont(path.join(__dirname, 'fonts', 'Poppins-Bold.ttf'), { family: 'Poppins' });

module.exports = {
  config: {
    name: 'welcome',
    version: '2.0',
    credits: 'Devil + GPT',
    description: 'Stylish dynamic welcome card with profile, group name, member count, time',
    commandCategory: 'group',
    cooldowns: 2
  },

  onJoin: async ({ api, event }) => {
    const { threadID, senderID } = event;
    const [threadInfo, userInfo] = await Promise.all([
      api.getThreadInfo(threadID),
      api.getUserInfo(senderID)
    ]);

    const groupName = threadInfo.threadName;
    const memberCount = threadInfo.participantIDs.length;
    const userName = userInfo[senderID].name || 'New Member';
    const timeStr = moment.tz('Asia/Dhaka').format('hh:mm:ss A - DD/MM/YYYY - dddd');

    // Canvas size
    const width = 800, height = 450;
    const canvas = createCanvas(width, height);
    const ctx = canvas.getContext('2d');

    // Draw background
    const bg = await loadImage(path.join(__dirname, 'backgrounds', 'style2.jpg'));
    ctx.drawImage(bg, 0, 0, width, height);

    // Draw circular avatar
    const avatarBuffer = await api.getUserAvatar(senderID);
    const avatar = await loadImage(avatarBuffer);
    const size = 140, x = (width - size) / 2, y = 40;
    ctx.save();
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.closePath();
    ctx.clip();
    ctx.drawImage(avatar, x, y, size, size);
    ctx.restore();
    ctx.strokeStyle = '#FFF';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.arc(x + size/2, y + size/2, size/2, 0, Math.PI * 2);
    ctx.stroke();

    // Text
    ctx.fillStyle = '#FFFFFF';
    ctx.textAlign = 'center';
    ctx.font = 'bold 36px Poppins';
    ctx.fillText(`𖤍『 ${userName} 』𖤍`, width/2, y + size + 50);
    ctx.font = 'bold 28px Poppins';
    ctx.fillText(`Welcome to 💥${groupName}💥`, width/2, y + size + 100);
    ctx.font = '24px Poppins';
    ctx.fillText(`You are the ${memberCount}th member of this group`, width/2, y + size + 140);
    ctx.font = '20px Poppins';
    ctx.fillText(timeStr, width/2, y + size + 180);

    // Save image & send
    const imgPath = path.join(__dirname, 'cache', `${senderID}_welcome.png`);
    const out = fs.createWriteStream(imgPath);
    const stream = canvas.createPNGStream();
    stream.pipe(out);
    await new Promise(resolve => out.on('finish', resolve));

    return api.sendMessage({
      body: `Hello 𖤍『 ${userName} 』𖤍\n\nWelcome to 💥${groupName}💥\nYou're the ${memberCount}th member in this group. Please enjoy!\n\n━━━━━━━━━━━━━━━\n🕒 ${timeStr}`,
      mentions: [{ tag: userName, id: senderID }],
      attachment: fs.createReadStream(imgPath)
    }, threadID);
  }
};
