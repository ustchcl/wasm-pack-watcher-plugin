const path = require('path')
const process = require('process')
const validateOptions = require('schema-utils')
const watch = require('node-watch')
const cp = require('child_process')

const Plugin = 'WasmPackWatcherPlugin'

class WasmPackWatcherPlugin {
	constructor(options = {}) {
		options = {
			...{
				sourceRoot: path.resolve(process.cwd(), 'src'),
				crateRoot: process.cwd(),
				mode: 'release'
			}, ...options
		}
		validateOptions(require('./options.json'), options, Plugin)
		this.options = options
	}
	apply() {
		watch(this.options.sourceRoot, { recursive: true }, (evt, name) => {
			const { status: err, pid } = cp.spawnSync('wasm-pack', ['build', '--' + this.options.mode], {
				cwd: this.options.crateRoot,
				stdio: "inherit"
			})
		})
	}
}

module.exports = WasmPackWatcherPlugin
