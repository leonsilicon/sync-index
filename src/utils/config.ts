import { packageDirectory } from 'pkg-dir';
import { cosmiconfig } from 'cosmiconfig';
import type { SyncIndexOptions } from '~/types/options.js';

export async function getConfigOptions(): Promise<SyncIndexOptions> {
	const searchDir = await packageDirectory();
	const explorer = cosmiconfig('sync-index', {
		stopDir: searchDir,
	});
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const { config } = (await explorer.search(searchDir)) ?? {};

	// eslint-disable-next-line @typescript-eslint/no-unsafe-return
	return config as SyncIndexOptions;
}
