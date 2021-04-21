'use strict';

const Rebuilder = require('../src/Engine/Rebuilder');
const { Repository } = require('../src/Engine/Repository');
const { XMLSerializer } = require('xmldom');

function permute(testArr) {
	var permuteArr = [];
	var arr = testArr;

	(function innerPermute(temArr) {
		for (var i = 0, len = arr.length; i < len; i++) {
			if (temArr.length == len - 1) {
				if (temArr.indexOf(arr[i]) < 0) {
					permuteArr.push(temArr.concat(arr[i]));
				}
				continue;
			}
			if (temArr.indexOf(arr[i]) < 0) {
				innerPermute(temArr.concat(arr[i]));
			}
		}
	}([]));

	return permuteArr;
}

describe('Rebuilder::', function () {
	it('debug', function () {
		const list = [
			{ id: 'unit:1', parentId: 'unit:5', attributes: {} },
			// { id: 'unit:4', parentId: 'unit:6', attributes: {} },
			{ id: 'unit:5', parentId: 'unit:6', attributes: {} },
			{ id: 'unit:2', parentId: 'unit:5', attributes: {} },
			{ id: 'unit:6', parentId: '', attributes: {} },
			// { id: 'unit:3', parentId: 'unit:4', attributes: {} },
		];

		// const all = permute(list);

		// all.forEach(list => {
		const repository = Repository(['unit']);
		const rebuilder = Rebuilder(repository);

		list.forEach(nodeData => rebuilder.feed(nodeData));

		console.log(list.map(node => node.id[5]).join(', '));
		console.log(new XMLSerializer().serializeToString(repository.document));
		// });

	});

	it.only('all', function () {
		const list = [
			{ id: 'unit:1', parentId: 'unit:5', attributes: {} },
			{ id: 'unit:4', parentId: 'unit:6', attributes: {} },
			{ id: 'unit:5', parentId: 'unit:6', attributes: {} },
			{ id: 'unit:2', parentId: 'unit:5', attributes: {} },
			{ id: 'unit:6', parentId: '', attributes: {} },
			{ id: 'unit:3', parentId: 'unit:4', attributes: {} },
		];

		const all = permute(list);

		all.forEach(list => {
			const repository = Repository(['unit']);
			const rebuilder = Rebuilder(repository);

			list.forEach(nodeData => rebuilder.feed(nodeData));

			console.log(list.map(node => node.id[5]).join(', '));
			console.log(new XMLSerializer().serializeToString(repository.document));
		});

	});
});