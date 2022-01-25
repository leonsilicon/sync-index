export type SyncIndexOptions = {
	folders: string[];
	watch: boolean;
	skipInitial: boolean;
	verbose: boolean;
	exportExtensions: boolean;
	indexExtension: string;
	syncedFileExtensions: string[];
	cwd: string;
};
