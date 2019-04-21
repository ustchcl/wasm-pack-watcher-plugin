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
				crateRoot: process.cwd(),
				mode: 'release'
			}, ...options
		}
		validateOptions(require('./options.json'), options, Plugin)
		this.options = options
	}
	apply(compiler) {
		compiler.hooks.afterCompile.tap(Plugin, compilation => {
			const dir = path.resolve(this.options.crateRoot, 'pkg')
			const pkgs = new RegExp('^' + dir + '/.*' + '$')
			const rm = set => {
				set.forEach(e => { if (pkgs.test(e)) set.delete(e) })
			}
			compilation.contextDependencies.delete(dir)
			rm(compilation.fileDependencies)
			rm(compilation.contextDependencies)
			compilation.contextDependencies.add(this.options.sourceRoot)
		})
		compiler.hooks.compile.tap(Plugin, compilation => {
			const { status: err, pid } = cp.spawnSync('wasm-pack', ['build', '--' + this.options.mode], {
				cwd: this.options.crateRoot,
				stdio: "inherit"
			})
		})
	}
}

module.exports = WasmPackWatcherPlugin
