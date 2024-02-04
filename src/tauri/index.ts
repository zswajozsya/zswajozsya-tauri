import { invoke } from '@tauri-apps/api'
import { DirEntry, Zswajozsya } from '../types';
import { Result } from '../libs/result';

export async function getHomeDir() {
    return invoke('get_home_dir') as Promise<string>;
}

export type ReadDirRes = {
    entries: Array<DirEntry>,
    zswajozsya: Zswajozsya | null,
}

export async function readDir(path: string): Promise<Result<ReadDirRes, string>> {
    try {
        const value = await invoke('read_dir', { path }) as ReadDirRes;
        return Result.ok(value);
    } catch (err) {
        return Result.err(err as string)
    }
}

export async function initDir(path: string) {
    return invoke('init_dir', { path }) as Promise<void>;
}
