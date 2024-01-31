// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use std::{os::windows::fs::FileTypeExt, path::PathBuf, time::UNIX_EPOCH};

use serde::Serialize;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_home_dir() -> PathBuf {
    home::home_dir().unwrap()
}

#[tauri::command]
fn read_dir(path: &str) -> Result<Vec<DirEntry>, String> {
    match std::fs::read_dir(path) {
        Ok(read_dir) => Ok(read_dir.map(|e| e.unwrap().into()).collect()),
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Serialize)]
struct DirEntry {
    file_name: String,
    file_type: FileType,
    size: u64,
    created: u64,
    modified: u64,
}

#[derive(Serialize)]
enum FileType {
    Dir,
    File,
    SymlinkDir,
    SymlinkFile,
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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_home_dir, read_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
