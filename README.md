# eve-chatlog [![Build Status](https://travis-ci.org/thebravyone/eve-chat-log.svg?branch=master)](https://travis-ci.org/thebravyone/eve-chat-log)
> EVE Online Chatlog (txt) parser

## Install

```
$ npm install eve-chatlog
```

## Usage

```js
const chatlog = require('eve-chatlog');

chatlog('Local_19000101_000000.txt');
```


## API

### chatlog(filename, [options])

#### filename

Type: `string`

Path to chatlog (txt) file.

#### options

##### offset

Type: `integer`<br>
Default: `0`

Used when checking for changes in logs, so you don't have to parse all content again.

```js
// Parse all logs
let firstPass = chatlog('Local_19000101_000000.txt');

// After new logs are added by EVE Client
// Resume from where 'firstPass' stopped
let secondPass = chatlog('Local_19000101_000000.txt', firstPass.byteLength);
```


## License

MIT © [Guilherme Serradilha](https://github.com/thebravyone)
