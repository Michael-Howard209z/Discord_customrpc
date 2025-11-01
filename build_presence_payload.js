const {
  APPLICATION_ID,
  ACTIVITY_NAME,
  DETAILS,
  STATE,
  LARGE_TEXT,
  SMALL_TEXT,
  BUTTONS,
} = require('./config.js');

async function buildPresencePayload(client, largeUrl, smallUrl, startTime) {
  // Đăng hình ảnh (external-assets) để sử dụng làm large_image / small_image nếu có
  const res = await client.api.applications[APPLICATION_ID]['external-assets'].post({
    data: { urls: [largeUrl, smallUrl].filter(Boolean) },
  });

  const large = res[0]?.external_asset_path ? `mp:${res[0].external_asset_path}` : null;
  const small = res[1]?.external_asset_path ? `mp:${res[1].external_asset_path}` : null;

  const activity = {
    name: ACTIVITY_NAME,
    type: 3, // Còn 4, 5 là cái l gì đấy t cũng méo biết nữa hình như chơi game tự tìm hiểu đi!
    application_id: APPLICATION_ID,
    details: DETAILS,
    state: STATE,
    timestamps: { start: startTime },
    assets: {
      ...(large ? { large_image: large, large_text: LARGE_TEXT } : {}),
      ...(small ? { small_image: small, small_text: SMALL_TEXT } : {}),
    },
  };

  if (BUTTONS.length) {
    activity.buttons = BUTTONS.map(b => b.name).slice(0, 2);
    activity.metadata = { button_urls: BUTTONS.map(b => b.url).slice(0, 2) };
  }

  return {
    op: 3,
    d: {
      since: startTime,
      activities: [activity],
      status: 'dnd',
      afk: false,
    },
  };
}

module.exports = buildPresencePayload;
