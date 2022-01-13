import process from 'node:process';
import chokidar from 'chokidar';
import { getMatchedFolders } from './folders.js';
import { syncIndex } from './sync.js';
import type { SyncIndexOptions } from '~/types/options';

export async function createSyncIndexWatcher(options: SyncIndexOptions) {
	const folders = await getMatchedFolders(options);
	chokidar
		.watch(folders.map((folder) => `${folder}/**/*.ts`))
		.on('all', async (event, entryPath) => {
			switch (event) {
				case 'add':
				case 'addDir':
				case 'change':
				case 'unlink': {
					await syncIndex(options, entryPath);
					break;
				}

				case 'unlinkDir': {
					break;
				}

				default:
					break;
			}
		});

	console.info('Watching files for changes...\n');

	// Prevents Node.js from exiting
	process.stdin.resume();
}
