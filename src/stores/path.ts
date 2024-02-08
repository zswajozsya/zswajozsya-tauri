import { defineStore } from "pinia";
import { getCommonPaths, readDir } from "../tauri";
import { CommonPaths, GenDirEntry, Label, ZswDirEntry } from "../types";
import { parsePath, stringifyPath } from "../utils";
import { message } from "@tauri-apps/api/dialog";

type State =
  | {
      path: null;
      directory: null;
      selected_entry: null;
      common_paths: null;
    }
  | {
      path: string[];
      directory:
        | {
            entries: GenDirEntry[];
            labels: undefined;
          }
        | {
            entries: ZswDirEntry[];
            labels: Label[];
          };
      selected_entry: null | number;
      common_paths: CommonPaths;
    };

export const usePathStore = defineStore("path", {
  state: () => {
    return {
      path: null,
      directory: null,
      selected_entry: null,
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
      this.directory = res.match(
        (ok) => ok,
        (err) => {
          message(err, { type: "error" });
          return {
            entries: [],
            labels: undefined,
          };
        }
      );
    },

    async goTo(url: string) {
      const res = await readDir(url);
      res.match(
        (ok) => {
          this.path = parsePath(url);
          this.directory = ok;
          this.selected_entry = null;
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
