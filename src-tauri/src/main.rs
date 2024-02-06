// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod dir_entry;
mod file_type;

use std::path::PathBuf;

use dir_entry::DirEntry;
use serde::Serialize;
use zswajozsya::Directory;

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn get_home_dir() -> PathBuf {
    home::home_dir().unwrap()
}

#[derive(Serialize)]
struct ReadDirRes {
    entries: Vec<DirEntry>,
    zswajozsya: Option<Directory>,
}

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
    let entries: Vec<DirEntry> = entries.into_iter().map(|e| e.into()).collect();

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![
            get_home_dir,
            read_dir,
            init_dir,
            set_dir
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
