export type DirEntry = {
    file_name: string,
    file_type: 'Dir' | 'File' | 'SymlinkDir' | 'SymlinkFile',
    size: number,
    created: number,
    modified: number,
}