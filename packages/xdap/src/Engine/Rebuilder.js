'use strict';

function resolveNodeId(idString) {
	const [tagName, id] = idString.split(':');

	return { tagName: tagName.trim(), id: id.trim() };
}

module.exports = function DocuemntRebuilder(repository) {
	const document = repository.document;

	const cache = {
		free: {},
		families: {},
		mounted: {
			'': document.documentElement
		}
	};

	function createElement(id, attributes) {
		const current = resolveNodeId(id);
		const element = document.createElement(current.tagName);

		for (const name in attributes) {
			element.setAttribute(name, attributes[name]);
		}

		element.setAttribute('id', current.id);
		element.id = current.id;

		return element;
	}

	function feedNodeData({ id, attributes, parentId }) {
		const element = createElement(id, attributes);

		// About parent
		const parentElement = cache.mounted[parentId];

		if (parentElement) {
			parentElement.appendChild(element);
		} else {
			if (!cache.free[parentId]) {
				cache.free[parentId] = {};
			}

			cache.free[parentId][id] = element;
		}

		const familyMap = { [id]: element };

		// About children
		const freeChildMap = cache.free[id];

		if (freeChildMap) {
			for (const childId in freeChildMap) {
				element.appendChild(freeChildMap[childId]);
				Object.assign(familyMap, cache.families[childId]);
				delete cache.families[childId];
			}

			delete cache.free[id];
		}

		// About indexies
		if (parentElement) {
			Object.assign(cache.mounted, familyMap);
			repository.appendIndex(element.tagName, element.id, element);
		} else {
			cache.families[id] = familyMap;
		}
	}

	return {
		feed: feedNodeData,
		finish() {
			console.log(cache);
		}
	};
};
