import { defineStore } from "pinia";
import { ReadDirRes, getCommonPaths, readDir } from "../tauri";
import { CommonPaths, DirEntry, Zswajozsya } from "../types";
import { parsePath, sortEntries, stringifyPath } from "../utils";
import { message } from "@tauri-apps/api/dialog";

type State =
  | {
      path: null;
      entries: null;
      selected_entry: null;
      zswajozsya: null;
      common_paths: null;
    }
  | {
      path: string[];
      entries: DirEntry[];
      selected_entry: null | string;
      zswajozsya: null | Zswajozsya;
      common_paths: CommonPaths;
    };

export const usePathStore = defineStore("path", {
  state: () => {
    return {
      path: null,
      entries: null,
      selected_entry: null,
      zswajozsya: null,
      common_paths: null,
    } satisfies State as State;
  },
  actions: {
    async init() {
      let initialPage = localStorage.getItem("defaultPage");
      if (initialPage === null) {
        this.common_paths = await getCommonPaths();
        initialPage = this.common_paths.user_dir;
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
      this.entries = sortEntries(res2.entries, res2.zswajozsya?.files);
      this.zswajozsya = res2.zswajozsya;
    },

    async goTo(url: string) {
      const res = await readDir(url);
      res.match(
        (ok) => {
          this.path = parsePath(url);
          this.entries = sortEntries(ok.entries, ok.zswajozsya?.files);
          this.selected_entry = null;
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
