'use strict';

const ATTRIBUTE_NAME_REG = /^[a-z][a-z0-9-]+\??$/;

exports.assertAttributes = function isAttributes(attributes) {
	if (!Array.isArray(attributes)) {
		throw TypeError('The `attributes` MUST be a string[].');
	}

	attributes.forEach((name, index) => {
		if (!ATTRIBUTE_NAME_REG.test(name)) {
			throw new TypeError(`Invalid attributes[${index}], ${name}.`);
		}
	});
};

const OBJECT_CLASS_NAME_REG = /./;

exports.assertObjectClasses = function isObjectClasses(objectClasses) {
	if (!Array.isArray(objectClasses)) {
		throw TypeError('The `attributes` MUST be a string[].');
	}

	objectClasses.forEach((name, index) => {
		if (!OBJECT_CLASS_NAME_REG.test(name)) {
			throw new TypeError(`Invalid objectClasses[${index}], ${name}.`);
		}
	});
};

exports.resolveNodeId = function resolveNodeId(idString) {
	const [tagName, id] = idString.trim().split(':');

	return { tagName, id, selector: `//${tagName}[@id=${id}]` };
};
