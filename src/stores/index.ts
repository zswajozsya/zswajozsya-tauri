import { defineStore } from 'pinia'
import { getHomeDir } from '../tauri';

export const usePageStackStore = defineStore('page_stack', {
    state: () => {
        const defaultPage = localStorage.getItem('defaultPage');
        if (defaultPage !== null) {
            return { stack: [defaultPage] };
        }
        return { stack: null };
    },
    actions: {
        async init() {
            if (this.stack === null) {
                const homeDir = await getHomeDir();
                this.stack = [homeDir] as any;
            }
        },
    },
})
