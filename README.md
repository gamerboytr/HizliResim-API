# HızlıResim Unofficial API

Coded By [GamerboyTR](offical.gamerboytr@yandex.com)
Licensed Under [MIT](https://github.com/gamerboytr/HizliResim-API/blob/master/LICENSE)

## Getting started

Install the package with [nodejs](https://nodejs.org/en/):

```bat
$ npm install hizliresim-api
```

Or you can use [yarn](https://yarnpkg.com/en/docs/install)

```bat
$ yarn add hizliresim-api
```

Create `app.js`

```bat
$ touch app.js
```

And add this code:

```js
// app.js
const hizliresim = require("hizliresim-api");

const Client = new hizliresim.Client();
```

## Uploading Image

Upload an image to HızlıResim

### Syntax

```js
Client.upload("filename":String, "description":String, "password|callback":String|Function?, "retention|callback":Int|Function?, "callback":Function?):<Promise<JSON>>
```

### Using with callback

```js
Client.upload("./rickroll.png", "Rickroll", function ({ code, url, imageUrl }) {
	console.log(code); // t1iz2nq
	console.log(url); // https://www.hizliresim.com/t1iz2nq
	console.log(imageUrl); // https://i.hizliresim.com/t1iz2nq.png
});
```

### Using with promise

```js
// Async/Await
const Foo = async function () {
	const { code, url, imageUrl } = await Client.upload("./rickroll.png", "Rickroll");
	console.log(code); // t1iz2nq
	console.log(url); // https://www.hizliresim.com/t1iz2nq
	console.log(imageUrl); // https://i.hizliresim.com/t1iz2nq.png
};

// Promise
Client.upload("./rickroll.png", "Rickroll").then(function ({ code, url, imageUrl }) {
	console.log(code); // t1iz2nq
	console.log(url); // https://www.hizliresim.com/t1iz2nq
	console.log(imageUrl); // https://i.hizliresim.com/t1iz2nq.png
});
```

## Saving Image

Save an image from HızlıResim

### Syntax

```js
Client.getImage("code":String, "fileName":String,"callback":Function?, "options":Array?):<Promise<String>>
```

Notice: If file already exists, it throws `HizliResimRequestException`.

### Using with callback

```js
Client.getImage("t1iz2nq", "rickroll", function (fileName) {
	console.log(fileName); // rickroll.png
});
```

### Using with promise

```js
// Async/Await
const Bar = async function () {
	const fileName = await Client.getImage("t1iz2nq", "rickroll");
	console.log(fileName); // rickroll.png
};

// Promise
Client.getImage("t1iz2nq", "rickroll").then(function (fileName) {
	console.log(fileName); // rickroll.png
});
```

### Options

You can set options for saving image.

```js
const { Options } = require("hizliresim-api");

Client.getImage("t1iz2nq", "rickroll").then(
	function (fileName) {
		console.log(fileName); // rickroll.png
	},
	[Options.FLAGS.OVERWRITE]
);
```

If you want to overwrite the file, you can use `Options.FLAGS.OVERWRITE`

## Get Csrf Token

Get csrf token for other processes

### Syntax

```js
Client.getCsrfToken():<Promise<JSON>>
```

### Using with promise

```js
// Async/Await
const Bar = async function () {
	const { csrf, cookie } = await Client.getCsrfToken();
	console.log(csrf); // csrf token
	console.log(cookie); // csrf cookie
};

// Promise
Client.getCsrfToken().then(function ({ csrf, cookie }) {
	console.log(csrf); // csrf token
	console.log(cookie); // csrf cookie
});
```

HızlıResim unofficial API By [GamerboyTR](https://github.com/gamerboytr)
Licensed Under [MIT](https://github.com/gamerboytr/HizliResim-API/blob/master/LICENSE)

Copyright &copy; 2022 GamerboyTR
Copyright &copy; 2022 HızlıResim.com
