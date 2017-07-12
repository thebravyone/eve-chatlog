'use strict';
const fs = require('fs');
const moment = require('moment');
const camel = require('camel-case');

module.exports = (filename, opts) => {
	if (typeof filename !== 'string') {
		throw new TypeError(`Expected a string, got ${typeof filename}`);
	}

	opts = Object.assign({
		offset: 0
	}, opts);

	const fillPattern = (array, pattern) => {
		for (let i = 0, j = 0; i < array.length; i++, j++) {
			if (j >= pattern.length) {
				j = 0;
			}
			array[i] = pattern[j];
		}
		return array;
	};

	const parseHeader = b => {
		const textArray = b.toString('utf16le').split(/\r?\n|\r/);
		const parsed = {};
		for (let i = 0; i < textArray.length; i++) {
			if (textArray[i] !== '') {
				const property = textArray[i].split(/:(.+)/);
				if (property.length > 0) {
					parsed[camel(property[0].trim())] = property[1].trim();
				}
			}
		}
		if (parsed.sessionStarted) {
			parsed.sessionStarted = moment.utc(parsed.sessionStarted, 'YYYY.MM.DD HH:mm:ss').format();
		}
		return parsed;
	};

	const parseMessages = b => {
		const textArray = b.toString('utf16le').split(/\r?\n|\r/);
		const parsed = [];
		for (let i = 0; i < textArray.length; i++) {
			if (textArray[i] !== '') {
				const entry = textArray[i].split(/[[\]>]+/);
				if (entry.length === 4) {
					parsed.push({
						timestamp: moment.utc(entry[1].trim(), 'YYYY.MM.DD HH:mm:ss').format(),
						sender: entry[2].trim(),
						text: entry[3].trim()
					});
				}
			}
		}
		return parsed;
	};

	// Define static references
	const magicNumber = Buffer.from([0xFF, 0xFE, 0x0D, 0x00, 0x0A, 0x00, 0x0D, 0x00, 0x0A, 0x00, 0x0A, 0x00, 0x20, 0x00, 0x20, 0x00]);
	const headerBoundary = Buffer.from(fillPattern(new Array(126), [0x00, 0x2D]));

	// Load Log file into buffer
	const buff = fs.readFileSync(filename);

	// Check magic number
	if (buff.indexOf(magicNumber) === -1) {
		throw new TypeError('Invalid file format');
	}

	// Find header position in buffer
	const headerPosition = {};
	headerPosition.start = buff.indexOf(headerBoundary) + 1 + headerBoundary.length;
	headerPosition.end = buff.indexOf(headerBoundary, headerPosition.start);
	if (headerPosition.end <= headerPosition.start) {
		throw new TypeError('Invalid file format');
	}

	// Parse header
	const header = parseHeader(buff.slice(headerPosition.start, headerPosition.end));

	// Parse messages
	const messageOffset = opts.offset > 0 && opts.offset > (headerPosition.end + 1 + headerBoundary.length) ? opts.offset : (headerPosition.end + 1 + headerBoundary.length);
	const messages = parseMessages(buff.slice(messageOffset));

	return {
		header,
		messages,
		byteLength: buff.length
	};
};
