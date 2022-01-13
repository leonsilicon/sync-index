import * as path from 'node:path';
import * as fs from 'node:fs';
import { getMatchedFolders } from './folders.js';
import { debug } from '~/utils/index.js';
import type { SyncIndexOptions } from '~/types/options.js';

export async function syncIndex(options: SyncIndexOptions, entryPath: string) {
	debug(`syncIndex() called with ${entryPath}`);
	const folder = entryPath.endsWith('.ts')
		? path.dirname(entryPath)
		: entryPath;
	const indexTs = path.join(folder, 'index.ts');
	debug(`index.ts path to sync: ${indexTs}`);

	if (!fs.existsSync(indexTs)) {
		debug(`creating ${indexTs}`);
		await fs.promises.writeFile(indexTs, '');
	}

	debug(`reading ${folder}`);
	const files = await fs.promises.readdir(folder);
	files.sort((f1, f2) => (f1 === f2 ? 0 : f1 < f2 ? -1 : 1));

	debug(`sorted file exports: ${JSON.stringify(files)}`);

	const exports = files
		.filter((file) => file !== 'index.ts')
		.map((file) => {
			const entryName = path.parse(file).name;
			const filePath = path.join(folder, file);
			return fs.statSync(filePath).isDirectory()
				? `export * from './${entryName}/index.js';`
				: `export * from './${entryName}.js';`;
		})
		.join('\n');

	debug(`exports string: ${exports}`);

	await fs.promises.writeFile(indexTs, exports + '\n');
}

export async function syncIndexFolders(options: SyncIndexOptions) {
	const folders = await getMatchedFolders(options);
	await Promise.all(folders.map(async (dir) => syncIndex(options, dir)));
}
