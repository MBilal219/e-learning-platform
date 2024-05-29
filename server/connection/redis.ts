// redis db connection and will work when caching ---> working with database and data retrival etc
import { Redis } from "ioredis";

require("dotenv").config();

const redisClient = () => {
  if (process.env.REDIS_URL) {
    console.log("Redis connected");
    return process.env.REDIS_URL;
  }
  throw new Error("Redis connection failed");
};

export const redis = new Redis(redisClient());
