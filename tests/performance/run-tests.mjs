/**
 * JD TechStores — Performance Test Suite
 * Covers: Baseline, Load, Spike, Stress, and Soak tests
 * Run: node tests/performance/run-tests.mjs
 */

import { readFileSync } from 'fs'
import { resolve, dirname } from 'path'
import { fileURLToPath } from 'url'

const __dir = dirname(fileURLToPath(import.meta.url))

// ── Read credentials from .env ──────────────────────────────────────────────
function loadEnv() {
  const envPath = resolve(__dir, '../../.env')
  const raw = readFileSync(envPath, 'utf8')
  const env = {}
  for (const line of raw.split('\n')) {
    const [k, ...v] = line.split('=')
    if (k && !k.startsWith('#')) env[k.trim()] = v.join('=').trim()
  }
  return env
}

const env = loadEnv()
const BASE = env.VITE_SUPABASE_URL
const KEY  = env.VITE_SUPABASE_ANON_KEY

if (!BASE || BASE.includes('your-project') || !KEY) {
  console.error('❌  Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env first.')
  process.exit(1)
}

const HEADERS = { apikey: KEY, Authorization: `Bearer ${KEY}`, 'Content-Type': 'application/json' }

// Endpoints to test
const ENDPOINTS = [
  { name: 'Products page 1',  url: `${BASE}/rest/v1/products?select=*&is_active=eq.true&order=created_at.desc&limit=12&offset=0` },
  { name: 'Products page 2',  url: `${BASE}/rest/v1/products?select=*&is_active=eq.true&order=created_at.desc&limit=12&offset=12` },
  { name: 'Categories',       url: `${BASE}/rest/v1/categories?select=*&order=name` },
  { name: 'Search query',     url: `${BASE}/rest/v1/products?select=*&is_active=eq.true&name=ilike.*gaming*&limit=12` },
]

// ── Helpers ──────────────────────────────────────────────────────────────────
const sleep = ms => new Promise(r => setTimeout(r, ms))
const now   = () => performance.now()

async function hit(url) {
  const t = now()
  try {
    const res = await fetch(url, { headers: HEADERS })
    const ms  = Math.round(now() - t)
    return { ok: res.ok, status: res.status, ms }
  } catch (e) {
    return { ok: false, status: 0, ms: Math.round(now() - t), err: e.message }
  }
}

function stats(times) {
  if (!times.length) return { min: 0, max: 0, avg: 0, p95: 0, p99: 0 }
  const s = [...times].sort((a, b) => a - b)
  const avg = Math.round(s.reduce((a, b) => a + b, 0) / s.length)
  return {
    min: s[0],
    max: s[s.length - 1],
    avg,
    p95: s[Math.floor(s.length * 0.95)],
    p99: s[Math.floor(s.length * 0.99)],
  }
}

function bar(value, max, width = 30) {
  const filled = Math.min(width, Math.max(0, Math.round((value / max) * width)))
  return '█'.repeat(filled) + '░'.repeat(width - filled)
}

function printStats(label, results) {
  const ok     = results.filter(r => r.ok)
  const failed = results.filter(r => !r.ok)
  const times  = ok.map(r => r.ms)
  const s      = stats(times)
  const rps    = Math.round(ok.length / (s.max / 1000)) || 0

  console.log(`\n  ${label}`)
  console.log(`  ─────────────────────────────────────────`)
  console.log(`  Total requests : ${results.length}`)
  console.log(`  Successful     : ${ok.length} (${Math.round(ok.length / results.length * 100)}%)`)
  console.log(`  Failed         : ${failed.length}`)
  console.log(`  Min latency    : ${s.min}ms`)
  console.log(`  Avg latency    : ${s.avg}ms   ${bar(s.avg, 3000)}`)
  console.log(`  P95 latency    : ${s.p95}ms   ${bar(s.p95, 3000)}`)
  console.log(`  P99 latency    : ${s.p99}ms   ${bar(s.p99, 3000)}`)
  console.log(`  Max latency    : ${s.max}ms   ${bar(s.max, 3000)}`)
  console.log(`  Throughput     : ~${rps} req/s`)

  if (failed.length) {
    const codes = {}
    failed.forEach(r => { codes[r.status] = (codes[r.status] || 0) + 1 })
    console.log(`  Error codes    :`, codes)
  }

  // Rating
  const rating = s.p95 < 300 ? '🟢 Excellent' : s.p95 < 800 ? '🟡 Acceptable' : s.p95 < 2000 ? '🟠 Slow' : '🔴 Critical'
  console.log(`  Rating         : ${rating}`)
  return { ok: ok.length, failed: failed.length, ...s }
}

