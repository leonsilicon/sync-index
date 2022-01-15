import process from 'node:process';
import chokidar from 'chokidar';
import pThrottle from 'p-throttle';
import { getMatchedFolders } from './folders.js';
import { syncIndex } from './sync.js';
import { debug } from './debug.js';
import type { SyncIndexOptions } from '~/types/options.js';

// Once every second
const throttle = pThrottle({ interval: 1000, limit: 1 });

export async function createSyncIndexWatcher(options: SyncIndexOptions) {
	const folders = await getMatchedFolders(options);
	const watchedPaths = folders.map((folder) => `${folder}/**/*.ts`);
	debug(`watching paths: ${JSON.stringify(watchedPaths)}`);
	chokidar.watch(watchedPaths).on(
		'all',
		throttle(async (event, entryPath) => {
			debug(`file event: ${JSON.stringify(event)}, file path: ${entryPath}`);

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
		})
	);

	console.info('Watching files for changes...\n');

	// Prevents Node.js from exiting
	process.stdin.resume();
}
