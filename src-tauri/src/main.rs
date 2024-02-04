// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod dir_entry;
mod file_type;

use std::path::PathBuf;

use dir_entry::DirEntry;

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

fn main() {
    tauri::Builder::default()
        .invoke_handler(tauri::generate_handler![get_home_dir, read_dir])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
