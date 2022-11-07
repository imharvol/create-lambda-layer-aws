#!/usr/bin/env node

import { promisify } from 'node:util'
import { exec } from 'node:child_process'
import * as fs from 'node:fs/promises'
import * as os from 'node:os'
import * as path from 'node:path'
const promiseExec = promisify(exec)

const outputFileName = 'layer.zip'
const outputFilePath = path.join(process.cwd(), outputFileName)

const args = process.argv.slice(2)

const cwdFiles = await fs.readdir(process.cwd())
if (cwdFiles.includes(outputFileName)) {
  console.log(`There's already a file named ${outputFileName}`)
  process.exit(1)
}

// Create a temporary working dir
const tmpDirPath = await fs.mkdtemp(path.join(os.tmpdir(), 'create-lambda-layer-aws-'))

// Create nodejs dir
const nodejsDirPath = path.join(tmpDirPath, 'nodejs')
await fs.mkdir(nodejsDirPath)

let packages = []
// List packages
for (const arg of args) {
  if (arg.endsWith('/package.json')) {
    const packageJson = JSON.parse(await fs.readFile(arg))
    for (const dependency of Object.entries(packageJson.dependencies)) {
      packages.push(`${dependency[0]}@${dependency[1]}`)
    }
  } else {
    packages.push(arg)
  }
}

// Install packages inside the nodejs dir
console.log('Installing dependencies:')
console.log(packages.join(', '))
await promiseExec(`cd ${nodejsDirPath} && npm install --quiet ${packages.join(' ')}`)

// Zip
console.log('Zipping dependencies ...')
await promiseExec(`cd ${tmpDirPath} && zip --quiet -r ${outputFilePath} nodejs`)

await fs.rm(tmpDirPath, { recursive: true })
