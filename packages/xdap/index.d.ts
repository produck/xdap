declare namespace XDAP {
	type XPath = string;
	type ElementAttributes = object;

	type Schema = string[];

	interface ISchema {
		define(tagName: string, schema: Schema): void;
	}

	interface IOperation {

		move(origin: XPath, target: XPath): Promise<SearchResult>;


		modify(selector: XPath, elementAttributes: ElementAttributes): Promise<SearchResult>;


		add(selector: XPath, tagName: string, elementAttributes: ElementAttributes): Promise<SearchResult>;


		search(selector: XPath): Promise<SearchResult[]>;


		delete(selector: XPath): Promise<SearchResult[]>;


		compare(selector: XPath, elementAttributes): Promise<boolean>;
	}

	interface SearchResult {

	}

	interface Options {

	}

	namespace Store {
		interface ElementContext {
			tagName: any;
			id: any;
			parent: any;
			attributes: any;
		}

		interface NodeReader {

		}
	}

	interface Store {
		open(): Promise<void>;
		write(context: Store.ElementContext): Promise<void>;
	}
}

interface XDAP {
	Schema: XDAP.ISchema;

	Operation: XDAP.IOperation;
}

declare function XmlDirectoryAccessServer(options: XDAP.Options): XDAP;

export = XmlDirectoryAccessServer;