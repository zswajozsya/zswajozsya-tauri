import { invoke } from "@tauri-apps/api";
import { CommonPaths, GenDirEntry, Label, ZswDirEntry } from "../types";
import { Result } from "../libs/result";

export async function getCommonPaths() {
  return invoke("get_common_paths") as Promise<CommonPaths>;
}

export type DirRequest = {
  entries: {
    name: string;
    labels: boolean[][];
  }[];
  labels: Label[];
};

type ZswDirResponse = {
  entries: ZswDirEntry[];
  labels: Label[];
};

type GenDirResponse = {
  entries: GenDirEntry[];
  labels: undefined;
};

export type DirResponse = ZswDirResponse | GenDirResponse;

export async function readDir(
  path: string
): Promise<Result<DirResponse, string>> {
  try {
    const value = (await invoke("read_dir", { path })) as
      | { Zsw: ZswDirResponse }
      | { Gen: GenDirResponse };
    return Result.ok("Zsw" in value ? value.Zsw : value.Gen);
  } catch (err) {
    return Result.err(err as string);
  }
}

export async function setDir(
  path: string,
  dir: DirRequest
): Promise<Result<void, string>> {
  try {
    await invoke("set_dir", { path, dir });
    return Result.ok(undefined);
  } catch (err) {
    return Result.err(err as string);
  }
}

export async function openPath(path: string) {
  return invoke("open_path", { path }) as Promise<void>;
}
