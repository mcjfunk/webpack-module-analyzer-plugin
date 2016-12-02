# webpack-module-analyzer-plugin [![NPM version][npm-image]][npm-url]
> Webpack plugin that outputs the list of modules contained in the output bundle and their respective sizes. This produces a file in the output directory that you can use to make determinations about your build.

## Installation

```sh
$ npm install --save-dev webpack-module-analyzer-plugin
```

## Usage

```js
const ModuleAnalyzerPlugin = require('webpack-module-analyzer-plugin');

// Within your webpack config
plugins: [
    new ModuleAnalyzerPlugin({
        filename: 'outputStats', // default
        srcDir: 'src' // default
    })
];
```
### Options
* `filename`: name of file that is created in the webpack output directory.

* `srcDir`: name of the directory where your source files are located. This is used in a regex to help differentiate your source from 3rd party node modules.

## Output

`outputStats` file in the webpack output directory:
```
EXTERNALS
---------
"classnames"
"react"

SOURCE FILES
--------------------
components/Calendar/Calendar.js
components/Calendar/Calendar.less
index.js

INCLUDED MODULES
--------------------
lodash.debounce/index.js (10.53 kb) -- Issuer: ./src/components/Calendar/Calendar.js
style-loader/addStyles.js (6.99 kb) -- Issuer: ./src/components/Calendar/Calendar.less
```
File sizes are pre-minified sizes.


## License

MIT © [Jeff McLean]()


[npm-image]: https://badge.fury.io/js/webpack-module-analyzer-plugin.svg
[npm-url]: https://npmjs.org/package/webpack-module-analyzer-plugin
