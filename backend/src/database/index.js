const Redis = require("ioredis");

const redisClient = new Redis();

redisClient.on("error", (err) => {
  console.log(err);
});

async function getDataRedis(_search) {
  return JSON.parse(await redisClient.get(_search));
}

async function setDataRedis(_key, _send) {
  return await redisClient.set(_key, JSON.stringify(_send));
}

async function setSessionRedis(_key, _send) {
  return await redisClient.set(_key, JSON.stringify(_send), "EX", 3600);
}

async function deleteSessionRedis(_key) {
  return await redisClient.del(_key);
}

module.exports = {
  redisClient,
  getDataRedis,
  setDataRedis,
  setSessionRedis,
  deleteSessionRedis,
};
