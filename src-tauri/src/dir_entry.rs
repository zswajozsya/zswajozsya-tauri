use std::time::UNIX_EPOCH;

use serde::Serialize;

use crate::file_type::FileType;

#[derive(Serialize)]
pub(crate) struct DirEntry {
    file_name: String,
    file_type: FileType,
    size: u64,
    created: u64,
    modified: u64,
}

impl From<std::fs::DirEntry> for DirEntry {
    fn from(value: std::fs::DirEntry) -> Self {
        let metadata = value.metadata().unwrap();
        DirEntry {
            file_name: value.file_name().into_string().unwrap(),
            file_type: value.file_type().unwrap().into(),
            size: metadata.len(),
            created: metadata
                .created()
                .unwrap()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
            modified: metadata
                .modified()
                .unwrap()
                .duration_since(UNIX_EPOCH)
                .unwrap()
                .as_secs(),
        }
    }
}