// ── 1. BASELINE TEST ─────────────────────────────────────────────────────────
async function baselineTest() {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║  1. BASELINE TEST  (1 user, sequential requests) ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log('  Purpose: Establish raw single-user response time per endpoint.\n')

  for (const ep of ENDPOINTS) {
    const results = []
    for (let i = 0; i < 10; i++) {
      results.push(await hit(ep.url))
      await sleep(100)
    }
    printStats(ep.name, results)
  }
}

// ── 2. LOAD TEST ─────────────────────────────────────────────────────────────
async function loadTest() {
  console.log('\n╔══════════════════════════════════════════════════╗')
  console.log('║  2. LOAD TEST  (50 concurrent users, 5 rounds)   ║')
  console.log('╚══════════════════════════════════════════════════╝')
  console.log('  Purpose: Simulate expected peak production traffic.\n')

  const CONCURRENCY = 50
  const ROUNDS      = 5
  const url         = ENDPOINTS[0].url

  const results = []
  for (let round = 0; round < ROUNDS; round++) {
    const batch = Array(CONCURRENCY).fill(null).map(() => hit(url))
    const res   = await Promise.all(batch)
    results.push(...res)
    process.stdout.write(`  Round ${round + 1}/${ROUNDS} — ${res.filter(r => r.ok).length}/${CONCURRENCY} ok\r`)
    await sleep(500)
  }
  printStats(`Products endpoint — ${CONCURRENCY} concurrent × ${ROUNDS} rounds`, results)
}

// ── 3. SPIKE TEST ─────────────────────────────────────────────────────────────
async function spikeTest() {
  console.log('\n╔═══════════════════════════════════════════════════════════════╗')
  console.log('║  3. SPIKE TEST  (10 → 200 users instantly → back to 10)      ║')
  console.log('╚═══════════════════════════════════════════════════════════════╝')
  console.log('  Purpose: Can the API handle a sudden viral/sale traffic surge?\n')

  const url = ENDPOINTS[0].url

  // Normal load
  console.log('  Phase A — Normal load (10 users)...')
  const phaseA = await Promise.all(Array(10).fill(null).map(() => hit(url)))
  printStats('Phase A: Normal (10 users)', phaseA)

  await sleep(1000)

  // Spike
  console.log('\n  Phase B — SPIKE (200 users simultaneously)...')
  const phaseB = await Promise.all(Array(200).fill(null).map(() => hit(url)))
  printStats('Phase B: Spike (200 users)', phaseB)

  await sleep(2000)

  // Recovery
  console.log('\n  Phase C — Recovery (10 users after spike)...')
  const phaseC = await Promise.all(Array(10).fill(null).map(() => hit(url)))
  printStats('Phase C: Recovery (10 users)', phaseC)

  const recovered = stats(phaseC.map(r => r.ms)).avg <= stats(phaseA.map(r => r.ms)).avg * 1.5
  console.log(`\n  Spike recovery: ${recovered ? '✅ Recovered cleanly' : '⚠️  Degraded after spike'}`)
}

// ── 4. STRESS TEST ───────────────────────────────────────────────────────────
async function stressTest() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  4. STRESS TEST  (ramp 10 → 300 users, find breaking point)     ║')
  console.log('╚══════════════════════════════════════════════════════════════════╝')
  console.log('  Purpose: Find where latency degrades or errors appear.\n')

  const url    = ENDPOINTS[0].url
  const levels = [10, 25, 50, 75, 100, 150, 200, 300]
  let   broke  = null

  console.log(`  ${'Users'.padEnd(8)} ${'Success%'.padEnd(10)} ${'Avg ms'.padEnd(10)} ${'P95 ms'.padEnd(10)} Status`)
  console.log(`  ${'─'.repeat(55)}`)

  for (const users of levels) {
    const results = await Promise.all(Array(users).fill(null).map(() => hit(url)))
    const s       = stats(results.filter(r => r.ok).map(r => r.ms))
    const pct     = Math.round(results.filter(r => r.ok).length / results.length * 100)
    const status  = pct < 95 ? '🔴 BREAKING' : s.p95 > 3000 ? '🟠 DEGRADED' : s.avg > 1500 ? '🟡 SLOW' : '🟢 OK'
    console.log(`  ${String(users).padEnd(8)} ${(pct + '%').padEnd(10)} ${(s.avg + 'ms').padEnd(10)} ${(s.p95 + 'ms').padEnd(10)} ${status}`)
    if (!broke && (pct < 95 || s.p95 > 3000)) broke = users
    await sleep(1000)
  }

  console.log(`\n  Breaking point: ${broke ? `~${broke} concurrent users` : 'Not reached in test range (≥300 users OK)'}`)
}

