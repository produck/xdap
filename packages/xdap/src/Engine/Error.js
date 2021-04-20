'use strict';

const ERROR = {
	ADDING_NO_SUCH_PARENT: {
		code: 0x11
	},
	ADDING_DUPLICATED: {
		code: 0x12
	},
	ADDING_INVALID_PARENT_TYPE: {
		code: 0x13
	},
	ADDING_INVALID_ATTRIBUTES: {
		code: 0x14
	},
	ADDING_STORE_FAILED: {
		code: 0x15
	},

	SEARCHING_INVALID_XPATH: {
		code: 0x21
	},

	DELETING_NO_SUCH_ELEMENT: {
		code: 0x31
	},
	DELETING_STORE_FAILED: {
		code: 0x32
	},

	MODIFYING_NO_SUCH_ELEMENT: {
		code: 0x41
	},
	MODIFYING_INVALID_ATTRIBUTES: {
		code: 0x42
	},
	MODIFYING_STORE_FAILED: {
		code: 0x43
	},

	MOVING_NO_SUCH_PARENT: {
		code: 0x51
	},
	MOVING_NO_SUCH_ELEMENT: {
		code: 0x52
	},
	MOVING_CIRCULAR_REFERENCE: {
		code: 0x53
	},
	MOVING_STORE_FAILED: {
		code: 0x54
	}
};

module.exports = function ErrorMessage(symbol, messageObject) {

};
