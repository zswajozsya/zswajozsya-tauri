// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod dir_entry;
mod file_type;

use std::path::PathBuf;

use dir_entry::DirEntry;
use serde::Serialize;
use zswajozsya::Directory;

#[derive(Serialize)]
struct ReadDirRes {
    entries: Vec<DirEntry>,
    zswajozsya: Option<Directory>,
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn read_dir(path: &str) -> Result<ReadDirRes, String> {
    let read_dir = match std::fs::read_dir(path) {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };
    let entries = match read_dir.collect::<Result<Vec<std::fs::DirEntry>, _>>() {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };
    let entries: Vec<DirEntry> = entries
        .into_iter()
        .filter(|e| e.file_name() != ".zswajozsya.ron")
        .map(|e| e.into())
        .collect();

    let directory = match zswajozsya::get(path) {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };

    Ok(ReadDirRes {
        entries,
        zswajozsya: directory,
    })
}

#[tauri::command]
fn init_dir(path: &str) {
    zswajozsya::init(path).unwrap();
}

#[tauri::command]
fn set_dir(path: &str, dir: Directory) -> Result<(), String> {
    match zswajozsya::set(path, dir) {
        Ok(_) => Ok(()),
        Err(err) => Err(err.to_string()),
    }
}

#[derive(Serialize)]
struct CommonPaths {
    user_dir: PathBuf,
    desktop_dir: Option<PathBuf>,
    download_dir: Option<PathBuf>,
    document_dir: Option<PathBuf>,
    image_dir: Option<PathBuf>,
    video_dir: Option<PathBuf>,
    audio_dir: Option<PathBuf>,
    disks: Vec<PathBuf>,
}

#[tauri::command]
fn get_common_paths() -> CommonPaths {
    CommonPaths {
        user_dir: dirs::home_dir().unwrap(),
        desktop_dir: dirs::desktop_dir(),
        download_dir: dirs::download_dir(),
        document_dir: dirs::document_dir(),
        image_dir: dirs::picture_dir(),
        video_dir: dirs::video_dir(),
        audio_dir: dirs::audio_dir(),
        disks: sysinfo::Disks::new_with_refreshed_list()
            .into_iter()
            .map(|disk| disk.mount_point().to_path_buf())
            .collect(),
    }
}

#[tauri::command]
fn open_path(path: PathBuf) {
    open::that(path).unwrap()
}

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_common_paths,
            read_dir,
            init_dir,
            set_dir,
            open_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
