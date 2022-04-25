import * as fs from 'node:fs';
import * as path from 'node:path';
import { outdent } from 'outdent';
import { test, describe, expect } from 'vitest';
import lionFixture from 'lion-fixture';
import { defaultConfigOptions } from '~/utils/config.js';
import { syncIndexFolders } from '~/utils/sync.js';

const { fixture } = lionFixture(import.meta.url);

describe('syncs index properly', async () => {
	test('syncs with extensions', async () => {
		const extensionsTempDir = await fixture('my-project', 'extensions');

		await syncIndexFolders({
			...defaultConfigOptions,
			exportExtensions: true,
			indexExtension: '.js',
			folders: ['.', 'folder'],
			cwd: extensionsTempDir,
			verbose: true,
		});

		const indexJs = fs.readFileSync(
			path.join(extensionsTempDir, 'index.js'),
			'utf8'
		);

		expect(indexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);

		const folderIndexJs = fs
			.readFileSync(path.join(extensionsTempDir, 'folder/index.js'))
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
		const withoutExtensionsTempDir = await fixture('my-project', 'without-extensions');

		await syncIndexFolders({
			...defaultConfigOptions,
			exportExtensions: false,
			indexExtension: '.js',
			folders: ['.', 'folder'],
			cwd: withoutExtensionsTempDir,
		});

		const indexJs = fs.readFileSync(
			path.join(withoutExtensionsTempDir, 'index.js'),
			'utf8'
		);
		expect(indexJs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file';
				export * from './file2';
				export * from './folder';
			`
		);
	});

	test('respects the indexExtension property', async () => {
		const indexExtensionTempDir = await fixture('my-project', 'index-extension');

		await syncIndexFolders({
			...defaultConfigOptions,
			exportExtensions: true,
			indexExtension: '.ts',
			folders: ['.', 'folder'],
			cwd: indexExtensionTempDir,
		});

		const indexTs = fs.readFileSync(
			path.join(indexExtensionTempDir, 'index.ts'),
			'utf8'
		);
		expect(indexTs).toBe(
			outdent({ trimTrailingNewline: false })`
				export * from './file.js';
				export * from './file2.js';
				export * from './folder/index.js';
			`
		);
	});

	test('auto mode works', async () => {
		const autoModeTempDir = await fixture('my-project', 'auto-mode');

		await syncIndexFolders({
			...defaultConfigOptions,
			exportExtensions: true,
			indexExtension: 'auto',
			folders: ['.', 'folder'],
			cwd: autoModeTempDir,
		});

		const folderIndexTs = fs
			.readFileSync(path.join(autoModeTempDir, 'folder/index.ts'))
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
