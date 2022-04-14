const Redis = require("ioredis");

class RedisDB {
  constructor(_args) {
    if (_args) {
      this.redis = new Redis(..._args);
    } else {
      this.redis = new Redis();
    }

    this.redis.on("error", (err) => {
      console.error(err);
    });
  }

  async getDataRedis(_search) {
    return JSON.parse(await this.redis.get(_search));
  }

  async setDataRedis(_key, _send) {
    return await this.redis.set(_key, JSON.stringify(_send));
  }

  async setSessionRedis(_key, _send) {
    return await this.redis.set(_key, JSON.stringify(_send), "EX", 3600);
  }

  async deleteSessionRedis(_key) {
    return await this.redis.del(_key);
  }

  /* Specific Functions */

  saveNewDrawing(drawing) {
    if (drawing.lineWidth && drawing.x && drawing.y && drawing.color) {
      this.redis
        .lpush("drawing:line_width", drawing.lineWidth)
        .then((_lineResult) => {
          this.redis.lpush("drawing:x", drawing.x).then((_xResult) => {
            this.redis.lpush("drawing:y", drawing.y).then((_yResult) => {
              this.redis
                .lpush("drawing:color", drawing.color)
                .then((_color) => {});
            });
          });
        });
    } else {
      return false;
    }
  }

  saveBase64(image64) {
    this.redis.set("drawing:base64", image64);
  }

  async getBase64() {
    return await this.redis.get("drawing:base64");
  }

  async getAllDrawings() {
    const lineWidth = await this.redis.lrange("drawing:line_width", 0, -1);
    const x = await this.redis.lrange("drawing:x", 0, -1);
    const y = await this.redis.lrange("drawing:y", 0, -1);
    const color = await this.redis.lrange("drawing:color", 0, -1);

    return { lineWidth: lineWidth, x: x, y: y, color: color };
  }

  async clearAllDrawings() {
    await this.redis.del("drawing:line_width");
    await this.redis.del("drawing:x");
    await this.redis.del("drawing:y");
    await this.redis.del("drawing:color");
  }
}

module.exports = {
  RedisDB,
};
