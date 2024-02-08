use std::os::windows::fs::FileTypeExt;

use serde::Serialize;

#[derive(Serialize)]
pub(crate) enum FileType {
    Dir,
    File,
}

impl From<std::fs::FileType> for FileType {
    fn from(value: std::fs::FileType) -> Self {
        if value.is_dir() || value.is_symlink_dir() {
            FileType::Dir
        } else {
            FileType::File
        }
    }
}
