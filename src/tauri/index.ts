import { invoke } from '@tauri-apps/api'
import { DirEntry } from '../types';

export async function getHomeDir() {
    return invoke('get_home_dir') as Promise<string>;
}

export async function readDir(path: string) {
    return invoke('read_dir', { path }) as Promise<Array<DirEntry>>;
}