// ── 5. SOAK TEST ─────────────────────────────────────────────────────────────
async function soakTest() {
  const DURATION_S  = 30
  const CONCURRENCY = 20
  const url         = ENDPOINTS[0].url

  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log(`║  5. SOAK TEST  (${CONCURRENCY} users sustained for ${DURATION_S}s)               ║`)
  console.log('╚══════════════════════════════════════════════════════════════════╝')
  console.log('  Purpose: Detect memory leaks, connection pool exhaustion, drift.\n')

  const all     = []
  const buckets = []
  const start   = now()
  let   batch   = 0

  while ((now() - start) < DURATION_S * 1000) {
    const results = await Promise.all(Array(CONCURRENCY).fill(null).map(() => hit(url)))
    all.push(...results)
    buckets.push(stats(results.filter(r => r.ok).map(r => r.ms)).avg)
    batch++
    process.stdout.write(`  ${Math.round((now() - start) / 1000)}s — batch ${batch}, avg ${buckets[buckets.length-1]}ms    \r`)
    await sleep(500)
  }

  console.log()
  printStats(`Soak (${CONCURRENCY} users × ${batch} batches = ${all.length} requests)`, all)

  // Drift: compare first 20% vs last 20%
  const slice  = Math.floor(buckets.length * 0.2)
  const early  = Math.round(buckets.slice(0, slice).reduce((a, b) => a + b, 0) / slice)
  const late   = Math.round(buckets.slice(-slice).reduce((a, b) => a + b, 0) / slice)
  const drift  = late - early
  console.log(`\n  Latency drift  : early avg ${early}ms → late avg ${late}ms (${drift >= 0 ? '+' : ''}${drift}ms)`)
  console.log(`  Drift verdict  : ${Math.abs(drift) < 100 ? '✅ Stable — no memory/connection leak detected' : '⚠️  Drift detected — investigate connection pooling'}`)
}

// ── 6. MULTI-ENDPOINT CONCURRENT ─────────────────────────────────────────────
async function multiEndpointTest() {
  console.log('\n╔══════════════════════════════════════════════════════════════════╗')
  console.log('║  6. MULTI-ENDPOINT TEST  (realistic browsing simulation)        ║')
  console.log('╚══════════════════════════════════════════════════════════════════╝')
  console.log('  Purpose: Simulate a real user session hitting multiple endpoints.\n')

  const results = {}
  for (const ep of ENDPOINTS) {
    const res = await Promise.all(Array(30).fill(null).map(() => hit(ep.url)))
    results[ep.name] = printStats(ep.name, res)
    await sleep(300)
  }
}

// ── MAIN ──────────────────────────────────────────────────────────────────────
console.log('╔══════════════════════════════════════════════════════════════════╗')
console.log('║          JD TECHSTORES — PERFORMANCE TEST SUITE                 ║')
console.log(`║          Target: ${BASE.replace('https://', '').substring(0, 40).padEnd(40)}  ║`)
console.log('╚══════════════════════════════════════════════════════════════════╝')
console.log('\n  Tests: Baseline → Load → Spike → Stress → Soak → Multi-endpoint')
console.log('  ⚠️  This makes real HTTP requests to your Supabase project.\n')

const t0 = now()

await baselineTest()
await loadTest()
await spikeTest()
await stressTest()
await soakTest()
await multiEndpointTest()

const elapsed = Math.round((now() - t0) / 1000)
console.log('\n╔══════════════════════════════════════════════════════════════════╗')
console.log(`║  All tests completed in ${String(elapsed + 's').padEnd(5)}                              ║`)
console.log('╚══════════════════════════════════════════════════════════════════╝\n')
