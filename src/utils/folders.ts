import { globby } from 'globby';
import type { SyncIndexOptions } from '~/types/options';

export async function getMatchedFolders(options: SyncIndexOptions) {
	return globby(options.folders, { onlyDirectories: true });
}
