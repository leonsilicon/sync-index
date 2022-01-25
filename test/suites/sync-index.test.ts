import * as fs from 'node:fs';
import process from 'node:process';
import * as path from 'node:path';
import { outdent } from 'outdent';
import { defaultConfig } from '~/utils/config.js';
import { syncIndexFolders } from '~/utils/sync.js';

const mkdirpTemp = (tempFolder: string) => {
	const folderPath = path.join('temp', tempFolder);
	fs.mkdirSync(folderPath, { recursive: true });
	fs.cpSync('fixtures/my-project', folderPath, { recursive: true });
	return folderPath;
};

describe('syncs index properly', () => {
	beforeAll(() => {
		process.chdir('test');
		fs.rmSync('temp', { recursive: true, force: true });
	});

	test('syncs with extensions', async () => {
		const folder = mkdirpTemp('extensions');

		await syncIndexFolders({
			...defaultConfig,
			exportExtensions: true,
			indexExtension: '.js',
			folders: ['.', 'folder'],
			cwd: folder,
			verbose: true,
		});

		const indexJs = fs.readFileSync(path.join(folder, 'index.js')).toString();

		expect(indexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);

		const folderIndexJs = fs
			.readFileSync(path.join(folder, 'folder/index.js'))
			.toString();

		expect(folderIndexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file1.js';
				export * from './file2.js';
				export * from './file3.js';
			`
		);
	});

	test('syncs without extensions', async () => {
		const folder = mkdirpTemp('without-extensions');

		await syncIndexFolders({
			...defaultConfig,
			exportExtensions: false,
			indexExtension: '.js',
			folders: ['.', 'folder'],
			cwd: folder,
		});

		const indexJs = fs.readFileSync(path.join(folder, 'index.js')).toString();
		expect(indexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file';
				export * from './file2';
				export * from './folder';
			`
		);
	});

	test('respects the indexExtension property', async () => {
		const folder = mkdirpTemp('index-extension');

		await syncIndexFolders({
			...defaultConfig,
			exportExtensions: true,
			indexExtension: '.ts',
			folders: ['.', 'folder'],
			cwd: folder,
		});

		const indexTs = fs.readFileSync(path.join(folder, 'index.ts')).toString();
		expect(indexTs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);
	});

	test('auto mode works', async () => {
		const folder = mkdirpTemp('auto-mode');

		await syncIndexFolders({
			...defaultConfig,
			exportExtensions: true,
			indexExtension: 'auto',
			folders: ['.', 'folder'],
			cwd: folder,
		});

		const folderIndexTs = fs
			.readFileSync(path.join(folder, 'folder/index.ts'))
			.toString();

		expect(folderIndexTs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file1.js';
				export * from './file2.js';
				export * from './file3.js';
			`
		);
	});
});
