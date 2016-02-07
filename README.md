# sails-hook-typescript

[Sails JS](http://sailsjs.org) hook to compile & watch TypeScript files.

### Installation

`npm install sails-hook-typescript`

### Usage
*requires at least sails >= 0.11*

Just lift your app as normal, and when you add / change / remove a TypeScript file inside ```assets/js```, the file will be re-compiled and the browser will be reloaded (if you have Live Reload) without having to lower / relift the app.

### Configuration

By default, configuration lives in `sails.config.typescript`.  The configuration key (`typescript`) can be changed by setting `sails.config.hooks['sails-hook-typescript'].configKey`.

Parameter      | Type                | Details
-------------- | ------------------- |:---------------------------------
active        | ((boolean)) | Whether or not the hook should compile & watch for TypeScript file changes.  Defaults to `true`.
usePolling    | ((boolean)) | Whether or not to use the polling feature. Slower but necessary for certain environments. Defaults to `false`.
dirs          | ((array)) | Array of strings indicating which folders should be watched.  Defaults to the `assets/js`, 
ignored       | ((array\|string\|regexp\|function)) |  Files and/or directories to be ignored. Pass a string to be directly matched, string with glob patterns, regular expression test, function that takes the testString as an argument and returns a truthy value if it should be matched, or an array of any number and mix of these types. For more examples look up [anymatch docs](https://github.com/es128/anymatch).

#### Example

```javascript
// [your-sails-app]/config/typescript.js
module.exports.typescript = {
  active: true,
  usePolling: false,
  dirs: [
	"assets/js",
    "assets/js/dependencies",
  ],
  ignored: [
    "assets/js/directorytoignore"
  ]
};

```

That&rsquo;s it!