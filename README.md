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
        srcDir: 'src', // default
        expandDependentFiles: false // default
    })
];
```
### Options
* `filename`: name of file that is created in the webpack output directory.

* `srcDir`: name of the directory where your source files are located. This is used in a regex to help differentiate your source from 3rd party node modules.

* `expandDependentFiles`: boolean, when true will list every file within the dependency rather than roll up to the one dependency.

## Output

`outputStats` file in the webpack output directory:
```
EXTERNALS
---------
"classnames"

SOURCE FILES
--------------------
components/Calendar/Calendar.js (6 kb)
components/Calendar/Calendar.less (1 kb)
index.js (0.5k)

INCLUDED MODULES
--------------------
fbjs (29.05 kb) -- Issuers: react-dom
object-assign (1.95 kb) -- Issuers: react
react (104.12 kb) -- Issuers: react-dom, src
react-dom (506.05 kb) -- Issuers: src
```

With `expandDependentFiles: true`
```
EXTERNALS
---------
"classnames"

SOURCE FILES
--------------------
components/Calendar/Calendar.js (6 kb)
components/Calendar/Calendar.less (1 kb)
index.js (0.5k)

INCLUDED MODULES
--------------------
fbjs/lib/EventListener.js (2.61 kb) -- Issuer: react-dom/lib/ReactEventListener.js
fbjs/lib/ExecutionEnvironment.js (1.04 kb) -- Issuer: react-dom/lib/BeforeInputEventPlugin.js
fbjs/lib/camelize.js (0.69 kb) -- Issuer: fbjs/lib/camelizeStyleName.js
fbjs/lib/camelizeStyleName.js (0.98 kb) -- Issuer: react-dom/lib/CSSPropertyOperations.js
fbjs/lib/containsNode.js (1.02 kb) -- Issuer: react-dom/lib/ReactInputSelection.js
fbjs/lib/createArrayFromMixed.js (4.02 kb) -- Issuer: fbjs/lib/createNodesFromMarkup.js
fbjs/lib/createNodesFromMarkup.js (2.6 kb) -- Issuer: react-dom/lib/Danger.js
fbjs/lib/emptyFunction.js (1.06 kb) -- Issuer: react/lib/ReactChildren.js
fbjs/lib/emptyObject.js (0.45 kb) -- Issuer: react/lib/ReactComponent.js
fbjs/lib/focusNode.js (0.69 kb) -- Issuer: react-dom/lib/AutoFocusUtils.js
fbjs/lib/getActiveElement.js (0.87 kb) -- Issuer: react-dom/lib/SelectEventPlugin.js
fbjs/lib/getMarkupWrap.js (2.96 kb) -- Issuer: fbjs/lib/createNodesFromMarkup.js
fbjs/lib/getUnboundedScrollPosition.js (1.03 kb) -- Issuer: react-dom/lib/ReactEventListener.js
fbjs/lib/hyphenate.js (0.78 kb) -- Issuer: fbjs/lib/hyphenateStyleName.js
fbjs/lib/hyphenateStyleName.js (0.95 kb) -- Issuer: react-dom/lib/CSSPropertyOperations.js
fbjs/lib/invariant.js (1.59 kb) -- Issuer: react/lib/ReactComponent.js
fbjs/lib/isNode.js (0.68 kb) -- Issuer: fbjs/lib/isTextNode.js
fbjs/lib/isTextNode.js (0.59 kb) -- Issuer: fbjs/lib/containsNode.js
fbjs/lib/memoizeStringOnly.js (0.68 kb) -- Issuer: react-dom/lib/CSSPropertyOperations.js
fbjs/lib/shallowEqual.js (1.7 kb) -- Issuer: react-dom/lib/ReactDOMComponent.js
fbjs/lib/warning.js (2.06 kb) -- Issuer: react/lib/React.js
object-assign/index.js (1.95 kb) -- Issuer: react/lib/React.js
react-dom/lib/ARIADOMPropertyConfig.js (1.77 kb) -- Issuer: react-dom/lib/ReactDefaultInjection.js
react-dom/lib/AutoFocusUtils.js (0.58 kb) -- Issuer: react-dom/lib/ReactDOMComponent.js
react-dom/lib/BeforeInputEventPlugin.js (12.94 kb) -- Issuer: react-dom/lib/ReactDefaultInjection.js
react-dom/lib/CSSProperty.js (3.58 kb) -- Issuer: react-dom/lib/CSSPropertyOperations.js
react-dom/lib/CSSPropertyOperations.js (6.71 kb) -- Issuer: react-dom/lib/ReactDOMComponent.js
react-dom/lib/CallbackQueue.js (3.09 kb) -- Issuer: react-dom/lib/ReactUpdates.js
react-dom/lib/ChangeEventPlugin.js (10.8 kb) -- Issuer: react-dom/lib/ReactDefaultInjection.js
...
```
File sizes are pre-minified sizes.


## License

MIT © [Jeff McLean]()


[npm-image]: https://badge.fury.io/js/webpack-module-analyzer-plugin.svg
[npm-url]: https://npmjs.org/package/webpack-module-analyzer-plugin
