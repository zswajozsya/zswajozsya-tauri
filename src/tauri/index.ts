import { invoke } from '@tauri-apps/api'
import { DirEntry } from '../types';
import { Result } from '../libs/result';

export async function getHomeDir() {
    return invoke('get_home_dir') as Promise<string>;
}

export async function readDir(path: string): Promise<Result<Array<DirEntry>, string>> {
    try {
        const value = await invoke('read_dir', { path }) as Array<DirEntry>;
        return Result.ok(value);
    } catch (err) {
        return Result.err(err as string)
    }
}