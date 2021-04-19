'use strict';

const utils = require('./src/utils');

module.exports = function XmlDirectoryAccessServer(definition, store, server) {


	factory(descriptor);
	descriptor.close();

	return Object.freeze({
		async open() {
			store.open();
		},
		async move(currentNodeId, parentNodeId) {
			const current = utils.resolveNodeId(currentNodeId);
			const parent = utils.resolveNodeId(parentNodeId);

			const currentNode = querySelector(current.selector);

			if (!currentNode) {
				throw new Error('The moving node is NOT existed.');
			}

			const parentNode = querySelector(parent.selector);

			if (!parentNode) {
				throw new Error('The parent node moving to is NOT existed.');
			}

			// Circular reference checking
			await context.store.write();
			currentNode.parentNode.removeChild(currentNode);
			parentNode.appendChild(currentNode);
		},
		async modify(currentNodeId, attributes) {
			const current = utils.resolveNodeId(currentNodeId);

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