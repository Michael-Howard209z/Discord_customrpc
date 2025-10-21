function getShard(client) {
  const shard = client.ws.shards.first();
  if (!shard || !shard.connection) throw new Error('Không thể lấy shard (websocket)');
  return shard;
}

module.exports = getShard;
