export const TOKEN_BUCKET_LUA = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local requested = tonumber(ARGV[3])
local now = tonumber(ARGV[4])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill')
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])

if tokens == nil then
  tokens = capacity
  lastRefill = now
end

local elapsed = now - lastRefill
local refillAmount = math.floor((elapsed / 1000) * refillRate)
tokens = math.min(capacity, tokens + refillAmount)

if refillAmount > 0 or tokens == capacity then
  lastRefill = now
end

local allowed = 0
local remaining = tokens

if tokens >= requested then
  tokens = tokens - requested
  allowed = 1
  remaining = tokens
end

redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', lastRefill)
redis.call('EXPIRE', key, math.ceil(capacity / refillRate) + 10)

local retryAfter = 0
if allowed == 0 and refillRate > 0 then
  retryAfter = math.ceil((1 / refillRate) * 1000)
end

local resetTime = now + math.ceil((capacity - tokens) / refillRate * 1000)

return {allowed, remaining, capacity, resetTime, retryAfter}
`;

export const TOKEN_BUCKET_BURST_LUA = `
local key = KEYS[1]
local capacity = tonumber(ARGV[1])
local refillRate = tonumber(ARGV[2])
local requested = tonumber(ARGV[3])
local now = tonumber(ARGV[4])
local burstCapacity = tonumber(ARGV[5])

local bucket = redis.call('HMGET', key, 'tokens', 'lastRefill', 'burstTokens')
local tokens = tonumber(bucket[1])
local lastRefill = tonumber(bucket[2])
local burstTokens = tonumber(bucket[3])

if tokens == nil then
  tokens = capacity
  burstTokens = burstCapacity
  lastRefill = now
end

if burstTokens == nil then
  burstTokens = burstCapacity
end

local elapsed = now - lastRefill
local refillAmount = math.floor((elapsed / 1000) * refillRate)
tokens = math.min(capacity, tokens + refillAmount)

burstTokens = math.min(burstCapacity, burstTokens + math.floor((elapsed / 1000) * refillRate * 0.1))

if refillAmount > 0 or tokens == capacity then
  lastRefill = now
end

local allowed = 0
local remaining = tokens

local toConsume = requested
if burstTokens >= toConsume then
  burstTokens = burstTokens - toConsume
  allowed = 1
  remaining = tokens
else
  toConsume = toConsume - burstTokens
  if tokens >= toConsume then
    tokens = tokens - toConsume
    allowed = 1
    remaining = tokens
  end
end

redis.call('HMSET', key, 'tokens', tokens, 'lastRefill', lastRefill, 'burstTokens', burstTokens)
redis.call('EXPIRE', key, math.ceil(capacity / refillRate) + 10)

local retryAfter = 0
if allowed == 0 and refillRate > 0 then
  retryAfter = math.ceil((1 / refillRate) * 1000)
end

local resetTime = now + math.ceil((capacity - tokens) / refillRate * 1000)

return {allowed, remaining, capacity, resetTime, retryAfter, burstTokens}
`;