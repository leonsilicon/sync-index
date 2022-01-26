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

	debug(`reading ${folder}`);
	const files = await fs.promises.readdir(folder);
	files.sort((f1, f2) => (f1 === f2 ? 0 : f1 < f2 ? -1 : 1));

	let indexExtension;
	if (options.indexExtension === 'auto') {
		const extensionCount: Record<string, number> = {};
		let mostCommonExtension: { ext: string; count: number } = {
			ext: '.js',
			count: 0,
		};
		for (const file of files) {
			const filePath = path.join(folder, file);
			const isDir = fs.statSync(filePath).isDirectory();
			if (isDir) continue;

			const fileExt = path.parse(file).ext;
			if (!options.fileExtensionsToSync.includes(fileExt)) continue;

			extensionCount[fileExt] = (extensionCount[fileExt] ?? 0) + 1;
			if (extensionCount[fileExt]! > mostCommonExtension.count) {
				mostCommonExtension = { count: extensionCount[fileExt]!, ext: fileExt };
			}
		}

		debug(`most common extension: ${mostCommonExtension.ext}`);
		indexExtension = mostCommonExtension.ext.slice(1);
	} else {
		const normalizedIndexExtension = options.indexExtension.startsWith('.')
			? options.indexExtension.slice(1)
			: options.indexExtension;
		indexExtension = normalizedIndexExtension;
	}

	const indexFile = path.join(folder, `index.${indexExtension}`);

	debug(`index file path to sync: ${indexFile}`);

	if (!fs.existsSync(indexFile)) {
		debug(`creating ${indexFile}`);
		await fs.promises.writeFile(indexFile, '');
	}

	debug(`sorted file exports: ${JSON.stringify(files)}`);

	const exports = files
		.filter((file) => file !== 'index.ts' && file !== 'index.js')
		.filter((file) => {
			const filePath = path.join(folder, file);
			const fileExt = path.parse(file).ext;
			const isDir = fs.statSync(filePath).isDirectory();
			return isDir || options.fileExtensionsToSync.includes(fileExt);
		})
		.map((file) => {
			const entryName = path.parse(file).name;
			const filePath = path.join(folder, file);
			const isDir = fs.statSync(filePath).isDirectory();
			if (isDir) {
				return options.exportExtensions
					? `export * from './${entryName}/index.js';`
					: `export * from './${entryName}';`;
			} else {
				if (options.exportExtensions) {
					const { ext: origExt } = path.parse(file);
					const ext = origExt === '.ts' ? '.js' : origExt;
					return `export * from './${entryName}${ext}';`;
				} else {
					return `export * from './${entryName}';`;
				}
			}
		})
		.join('\n');

	debug(`exports string: ${exports}`);

	await fs.promises.writeFile(indexFile, exports + '\n');
}

export async function syncIndexFolders(options: SyncIndexOptions) {
	const folders = await getMatchedFolders(options);
	await Promise.all(folders.map(async (dir) => syncIndex(options, dir)));
}
