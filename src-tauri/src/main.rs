// Prevents additional console window on Windows in release, DO NOT REMOVE!!
#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

mod dir_entry;
mod file_type;

use std::{cmp::Ordering, path::PathBuf};

use dir_entry::{GenDirEntry, ZswDirEntry};
use serde::Serialize;
use zswajozsya::{Directory, Label};

type DirRequest = Directory;

#[derive(Serialize)]
enum DirResponse {
    Zsw {
        entries: Vec<ZswDirEntry>,
        labels: Vec<Label>,
    },
    Gen {
        entries: Vec<GenDirEntry>,
    },
}

// Learn more about Tauri commands at https://tauri.app/v1/guides/features/command
#[tauri::command]
fn read_dir(path: &str) -> Result<DirResponse, String> {
    // std::fs::read_dir(path)?;
    let read_dir = match std::fs::read_dir(path) {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };
    let entries = match read_dir.collect::<Result<Vec<std::fs::DirEntry>, _>>() {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };
    let entries = entries
        .into_iter()
        .filter(|e| e.file_name() != ".zswajozsya.ron");

    let directory = match zswajozsya::get(path) {
        Ok(v) => v,
        Err(err) => return Err(err.to_string()),
    };

    Ok(match directory {
        Some(directory) => {
            let mut entries = entries
                .map(|e1| {
                    let name = e1.file_name().into_string().unwrap();
                    ZswDirEntry {
                        file_name: name.clone(),
                        file_type: e1.file_type().unwrap().into(),
                        size: e1.metadata().unwrap().len(),
                        labels: match directory.entries.iter().find(|e2| e2.name == name) {
                            Some(e2) => e2.labels.clone(),
                            None => directory
                                .labels
                                .iter()
                                .map(|e| vec![false; e.options.len()])
                                .collect(),
                        },
                    }
                })
                .collect::<Vec<ZswDirEntry>>();

            entries.sort_unstable_by(|a, b| {
                a.file_name
                    .to_ascii_lowercase()
                    .cmp(&b.file_name.to_ascii_lowercase())
            });
            entries.sort_by(|a, b| {
                let a = &a.labels;
                let b = &b.labels;
                assert_eq!(a.len(), b.len());
                for i in 0..a.len() {
                    assert_eq!(a[i].len(), b[i].len());
                    for j in 0..a[i].len() {
                        match (a[i][j], b[i][j]) {
                            (true, true) => continue,
                            (true, false) => return Ordering::Less,
                            (false, true) => return Ordering::Greater,
                            (false, false) => continue,
                        }
                    }
                }
                Ordering::Equal
            });
            DirResponse::Zsw {
                entries,
                labels: directory.labels,
            }
        }
        None => {
            let mut entries = entries.map(|e| e.into()).collect::<Vec<GenDirEntry>>();
            entries.sort_unstable_by(|a, b| {
                a.file_name
                    .to_ascii_lowercase()
                    .cmp(&b.file_name.to_ascii_lowercase())
            });
            entries.sort_by(|a, b| {
                use file_type::FileType::*;
                match (&a.file_type, &b.file_type) {
                    (Dir, Dir) => Ordering::Equal,
                    (Dir, File) => Ordering::Less,
                    (File, Dir) => Ordering::Greater,
                    (File, File) => Ordering::Equal,
                }
            });
            DirResponse::Gen { entries }
        }
    })
}

#[tauri::command]
fn set_dir(path: &str, dir: DirRequest) -> Result<(), String> {
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
            set_dir,
            open_path
        ])
        .run(tauri::generate_context!())
        .expect("error while running tauri application");
}
