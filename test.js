import test from 'ava';
import m from '.';

test('input', t => {
	const errNum = t.throws(() => {
		m(1);
	}, TypeError);
	const errArray = t.throws(() => {
		m(['a', 'b']);
	}, TypeError);
	t.is(errNum.message, 'Expected a string, got number');
	t.is(errArray.message, 'Expected a string, got object');
});

test('magic number', t => {
	const err = t.throws(() => {
		m('./fixtures/mn_false.txt');
	}, TypeError);
	t.is(err.message, 'Invalid file format');
	t.truthy(m('./fixtures/mn_true.txt'));
});

test('local', t => {
	const chat = m('./fixtures/local.txt');
	t.is(chat.header.channelId, '((\'solarsystemid2\', 30002595),)');
	t.is(chat.header.channelName, 'Local');
	t.is(chat.header.listener, 'CCP');
	t.is(chat.messages.length, 5);
});
