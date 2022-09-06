#! /usr/bin/env node
const [,, configFile = 'hayyarc'] = process.argv

const path = require('path')
const fs = require('fs')
const run = require('./lib/run')
const parseText = require('./lib/parser')

const cwd = process.cwd()

const configPath = path.resolve(cwd, configFile)

if (!fs.existsSync(configPath)) throw Error('Config file not found')

const config = fs.readFileSync(configPath, 'utf-8')

const parsed = parseText(config)

run(parsed, process.stdout)
