export function parsePath(path: string): string[] {
    if (path === '') return [];
    if (path.startsWith('/')) {
        const restPath = path.substring(1, path.length);
        return restPath === '' ? ['/'] : ['/', ...restPath.split('/')];
    } else {
        return path.split('\\')
    }
}