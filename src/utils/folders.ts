import path from 'node:path/posix';
import { globby } from 'globby';
import type { SyncIndexOptions } from '~/types/options';
import { debug } from '~/utils/index.js';

export async function getMatchedFolders(options: SyncIndexOptions) {
	debug(`using cwd ${options.cwd} for globby`);

	const folders = await Promise.all([
		globby(options.folders, {
			onlyDirectories: true,
			expandDirectories: false,
			cwd: options.cwd,
		}),
		globby(options.folders, {
			onlyDirectories: true,
			expandDirectories: true,
			cwd: options.cwd,
		}),
	]);

	const matchedFolders = folders
		.flat()
		.map((folder) => path.join(options.cwd, folder));

	debug(`matched folders: ${JSON.stringify(matchedFolders)}`);

	return matchedFolders;
}
