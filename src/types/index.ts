export type GenDirEntry = {
    file_name: string,
    file_type: 'Dir' | 'File',
    size: number,
    labels: undefined
}

export type ZswDirEntry = {
    file_name: string,
    file_type: 'Dir' | 'File',
    size: number,
    labels: boolean[][]
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

export type CommonPaths = {
    user_dir: string,
    desktop_dir: string | null,
    download_dir: string | null,
    document_dir: string | null,
    image_dir: string | null,
    video_dir: string | null,
    audio_dir: string | null,
    disks: string[],
}