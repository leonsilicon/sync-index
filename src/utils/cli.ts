import process from 'node:process';
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
		.option('-f, --folders', 'the folders to sync (as globs)')
		.option(
			'-w, --watch',
			'set up a sync-index watcher to auto-create and auto-update index.ts files'
		)
		.option(
			'-s, --skip-initial',
			"don't automatically run once when the watcher is started"
		);

	program.parse();

	const configOptions = await getConfigOptions();
	 
	const options: SyncIndexOptions = {
		...configOptions,
		...program.opts<SyncIndexOptions>(),
	};

	if (!options.folders) {
		console.error('No folders were specified.\n');
		console.info(program.helpInformation());
		process.exit(1);
	}

	if (options.watch) {
		await createSyncIndexWatcher(options);
	}

	if (!options.skipInitial) {
		await syncIndexFolders(options);
	}
}
