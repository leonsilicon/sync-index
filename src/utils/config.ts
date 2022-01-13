import { packageDirectory } from 'pkg-dir';
import { cosmiconfig } from 'cosmiconfig';
import type { SyncIndexOptions } from '~/types/options.js';

export async function getConfigOptions(): Promise<Partial<SyncIndexOptions>> {
	const searchDir = await packageDirectory();
	const explorer = cosmiconfig('sync-index', {
		stopDir: searchDir,
	});

	const results = await explorer.search(searchDir);
	const config = results?.config as SyncIndexOptions;

	return config ?? {};
}
