import { invoke } from '@tauri-apps/api'

export async function getHomeDir() {
    return invoke('get_home_dir') as Promise<string>;
}