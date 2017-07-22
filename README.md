# eve-chatlog [![Build Status](https://travis-ci.org/thebravyone/eve-chatlog.svg?branch=master)](https://travis-ci.org/thebravyone/eve-chatlog)
> EVE Online Chatlog (txt) parser

## Install

```
$ npm install eve-chatlog
```

## Usage

```js
const chatlog = require('eve-chatlog');

chatlog('Local_19000101_000000.txt');
/* => { header:
   { channelId: '((\'solarsystemid2\', 30002595),)',
     channelName: 'Local',
     listener: 'CCP',
     sessionStarted: '2017-07-11T18:43:50Z' },
  messages:
   [ { timestamp: '2017-07-11T20:16:57Z',
       sender: 'EVE System',
       text: 'Channel changed to Local : N-7ECY' },
     { timestamp: '2017-07-11T20:18:03Z',
       sender: 'EVE System',
       text: 'Channel changed to Local : 4-MPSJ' },
     { timestamp: '2017-07-11T20:18:51Z',
       sender: 'EVE System',
       text: 'Channel changed to Local : TWJ-AW' },
     { timestamp: '2017-07-11T20:21:50Z',
       sender: 'Message',
       text: 'A large group of pirate ships have arrived through the gate.  From the looks of it, they don\'t appear to be too friendly.' },
     { timestamp: '2017-07-11T20:27:57Z',
       sender: 'Message',
       text: 'More ships have arrived through the gate.' } ],
  byteLength: 1476 }
	*/
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
