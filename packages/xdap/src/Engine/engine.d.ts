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
}