export function parsePath(path: string): string[] {
    if (path === '') return [];
    if (path.startsWith('/')) {
        const restPath = path.substring(1, path.length);
        return restPath === '' ? ['/'] : ['/', ...restPath.split('/')];
    } else {
        const restPath = path.substring(3, path.length);
        return restPath === '' ? [path[0]] : [path[0], ...restPath.split('\\')]
    }
}