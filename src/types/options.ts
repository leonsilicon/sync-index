type MaybeArray<T> = T | T[];

export type SyncIndexOptions = {
	folders: string[];
	watch: boolean;
	skipInitial: boolean;
	verbose: boolean;
	exportExtensions: boolean;
	indexExtension: string;
	fileExtensionsToSync: string[];
	cwd: string;
};

export type SyncIndexConfig = MaybeArray<SyncIndexOptions>;
