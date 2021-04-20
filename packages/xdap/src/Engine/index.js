'use strict';

const Descriptor = require('./Descriptor');
const { Repository } = require('./Repository');
const Rebuilder = require('./Rebuilder');

function isParentOf(parentElement, childElement) {
	while (childElement.parent) {
		const currentParent = childElement.parent;

		if (currentParent === parentElement) {
			return true;
		}

		childElement = currentParent;
	}

	return false;
}

function resolveNodeId(idString) {
	const [tagName, id] = idString.split(':');

	return { tagName: tagName.trim(), id: id.trim() };
}

module.exports = function XMLDirectoryAccessEngine(definitionObject, store) {
	const Definition = Descriptor(definitionObject);
	const listOfTagName = Object.keys(Definition);
	const repository = Repository(listOfTagName);

	return Object.freeze({
		async open() {
			const rebuilder = Rebuilder(repository);

			await store.open(nodeData => rebuilder.feed(nodeData));
			rebuilder.finish();
		},
		async search(selector) {
			return repository.querySelectorAll(selector);
		},
		async add(currentId, parentId, attributes) {
			const current = resolveNodeId(currentId);
			const parent = resolveNodeId(parentId);

			if (!Definition[parent.tagName].isParentOf(current.tagName)) {
				throw new Error(`A "${current.tagName}" can NOT be a child of a "${parent.tagName}".`);
			}

			const currentElement = repository.findById(current.tagName, current.id);

			if (currentElement !== null) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> has been existed.`);
			}

			const parentElement = repository.findById(parent.tagName, parent.id);

			if (!parentElement) {
				throw new Error(`The parent node <${parent.tagName} id="${parent.id}" /> is NOT existed.`);
			}

			if (!Definition[current.tagName].validateAttribute(attributes)) {
				throw new Error('Invalid attributes.');
			}

			try {
				await store.write('add', {
					tagName: current.tagName,
					id: current.id,
					attributes: {},
				}, {
					tagName: parent.tagName,
					id: parent.id
				});
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
		async delete(currentId) {
			const current = resolveNodeId(currentId);
			const currentElement = repository.findById(current.tagName, current.id);

			if (!currentElement) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> is NOT existed.`);
			}

			try {
				await store.write('delete', {
					tagName: current.tagName,
					id: current.id,
					attributes: {},
				});
			} catch (err) {

			}

			currentElement.parent.removeChild(currentElement);

			return 0;
		},
		async modify(currentId, attributes) {
			const current = resolveNodeId(currentId);
			const currentElement = repository.findById(current.tagName, current.id);

			if (!currentElement) {
				throw new Error(`The node <${current.tagName} id="${current.id}" /> is NOT existed.`);
			}

			if (!Definition[current.tagName].validateAttribute(attributes)) {
				throw new Error('Invalid attributes.');
			}

			try {
				await store.write('modify', {
					tagName: current.tagName,
					id: current.id,
					attributes: {},
				});
			} catch (err) {

			}

			for (const name in attributes) {
				currentElement.setAttribute(name, attributes[name]);
			}

		},
		async move(currentId, parentId) {
			const current = resolveNodeId(currentId);
			const parent = resolveNodeId(parentId);

			const currentElement = repository.findById(current.tagName, current.id);

			if (!currentElement) {
				throw new Error('The moving node is NOT existed.');
			}

			const parentElement = repository.findById(parent.tagName, parent.id);

			if (!parentElement) {
				throw new Error('The parent node moving to is NOT existed.');
			}

			if (isParentOf(currentElement, parentElement)) {
				throw new Error ('circular');
			}

			try {
				await store.write('move', {
					tagName: current.tagName,
					id: current.id,
					attributes: {},
				}, {
					tagName: parent.tagName,
					id: parent.id
				});
			} catch (err) {

			}

			currentElement.parentNode.removeChild(currentElement);
			parentElement.appendChild(currentElement);
		}
	});
};
