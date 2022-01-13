import * as path from 'node:path';
import * as fs from 'node:fs';
import { getMatchedFolders } from './folders.js';
import type { SyncIndexOptions } from '~/types/options';

export async function syncIndex(options: SyncIndexOptions, entryPath: string) {
	const folder = entryPath.endsWith('.ts')
		? path.dirname(entryPath)
		: entryPath;
	const indexTs = path.join(folder, 'index.ts');

	if (!fs.existsSync(indexTs)) {
		await fs.promises.writeFile(indexTs, '');
	}

	const files = await fs.promises.readdir(folder);
	files.sort((f1, f2) => (f1 === f2 ? 0 : f1 < f2 ? -1 : 1));
	const exports = files
		.filter((file) => file !== 'index.ts')
		.map((file) => `export * from './${path.parse(file).name}';`)
		.join('\n');
	await fs.promises.writeFile(indexTs, exports + '\n');
}

export async function syncIndexFolders(options: SyncIndexOptions) {
	const folders = await getMatchedFolders(options);
	await Promise.all(folders.map(async (dir) => syncIndex(options, dir)));
}
