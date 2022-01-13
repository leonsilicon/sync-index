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
  folders: ['src/utils', 'src/types'] // glob patterns are also supported
}
```

Then, you can run `sync-index` to automatically sync the `index.ts` files for the above folders:
```zsh
pnpm exec sync-index
```

You can also use `sync-index -w` to start a watcher that will automatically update the `index.ts` files when it detects changes made to files in the specified folders.

### Programmatic Usage

```typescript
import { syncIndex } from 'sync-index';

await syncIndex({
  folders: ['src/utils', 'src/types']
});
```

