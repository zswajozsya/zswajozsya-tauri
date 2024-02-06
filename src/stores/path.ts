import { defineStore } from "pinia";
import { ReadDirRes, getHomeDir, readDir } from "../tauri";
import { DirEntry, Zswajozsya } from "../types";
import { parsePath, stringifyPath } from "../utils";
import { message } from "@tauri-apps/api/dialog";

type State =
  | {
    path: null;
    entries: null;
    zswajozsya: null;
  }
  | {
    path: string[];
    entries: {
      selected: boolean;
      entry: DirEntry;
    }[];
    zswajozsya: null | Zswajozsya,
  };

export const usePathStore = defineStore("path", {
  state: () => {
    return {
      path: null,
      entries: null,
      zswajozsya: null
    } satisfies State as State;
  },
  actions: {
    async init() {
      let initialPage = localStorage.getItem("defaultPage");
      if (initialPage === null) {
        initialPage = await getHomeDir();
      }
      this.path = parsePath(initialPage);

      const res = await readDir(initialPage);
      const res2: ReadDirRes = res.match(
        (ok) => ok,
        (err) => {
          message(err, { type: "error" });
          return {
            entries: [],
            zswajozsya: null,
          };
        }
      );
      this.entries = res2.entries
        .sort((a, b) => {
          const a_is_dir = a.file_type == "Dir" || a.file_type == "SymlinkDir";
          const b_is_dir = b.file_type == "Dir" || b.file_type == "SymlinkDir";
          if (a_is_dir && !b_is_dir) {
            return -1;
          } else if (!a_is_dir && b_is_dir) {
            return 1;
          }
          return 0;
        })
        .map((e) => ({
          selected: false,
          entry: e,
        }));
        this.zswajozsya = res2.zswajozsya;
    },

    async goTo(url: string) {
      const res = await readDir(url);
      res.match(
        (ok) => {
          this.path = parsePath(url);
          this.entries = ok
            .entries
            .sort((a, b) => {
              const a_is_dir =
                a.file_type == "Dir" || a.file_type == "SymlinkDir";
              const b_is_dir =
                b.file_type == "Dir" || b.file_type == "SymlinkDir";
              if (a_is_dir && !b_is_dir) {
                return -1;
              } else if (!a_is_dir && b_is_dir) {
                return 1;
              }
              return 0;
            })
            .map((e) => ({
              selected: false,
              entry: e,
            }));
          this.zswajozsya = ok.zswajozsya;
        },
        (err) => message(err, { type: "error" })
      );
    },

    async goUp() {
      if (this.path === null) return;
      const newPath = this.path.slice(0, this.path.length - 1);
      const newUrl = stringifyPath(newPath);
      this.goTo(newUrl);
    },
  },
  getters: {
    unix: (state) => {
      if (state.path === null) {
        return null;
      }
      return state.path[0] === "/";
    },
    pathString: (state) => {
      if (state.path === null) return null;
      return stringifyPath(state.path);
    },
  },
});
