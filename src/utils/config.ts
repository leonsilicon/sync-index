import process from 'node:process';
import { packageDirectory } from 'pkg-dir';
import { cosmiconfig } from 'cosmiconfig';
import type { SyncIndexConfig, SyncIndexOptions } from '~/types/options.js';

export const defaultConfigOptions: SyncIndexOptions = {
	folders: [],
	watch: false,
	skipInitial: false,
	verbose: false,
	exportExtensions: true,
	indexExtension: 'auto',
	fileExtensionsToSync: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
	cwd: process.cwd(),
};

export async function getConfig(): Promise<SyncIndexConfig> {
	const searchDir = await packageDirectory();
	const explorer = cosmiconfig('sync-index', {
		stopDir: searchDir,
	});

	const results = await explorer.search(searchDir);
	let config = results?.config as SyncIndexConfig;

	if (Array.isArray(config)) {
		config = config.map((conf) => ({
			...defaultConfigOptions,
			...conf,
		}));
	} else {
		config = {
			...defaultConfigOptions,
			...config,
		};
	}

	return config;
}
