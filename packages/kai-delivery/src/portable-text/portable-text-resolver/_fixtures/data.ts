import * as path from 'node:path'
import * as fs from 'node:fs/promises'
import { JSDOM } from 'jsdom'

async function readFixtureInput(fixturePath: string): Promise<string> {
  const inputPath = path.resolve(fixturePath, 'input.html')
  const input = await fs.readFile(inputPath, 'utf-8')
  const inputDom = new JSDOM(input.toString())

  return inputDom.window.document.body.innerHTML
}

async function readFixtureOutput(fixturePath: string) {
  const outputPath = path.resolve(fixturePath, 'output.json')
  const output = await fs.readFile(outputPath, 'utf-8')

  return JSON.parse(output)
}

async function readFixtureData(fixtureName: string) {
  const fixturePath = path.resolve(__dirname, fixtureName)

  const input = await readFixtureInput(fixturePath)
  const output = await readFixtureOutput(fixturePath)

  return {
    input,
    output
  }
}

export { readFixtureData }
