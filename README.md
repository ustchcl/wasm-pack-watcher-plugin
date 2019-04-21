# Usage

```bash
$ yarn add -D wasm-pack-watcher-plugin
```

```javascript
// webpack.config.js
// ...
const WasmPackWatcherPlugin = require('wasm-pack-watcher-plugin')

// ...

module.exports = {
	// ...
	plugins: [
		// ...
		new WasmPackWatcherPlugin({
			sourceRoot: path.resolve(__dirname, 'rs'),    // default: __dirname/src
			crateRoot: path.resolve(__dirname),           // default: __dirname
			mode: "release"                               // default: release
		})
	]
}

```

The plugin will watch `./rs` for file changes, and execute `wasm-pack --release` in `./`.

Please ensure wasm-pack is in your $PATH. 
