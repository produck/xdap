'use strict';

const { DOMParser } = require('xmldom');
const xpath = require('xpath');
const utils = require('./src/utils');

module.exports = function XmlDirectoryAccessServer(factory, store, server) {
	const context = {
		definition: {
			tags: {},
			objectClasses: {},
			restrictions: {}
		},
		tags: {},
		store: {},
		document: new DOMParser().parseFromString('<repository />')
	};

	const ISchema = Object.freeze({
		objectClass(name, attributes) {
			if (name in context.definition.objectClasses) {
				throw new Error(`Duplicated object class definition "${name}"`);
			}

			context.definition.objectClasses[name] = attributes;
		},
		tag(name, objectClasses) {
			if (name in context.definition.tags) {
				throw new Error(`Duplicated element tag definition "${name}"`);
			}

			utils.assertObjectClasses(objectClasses);
			context.definition.tags[name] = objectClasses;
		}
	});

	factory(ISchema);
	store.open();

	function compile() {

	}

	function validateRestriction(currentTagName, parentTagName) {
		return Boolean(context.definition.restrictions[parentTagName][currentTagName]);
	}

	function querySelectorAll(selector, thisNode = context.document) {
		return xpath.select(selector, thisNode);
	}

	function querySelector(selector, thisNode = context.document) {
		return xpath.select1(selector, thisNode);
	}

	return Object.freeze({
		async move(currentNodeId, parentNodeId) {
			const current = utils.resolveNodeId(currentNodeId);
			const parent = utils.resolveNodeId(parentNodeId);

		},
		async modify(currentNodeId, attributes) {

		},
		async add(currentNodeId, parentNodeId, attributes) {
			const current = utils.resolveNodeId(currentNodeId);
			const parent = utils.resolveNodeId(parentNodeId);

			if (!validateRestriction(current.tagName, parent.tagName)) {
				throw new Error(`A "${current.tagName}" can NOT be a child of a "${parent.tagName}".`);
			}

			const parentNode = querySelector(parent.selector);

			if (!parentNode) {
				throw new Error(`The parent node <${parent.tagName} id="${parent.id}" /> is NOT existed.`);
			}

			const existedNode = querySelector(current.selector);

			if (existedNode) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> has been existed.`);
			}

			const currentNode = context.document.createElement(current.tagName);

			//TODO validate attributes key, value.


			for (const name in attributes) {
				currentNode.setAttribute(name, attributes[name]);
			}

			parentNode.appendChild(currentNode);
		},
		async search(selector) {
			return querySelectorAll(selector);
		},
		async delete(currentNodeId) {
			const current = utils.resolveNodeId(currentNodeId);
			const currentNode = querySelector(current.selector);

			if (!currentNode) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> is NOT existed.`);
			}

		},
		compare() {

		}
	});
};