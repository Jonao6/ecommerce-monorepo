export const SLIDING_WINDOW_LUA = `
local key = KEYS[1]
local now = tonumber(ARGV[1])
local windowMs = tonumber(ARGV[2])
local maxReq = tonumber(ARGV[3])
local member = ARGV[4]
local windowStart = now - windowMs

redis.call('ZREMRANGEBYSCORE', key, 0, windowStart)

local count = tonumber(redis.call('ZCARD', key))

if (count + 1) > maxReq then
  local oldest = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
  local oldestScore = oldest[2] and tonumber(oldest[2]) or now
  local resetTime = oldestScore + windowMs
  return {0, count, resetTime}
end

redis.call('ZADD', key, now, member)

redis.call('PEXPIRE', key, windowMs + 2000)

local oldest2 = redis.call('ZRANGE', key, 0, 0, 'WITHSCORES')
local oldestScore2 = oldest2[2] and tonumber(oldest2[2]) or now
local resetTime2 = oldestScore2 + windowMs

return {1, count + 1, resetTime2}
`;
