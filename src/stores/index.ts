import { defineStore } from 'pinia'
import { getHomeDir } from '../tauri';
import { parsePath } from '../utils';

export const useUrlStore = defineStore('page_stack', {
    state: () => {
        const defaultPage = localStorage.getItem('defaultPage');
        if (defaultPage !== null) {
            return {
                value: parsePath(defaultPage),
            };
        } else {
            return {
                value: null,
            }
        }
    },
    actions: {
        async init() {
            if (this.value === null) {
                const homeDir = await getHomeDir();
                this.value = parsePath(homeDir) as any;
            }
        },
    },
    getters: {
        unix: (state) => {
            if (state.value === null) {
                return null;
            }
            return state.value[0] === '/'
        },
        path: (state) => {
            if (state.value === null) return null;
            if (state.value[0] === '/') {
                return `/${state.value.slice(1, state.value.length).join('/')}`
            } else {
                return state.value.join('\\')
            }
        }
    }
})
