declare namespace Engine {
	namespace Definition {
		type ObjectClassSchema = string;
		type ObjectClassName = string;

		interface ObjectClassSchemaMap {
			[objectClassName: string]: ObjectClassSchema[];
		}

		interface TagSchemaMap {
			[tagName: string]: ObjectClassName[];
		}

		interface ValidChildTagMap {
			[childTagName: string]: true;
		}

		interface RestrictionMap {
			[parentTagName: string]: ValidChildTagMap;
		}
	}

	export interface Definition {
		objectClass: Definition.ObjectClassSchemaMap;
		tags: Definition.TagSchemaMap;
		restrictions: Definition.RestrictionMap
	}

	interface ElementId {
		id: string;
		tagName: string;
	}

	interface AttributeObject {
		[key: string]: string;
	}

	namespace Store {
		type method = 'add' | 'move' | 'modify' | 'delete';

		interface ElementObject {
			tagName: string;
			id: string;
			attributes: AttributeObject;
		}
	}

	interface Store {
		open(reader: () => {}): Promise<void>;
		write(method: Store.method, currentObject: Store.ElementObject, parentId?: ElementId): Promise<void>;
	}

	type XPathString = string;
}

interface Engine {
	open(): Promise<void>;
	search(selector: Engine.XPathString): Promise<void>;
	add(currentId: Engine.ElementId, parentId: Engine.ElementId, attributes: Engine.AttributeObject): Promise<void>;
	delete(currentId: Engine.ElementId): Promise<void>;
	modify(currentId: Engine.ElementId, attributes: Engine.AttributeObject): Promise<void>;
	move(currentId: Engine.ElementId, parentId: Engine.ElementId): Promise<void>;
}

declare function XMLDirectoryAccessEngine(definitionObject: Engine.Definition, store: Engine.Store): Engine;

export = XMLDirectoryAccessEngine;
