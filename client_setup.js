const { joinVoiceChannel } = require('@discordjs/voice');
const { VOICE_CHANNEL_ID, GIF_URL, SMALL_URL } = require('./config.js');
const getShard = require('./get_shard.js');
const buildPresencePayload = require('./build_presence_payload.js');

const startTime = Date.now();

function setupClient(client) {
  client.on('ready', async () => {
    console.log(`${client.user.username} đã đăng nhập`);

    if (VOICE_CHANNEL_ID) {
      try {
        const channel = await client.channels.fetch(VOICE_CHANNEL_ID);
        if (!channel || channel.type !== 'GUILD_VOICE') {
          console.error('ID kênh thoại không hợp lệ');
        } else {
          joinVoiceChannel({
            channelId: channel.id,
            guildId: channel.guild.id,
            adapterCreator: channel.guild.voiceAdapterCreator,
            selfDeaf: true,
            selfMute: true,
          });
          console.log(`Đã tham gia kênh thoại: ${channel.name}`);
        }
      } catch (e) {
        console.warn('Lỗi khi fetch kênh thoại:', e.message);
      }
    }

    try {
      const shard = getShard(client);
      const payload = await buildPresencePayload(client, GIF_URL, SMALL_URL, startTime);
      shard.connection.send(JSON.stringify(payload));
      console.log('Cập nhật trạng thái thành công');
    } catch (err) {
      console.error('Lỗi khi cập nhật trạng thái:', err);
    }

    setInterval(async () => {
      try {
        const shard = getShard(client);
        const payload = await buildPresencePayload(client, GIF_URL, SMALL_URL, startTime);
        shard.connection.send(JSON.stringify(payload));
      } catch (e) {
        console.warn('Lỗi khi gửi payload trạng thái:', e.message);
      } finally {
        if (global.gc) {
          global.gc();
        }
      }
    }, 60_000);
  });

  client.on('error', console.error);
}

module.exports = setupClient;
