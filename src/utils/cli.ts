import process from 'node:process';
import { program } from 'commander';
import globalDebug from 'debug';
import { createSyncIndexWatcher } from './watch.js';
import { syncIndexFolders } from './sync.js';
import { getConfigOptions } from './config.js';
import { debug } from '~/utils/index.js';
import type { SyncIndexOptions } from '~/types/options';

export async function syncIndexCli() {
	program
		.version('1.0.0')
		.description('Sync your index.ts files')
		.name('sync-index')
		.showHelpAfterError()
		.option('-v, --verbose', 'verbose mode')
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

	if (options.verbose) {
		globalDebug.enable('sync-index');
	}

	debug(`Passed options: ${JSON.stringify(options)}`);
	if (!options.folders) {
		console.error('No folders were specified.\n');
		console.info(program.helpInformation());
		process.exit(1);
	}

	if (options.watch) {
		debug('watch option enabled');
		await createSyncIndexWatcher(options);
	}

	if (!options.skipInitial) {
		debug('skip initial option enabled');
		await syncIndexFolders(options);
	}
}
