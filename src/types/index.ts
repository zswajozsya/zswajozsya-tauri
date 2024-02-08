export type DirEntry = {
    file_name: string,
    file_type: 'Dir' | 'File',
    size: number,
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