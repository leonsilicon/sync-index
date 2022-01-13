import { program } from 'commander';
import { createSyncIndexWatcher } from './watch.js';
import { syncIndexFolders } from './sync.js';
import { getConfigOptions } from './config.js';
import type { SyncIndexOptions } from '~/types/options';

export async function syncIndexCli() {
	program
		.version('1.0.0')
		.description('Sync your index.ts files')
		.name('sync-index')
		.showHelpAfterError()
		.argument('-f, --folders', 'The folders to sync (as globs)')
		.option(
			'-w, --watch',
			'Set up a sync-index watcher to auto-create and auto-update index.ts files'
		)
		.option(
			'-s, --skip-initial',
			"Don't automatically run once when the watcher is started"
		);

	program.parse();

	const configOptions = getConfigOptions();
	// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
	const options: SyncIndexOptions = {
		...configOptions,
		...program.opts<SyncIndexOptions>(),
	};

	if (options.watch) {
		await createSyncIndexWatcher(options);
	}

	if (!options.skipInitial) {
		await syncIndexFolders(options);
	}
}
