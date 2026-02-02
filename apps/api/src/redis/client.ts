import { createClient, RedisClientType } from "redis"

let redisClient: RedisClientType | null = null

export async function getRedisClient() {
  if (!redisClient) {
    redisClient = createClient({
      username: "default",
      password: process.env.REDIS_PASSWORD,
      socket: {
        host: process.env.REDIS_URL,
        port: Number(process.env.REDIS_PORT),
      },
    })

    redisClient.on("error", (err) => console.error("Redis Client Error", err))

    await redisClient.connect()
    console.log("Redis Connected")
  }

  return redisClient
}
