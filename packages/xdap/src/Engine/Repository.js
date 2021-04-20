'use strict';

const { DOMParser } = require('xmldom');
const xpath = require('xpath');

exports.Repository = function Repository(tagNameList) {
	const context = {
		document: new DOMParser().parseFromString('<repository />'),
		index: {}
	};

	tagNameList.map(tagName => context.index[tagName] = {});
	Object.freeze(context.index);

	return {
		get document() {
			return context.document;
		},
		querySelectorAll(selector, thisNode = context.document) {
			return xpath.select(selector, thisNode);
		},
		querySelector(selector, thisNode = context.document) {
			return xpath.select1(selector, thisNode);
		},
		findById(tagName, id) {
			const element = context.index[tagName][id];

			return element ? element : null;
		},
		appendIndex(tagName, id, element) {
			context.index[tagName][id] = element;
		},
		removeIndex(tagName, id) {
			delete context.index[tagName][id];
		}
	};
};
