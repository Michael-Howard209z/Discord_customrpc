const { Client } = require('discord.js-selfbot-v13');
const { TOKEN } = require('./config.js');
const setupClient = require('./client_setup.js');

const client = new Client({ checkUpdate: false });

setupClient(client);

client.login(TOKEN);
