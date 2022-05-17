import { execaCommandSync as exec } from 'execa';
import { chProjectDir, rmDist, copyPackageFiles } from 'lionconfig';

chProjectDir(import.meta.url);
rmDist();
exec('tsc');
exec('tsc-alias');
await copyPackageFiles();
