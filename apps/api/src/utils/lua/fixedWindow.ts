export const FIXED_WINDOW_LUA = `
local key = KEYS[1]
local windowMs = tonumber(ARGV[1])
local maxReq = tonumber(ARGV[2])

local current = tonumber(redis.call('INCR', key))

if current == 1 then
  redis.call('PEXPIRE', key, windowMs)
end

if current > maxReq then
  local pttl = tonumber(redis.call('PTTL', key))
  local resetTime = tonumber(ARGV[3]) + pttl
  return {0, current, resetTime, pttl}
end

local pttl2 = tonumber(redis.call('PTTL', key))
local resetTime2 = tonumber(ARGV[3]) + pttl2
return {1, current, resetTime2, pttl2}
`;
