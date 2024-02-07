import { DirEntry } from "../types";

export function parsePath(path: string): string[] {
    if (path === '') return [];
    const splittedPath = path.split(path.startsWith('/') ? '/' : '\\');
    if (splittedPath[splittedPath.length - 1] === '') {
        splittedPath.pop()
    }
    return splittedPath;
}

export function stringifyPath(path: string[]): string {
    return path[0] === '' ?
        // Unix
        `${path.join('/')}/` :
        // Windows
        `${path.join('\\')}\\`;
}

export function stringifySize(size: number): string {
    if (size < 1024) {
        return `${size} B`;
    }
    const kb = size / 2 ** 10;
    if (kb < 1000) {
        return `${kb.toPrecision(3)} KB`
    } else if (kb < 1024) {
        return `${kb.toFixed(0)} KB`
    }
    const mb = size / 2 ** 20;
    if (mb < 1000) {
        return `${mb.toPrecision(3)} MB`
    } else if (mb < 1024) {
        return `${mb.toFixed(0)} MB`
    }
    const gb = size / 2 ** 30;
    return `${gb.toPrecision(3)} GB`
}

export function sortEntries(
    entries: DirEntry[],
    zsw_entries: {
        filename: string,
        labels: boolean[][],
    }[] | undefined
): DirEntry[] {
    if (zsw_entries === undefined) {
        return entries
            .sort((a, b) => {
                const a_is_dir =
                    a.file_type == "Dir" || a.file_type == "SymlinkDir";
                const b_is_dir =
                    b.file_type == "Dir" || b.file_type == "SymlinkDir";
                if (a_is_dir && !b_is_dir) {
                    return -1;
                } else if (!a_is_dir && b_is_dir) {
                    return 1;
                }
                return 0;
            });
    }
    return entries.map(entry => ({
        file_name: entry.file_name,
        file_type: entry.file_type,
        size: entry.size,
        labels: zsw_entries.find((zsw_entry => zsw_entry.filename === entry.file_name))?.labels
    })).sort(({ labels: a }, { labels: b }) => {
        if (a === undefined && b === undefined) return 0;
        if (a === undefined) return 1;
        if (b === undefined) return -1;

        console.assert(a.length === b.length);
        for (let i = 0; i < a.length; i += 1) {
            console.assert(a[i].length === b[i].length);
            for (let j = 0; j < a[i].length; j += 1) {
                if (a[i][j] === b[i][j]) continue;
                return a[i][j] ? -1 : 1;
            }
        }
        return 0;
    }).map(entry => ({
        file_name: entry.file_name,
        file_type: entry.file_type,
        size: entry.size,
    }));
}