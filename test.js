import test from 'ava';
import m from '.';

test('input', t => {
	const errNum = t.throws(() => {
		m(1);
	}, TypeError);
	const errArray = t.throws(() => {
		m(['a', 'b']);
	}, TypeError);
	const errOffset = t.throws(() => {
		m('./fixtures/mn_true.txt', {offset: '2'});
	}, TypeError);
	t.is(errNum.message, 'Expected a string, got number');
	t.is(errArray.message, 'Expected a string, got object');
	t.is(errOffset.message, 'Expected offset as integer, got string');
});

test('magic number', t => {
	const err = t.throws(() => {
		m('./fixtures/mn_false.txt');
	}, TypeError);
	t.is(err.message, 'Invalid file format');
	t.truthy(m('./fixtures/mn_true.txt'));
});

test('filename', t => {
	const err = t.throws(() => {
		m('./fixtures/1');
	}, TypeError);
	t.true(err.message.includes('ENOENT: no such file or directory'));
});

test('local', t => {
	const chat = m('./fixtures/local.txt');
	t.is(chat.header.channelId, '((\'solarsystemid2\', 30002595),)');
	t.is(chat.header.channelName, 'Local');
	t.is(chat.header.listener, 'CCP');
	t.is(chat.messages.length, 5);
});

test('special-chars', t => {
	const chat = m('./fixtures/extra-char.txt');
	t.is(chat.messages[3].text, 'Message 1 > Message 2.');
	t.is(chat.messages[4].text, 'another timestamp [ 2017.07.11 20:27:57 ].');
});
