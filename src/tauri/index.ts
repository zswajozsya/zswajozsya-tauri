import { invoke } from '@tauri-apps/api'
import { CommonPaths, DirEntry, Zswajozsya } from '../types';
import { Result } from '../libs/result';

export async function getCommonPaths() {
    return invoke('get_common_paths') as Promise<CommonPaths>;
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

export async function setDir(path: string, dir: Zswajozsya): Promise<Result<void, string>> {
    try {
        await invoke('set_dir', { path, dir });
        return Result.ok(undefined);
    } catch (err) {
        return Result.err(err as string)
    }
}

export async function openPath(path: string) {
    return invoke('open_path', { path }) as Promise<void>;
}

