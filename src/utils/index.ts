export function parsePath(path: string): string[] {
    if (path === '') return [];
    if (path.startsWith('/')) {
        const restPath = path.substring(1, path.length);
        return restPath === '' ? ['/'] : ['/', ...restPath.split('/')];
    } else {
        return path.split('\\')
    }
}

export function stringifyPath(path: string[]): string {
    return path[0] === '/' ?
        // Unix
        `/${path.slice(1, path.length).join('/')}` :
        // Windows
        path.join('\\');
}

export function stringifySize(size: number): string {
    if (size < 10000) {
        return `${size} B`;
    }
    const kb = size >> 10;
    if (kb < 10000) {
        return `${kb} KB`
    }
    const mb = size >> 20;
    return `${mb} MB`
}