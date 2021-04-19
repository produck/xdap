'use strict';

function ElementAttributeValidator(attributeSchema) {
	return function validateAttribute(attributeObject) {
		for (const name in attributeSchema) {
			const required = ;

			if (attributeSchema[name]) {
				if (typeof attributeObject[name] !== 'string') {
					return false;
				}
			} else {
				if (typeof attributeObject[name] !== 'string' && required !== undefined) {
					return false;
				}
			}
		}

		return true;
	};
}

const SCHEMA = {
	OBJECT_CLASS_NAME: /./,
	ATTRIBUTE_DESCRIPTOR: /^([a-z][a-z0-9-]*)(\??)$/,
	TAG_NAME: /^([a-z][a-z0-9-]*)(\??)$/
};

module.exports = function Descriptor(definition) {
	const Map = {
		ObjectClass: {},
		Tag: {}
	};

	for (const objectClassName in definition.objectClasses) {
		const schema = definition.objectClasses[objectClassName];
		const attributeMap = Map.ObjectClass[objectClassName] = {};

		schema.forEach(attributeRule => {
			const [, name, notRequired] = attributeRule.match(SCHEMA.ATTRIBUTE_DESCRIPTOR);

			// It is TRUE if can not match '?'.
			attributeMap[name] = notRequired !== '?';
		});
	}

	for (const tagName in definition.tags) {
		const tagSchema = definition.tags[tagName];
		const attributeMap = {};

		tagSchema.forEach(objectClassName => {
			const schemaOfObjectClass = Map.ObjectClass[objectClassName];

			if (!schemaOfObjectClass) {
				throw new Error(`The object class "${objectClassName}" is NOT defined.`);
			}

			Map.Tag[tagName] = Object.assign(attributeMap, schemaOfObjectClass);
		});
	}

	const Description = {};

	for (const tagName in Map.Tag) {
		const mapOfChildTagName = Object.assign({}, definition.restrictions[tagName]);

		Description[tagName] = Object.freeze({
			validateAttribute: ElementAttributeValidator(Map.Tag[tagName]),
			isParentOf: childTagName => Boolean(mapOfChildTagName[childTagName])
		});
	}

	return Object.freeze(Description);
};
