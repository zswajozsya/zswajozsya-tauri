export type DirEntry = {
    file_name: string,
    file_type: 'Dir' | 'File' | 'SymlinkDir' | 'SymlinkFile',
    size: number,
    created: number,
    modified: number,
}

export type Zswajozsya = {
    files: {
        filename: string,
        labels: boolean[][],
    }[],
    labels: Label[],
}

export type Label = {
    name: string,
    desc: string,
    color: string,
    options: {
        name: string,
        desc: string,
    }[],
}