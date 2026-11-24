import assert from 'node:assert/strict'
import { readdir, readFile } from 'node:fs/promises'
import { extname, join } from 'node:path'

const dist = new URL('../dist/', import.meta.url)
const rules = {
  'private key': /-----BEGIN (?:[A-Z]+ )?PRIVATE KEY-----/,
  'AWS access key': /\b(?:AKIA|ASIA)[A-Z0-9]{16}\b/,
  'GitHub token': /\b(?:gh[pousr]_[A-Za-z0-9]{30,}|github_pat_[A-Za-z0-9_]{40,})\b/,
  'service token': /\b(?:xox[baprs]-[\w-]{16,}|sk-(?:proj-)?[A-Za-z0-9_-]{32,}|AIza[A-Za-z0-9_-]{35}|\d{7,12}:[A-Za-z0-9_-]{30,})\b/,
  'credential literal': /(?:api[_-]?key|client[_-]?secret|password|bot[_-]?token)["']?\s*[:=]\s*["'][A-Za-z0-9_+/=-]{16,}["']/i,
  'email address': /\b[A-Z0-9._%+-]+@[A-Z0-9.-]+\.(?:com|org|net|edu|kr|jp|io|gov)\b/i,
  'Korean contact or ID number': /\b(?:01[016789][- .]\d{3,4}[- .]\d{4}|\d{6}-[1-8]\d{6})\b/,
  'internal network URL': /https?:\/\/(?:[\w.-]+\.(?:internal|corp|local)|(?:10\.\d{1,3}|192\.168|172\.(?:1[6-9]|2\d|3[01]))\.\d{1,3}\.\d{1,3})(?=[/:"'\s]|$)/i,
}

// Scanner errors identify the rule and artifact without echoing a sensitive value.
function findings(content) {
  return Object.entries(rules).filter(([, pattern]) => pattern.test(content)).map(([label]) => label)
}

assert.deepEqual(findings('configured by environment'), [])
assert.ok(findings(`api_key="${'A'.repeat(24)}"`).includes('credential literal'))
assert.ok(findings(`https://${['local-api', 'internal'].join('.')}/`).includes('internal network URL'))
assert.ok(findings('http://10.20.30.40:8080').includes('internal network URL'))

const files = await readdir(dist, { recursive: true, withFileTypes: true })
assert.ok(files.some((entry) => entry.isFile() && entry.name === 'index.html'), 'dist/index.html is missing')

const errors = []
let checked = 0
for (const entry of files) {
  if (entry.isDirectory()) continue
  const path = join(entry.parentPath, entry.name)
  if (!entry.isFile() || !['.html', '.js', '.css', '.txt'].includes(extname(entry.name))) {
    errors.push(`unexpected public file: ${entry.name}`)
    continue
  }
  for (const finding of findings(await readFile(path, 'utf8'))) {
    errors.push(`${entry.name}: ${finding}`)
  }
  checked += 1
}

if (errors.length) {
  console.error(errors.join('\n'))
  process.exitCode = 1
} else {
  console.log(`Public artifact scan passed (${checked} files).`)
}
