import { globby } from 'globby';
import type { SyncIndexOptions } from '~/types/options';
import { debug } from '~/utils/index.js';

export async function getMatchedFolders(options: SyncIndexOptions) {
	const folders = await Promise.all([
		globby(options.folders, {
			onlyDirectories: true,
			expandDirectories: false,
		}),
		globby(options.folders, {
			onlyDirectories: true,
			expandDirectories: true,
		}),
	]);

	debug(`matched folders: ${JSON.stringify(folders)}`);

	return folders.flat();
}
