use serde::Serialize;

use crate::file_type::FileType;

#[derive(Serialize)]
pub(crate) struct GenDirEntry {
    pub(crate) file_name: String,
    pub(crate) file_type: FileType,
    size: u64,
}

impl From<std::fs::DirEntry> for GenDirEntry {
    fn from(value: std::fs::DirEntry) -> Self {
        GenDirEntry {
            file_name: value.file_name().into_string().unwrap(),
            file_type: value.file_type().unwrap().into(),
            size: value.metadata().unwrap().len(),
        }
    }
}

#[derive(Serialize)]
pub(crate) struct ZswDirEntry {
    pub(crate) file_name: String,
    pub(crate) file_type: FileType,
    pub(crate) size: u64,
    pub(crate) labels: Vec<Vec<bool>>,
}
