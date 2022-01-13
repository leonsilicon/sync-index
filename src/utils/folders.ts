import { globby } from 'globby';
import type { SyncIndexOptions } from '~/types/options';

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

	return folders.flat();
}
