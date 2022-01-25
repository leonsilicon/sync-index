import * as fs from 'node:fs';
import * as path from 'node:path';
import { defaultConfig } from '~/utils/config.js';
import { syncIndex } from '~/utils/sync.js';
import { outdent } from 'outdent';

const mkdirpTemp = (tempFolder: string) => {
	const folderPath = path.join('temp', tempFolder);
	fs.mkdirSync(folderPath, { recursive: true });
	fs.cpSync('fixtures/my-project', folderPath, { recursive: true });
	return folderPath;
};

describe('syncs index properly', () => {
	beforeAll(() => {
		process.chdir('test');
	});

	afterAll(() => {
		fs.rmSync('temp', { recursive: true, force: true });
	});

	test('syncs with extensions', async () => {
		const folder = mkdirpTemp('extensions');

		await syncIndex(
			{
				...defaultConfig,
				exportExtensions: true,
				indexExtension: '.js',
			},
			folder
		);

		const indexJs = fs.readFileSync(path.join(folder, 'index.js')).toString();

		expect(indexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);
	});

	test('syncs without extensions', async () => {
		const folder = mkdirpTemp('without-extensions');

		await syncIndex(
			{
				...defaultConfig,
				exportExtensions: false,
				indexExtension: '.js',
			},
			folder
		);

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

		await syncIndex(
			{
				...defaultConfig,
				exportExtensions: true,
				indexExtension: '.ts',
			},
			folder
		);

		const indexTs = fs.readFileSync(path.join(folder, 'index.ts')).toString();
		expect(indexTs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);
	});
});