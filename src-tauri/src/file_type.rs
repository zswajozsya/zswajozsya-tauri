use std::os::windows::fs::FileTypeExt;

use serde::Serialize;

#[derive(Serialize)]
pub(crate) enum FileType {
    Dir,
    File,
    SymlinkDir,
    SymlinkFile,
}

impl From<std::fs::FileType> for FileType {
    fn from(value: std::fs::FileType) -> Self {
        if value.is_dir() {
            FileType::Dir
        } else if value.is_file() {
            FileType::File
        } else if value.is_symlink_dir() {
            FileType::SymlinkDir
        } else {
            FileType::SymlinkFile
        }
    }
}