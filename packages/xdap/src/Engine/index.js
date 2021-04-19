'use strict';

const Descriptor = require('./Descriptor');
const { Repository, resolveNodeId } = require('./Repository');

module.exports = function XMLDirectoryAccessEngine(definitionObject, store) {
	const Definition = Descriptor(definitionObject);
	const listOfTagName = Object.keys(Definition);
	const repository = Repository(listOfTagName);

	return Object.freeze({
		async open() {
			const document = repository.document;

			const cache = {
				free: {},
				mounted: {
					'': document.documentElement
				}
			};

			await store.open(nodeData => {
				const { id, attributes, parentId } = nodeData;
				const current = resolveNodeId(id);
				const element = document.createElement(current.tagName);

				const isParentMounted = cache.mounted[parentId];
				const parentElement = isParentMounted
					? cache.mounted[parentId]
					: cache.free[parentId];

				if (parentElement) {
					parentElement.appendChild(element);
				} else {
					if (cache.free[parentId]) {
						cache.free[parentId] = {};
					}

					cache.free[parentId][id] = element;
				}

				const freeChildMap = cache.free[id];

				if (freeChildMap) {
					for (const childId in freeChildMap) {
						element.appendChild(freeChildMap[childId]);
					}

					delete cache.free[id];
				}
			});
		},
		async search(selector) {
			return repository.querySelectorAll(selector);
		},
		async add(currentNodeId, parentNodeId, attributes) {
			const current = resolveNodeId(currentNodeId);
			const parent = resolveNodeId(parentNodeId);

			if (!Definition[parent.tagName].isParentOf(current.tagName)) {
				throw new Error(`A "${current.tagName}" can NOT be a child of a "${parent.tagName}".`);
			}

			const currentElement = repository.findById(currentNodeId);

			if (currentElement !== null) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> has been existed.`);
			}

			const parentElement = repository.findById(parentNodeId);

			if (!parentElement) {
				throw new Error(`The parent node <${parent.tagName} id="${parent.id}" /> is NOT existed.`);
			}

			if (!Definition[current.tagName].validateAttribute(attributes)) {
				throw new Error('Invalid attributes.');
			}

			try {
				await store.write();
			} catch (err) {

			}

			const elementAttributes = Object.assign({ id: current.id }, attributes);
			const element = repository.document.createElement(current.tagName);

			for (const name in elementAttributes) {
				element.setAttribute(name, attributes[name]);
			}

			repository.appendIndex(current.tagName, current.id, element);

			return 0;
		},
		async delete(currentNodeId) {
			const current = resolveNodeId(currentNodeId);
			const currentElement = repository.findById(currentNodeId);

			if (!currentElement) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> is NOT existed.`);
			}

			try {
				await store.write();
			} catch (err) {

			}

			currentElement.parent.removeChild(currentElement);

			return 0;
		},
		async modify(currentNodeId, attributes) {
			const current = resolveNodeId(currentNodeId);
			const currentElement = repository.findById(currentNodeId);

			if (!currentElement) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> is NOT existed.`);
			}

			if (!Definition[current.tagName].validateAttribute(attributes)) {
				throw new Error('Invalid attributes.');
			}

			try {
				await store.write();
			} catch (err) {

			}

			for (const name in attributes) {
				currentElement.setAttribute(name, attributes[name]);
			}

		},
	});
};
