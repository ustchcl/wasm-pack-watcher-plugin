const path = require('path')
const process = require('process')
const validateOptions = require('schema-utils')
const cp = require('child_process')

const Plugin = 'WasmPackWatcherPlugin'

class WasmPackWatcherPlugin {
	constructor(options = {}) {
		options = {
			...{
				sourceRoot: path.resolve(process.cwd(), 'src'),
				crateRoot: process.cwd()
			}, ...options
		}
		validateOptions(require('./options.json'), options, Plugin)
		this.options = options
	}
	apply(compiler) {
		compiler.hooks.afterCompile.tap(Plugin, compilation => {
			compilation.contextDependencies.add(this.options.sourceRoot)
		})
		compiler.hooks.compile.tap(Plugin, compilation => {
			const { status: err, pid } = cp.spawnSync('wasm-pack', ['build'], {
				cwd: this.options.crateRoot,
				stdio: "inherit"
			})
		})
	}
}

module.exports = WasmPackWatcherPlugin
