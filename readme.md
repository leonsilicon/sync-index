# SyncIndex

## Installation

```zsh
pnpm install -D sync-index
```

## Usage

### CLI

Create a sync-index.config.cjs file in the root of your project and then add the following config using folders you want to sync `index.ts` files with. For example:

```typescript
module.exports = {
	folders: ['src/utils', 'src/types'], // glob patterns are also supported
};
```

Then, you can run `sync-index` to automatically sync the `index.ts` files for the above folders:

```zsh
pnpm exec sync-index
```

You can also use `sync-index -w` to start a watcher that will automatically update the `index.ts` files when it detects changes made to files in the specified folders.

### Options

**folders (string[]):** The glob pattern of the folders/files to sync

**watch (boolean):** Whether to start sync-index in watch mode when the `sync-index` CLI is activated.

**skipInitial (boolean):** Whether to skip the initial sync (before any files are changed) when watch mode is turned on.

**verbose (boolean):** Whether or not verbose mode is turned on (default: false).

**exportExtensions (boolean):** Whether or not to add extensions to the exports in the `index.js` files (default: true).

**indexExtension (boolean):** The extension of the index file.

export const defaultConfig: SyncIndexOptions = {
	folders: [],
	watch: false,
	skipInitial: false,
	verbose: false,
	exportExtensions: true,
	indexExtension: '.ts',
	syncedFileExtensions: ['.js', '.jsx', '.ts', '.tsx', '.vue'],
};

### Programmatic Usage

```typescript
import { syncIndex } from 'sync-index';

await syncIndex({
	folders: ['src/utils', 'src/types'],
});
```