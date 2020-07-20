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
		watch([
            path.resolve(this.options.sourceRoot, "Cargo.toml")
            path.resolve(this.options.sourceRoot, "src")
        ], { recursive: true }, (evt, name) => {
            console.log(`There are new changes in '${name}'. Start to rebuild rustwasm sources`)
			const { status: err, pid } = cp.spawnSync('wasm-pack', ['build', '--' + this.options.mode, '--target', this.options.target], {
				cwd: this.options.crateRoot,
				stdio: "inherit"
			})
		})
	}
}

module.exports = WasmPackWatcherPlugin
