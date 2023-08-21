/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-member-access */
import {test} from 'node:test'
import assert from 'node:assert'
import { createRequire } from 'node:module'
import path from 'node:path'

const require = createRequire(import.meta.url)

function clearModule(id: string, src: string) {
  const module = require.cache[require.resolve(id)]
  const root = path.parse(path.resolve(src)).dir
  if (module && 'children' in module && module.children.length > 0) {
    for (const child of module.children) {
      if (child.loaded && child.path.includes(root))
        clearModule(child.filename, src)
    }
  }
  console.log(module)
  delete require.cache[require.resolve(id)]
}

function requireModule (id: string) {
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return require(id)
}

const mod ='../../src/app.js'

await test('Mock env var', async (t) => {
  process.env.VAL = 'some'
  const app = requireModule(mod)

  await t.test('Should be equal to some', () => {
    const val = app.val
    assert.strictEqual(val, process.env.VAL, 'No good')
    clearModule(mod, './src')
    })
})
await test('Mock env var', async (t) => {
  process.env.VAL = 'new var'
  const app = requireModule(mod)
  await t.test('Should be equal to new var', () => {
    const val = app.val
    assert.strictEqual(val, process.env.VAL, 'No good')
  })
})
