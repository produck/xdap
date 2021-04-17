'use strict';

const { DOMParser, XMLSerializer } = require('xmldom');
const xpath = require('xpath');

try {
	const dom = new DOMParser().parseFromString('<repository />');

	console.time('a');
	for (let i = 0; i< 10000000; i++) {
		const element = dom.createElement('abc');

		element.setAttribute('a', i);
		element.setAttribute('b', i);
		element.setAttribute('c', i);
		element.setAttribute('d', i);
		element.setAttribute('e', i);
		element.setAttribute('f', i);
		element.setAttribute('g', i);
		element.setAttribute('h', i);
		element.setAttribute('i', i);
		dom.documentElement.appendChild(element);
	}
	console.timeEnd('a');

	// console.time('s');
	// // xpath.select('//abc[position()<2]', dom);
	// xpath.select('/repository/abc[position()=8000000]', dom);
	// console.timeEnd('s');

	setInterval(() => {}, 100000);
} catch (err) {
	console.log(err)
}