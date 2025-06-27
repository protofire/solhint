const fs = require('fs-extra')
const crypto = require('crypto')
const path = require('path')

function getFileHash(content) {
  return crypto.createHash('sha1').update(content).digest('hex')
}

function normalizePath(filePath) {
  return path.relative(process.cwd(), filePath).replace(/\\/g, '/')
}

function getCacheKey(filePath, config) {
  const fileKey = normalizePath(filePath)
  const configHash = getFileHash(JSON.stringify(config.rules || {}))
  return `${fileKey}::${configHash}`
}

function readCache(cachePath) {
  try {
    return JSON.parse(fs.readFileSync(cachePath, 'utf8'))
  } catch (_) {
    return {}
  }
}

function writeCache(cachePath, cacheData) {
  fs.writeFileSync(cachePath, JSON.stringify(cacheData, null, 2))
}

function shouldLint(filePath, content, config, cacheData) {
  const key = getCacheKey(filePath, config)
  const hash = getFileHash(content)
  return cacheData[key] !== hash
}

function updateCacheEntry(filePath, content, config, cacheData) {
  const key = getCacheKey(filePath, config)
  cacheData[key] = getFileHash(content)
}

module.exports = {
  getFileHash,
  readCache,
  writeCache,
  shouldLint,
  updateCacheEntry,
}
