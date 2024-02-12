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
      filter: null;
    }
  | {
      path: string[];
      directory:
        | {
            entries: GenDirEntry[];
            labels: undefined;
            filter: undefined;
          }
        | {
            entries: ZswDirEntry[];
            labels: Label[];
            filter: {
              name: string,
              desc: string,
              index: [number, number]
            }[];
          };
      selected_entry: null | string;
      common_paths: CommonPaths;
    };

export const usePathStore = defineStore("path", {
  state: () => {
    return {
      path: null,
      directory: null,
      selected_entry: null,
      common_paths: null,
      filter: null,
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
        (ok) =>
          ok.labels === undefined
            ? {
                entries: ok.entries,
                labels: undefined,
                filter: undefined,
              }
            : {
                entries: ok.entries,
                labels: ok.labels,
                filter: [],
              },
        (err) => {
          message(err, { type: "error" });
          return {
            entries: [],
            labels: undefined,
            filter: undefined,
          };
        }
      );
    },

    async goTo(url: string) {
      const res = await readDir(url);
      res.match(
        (ok) => {
          this.path = parsePath(url);
          this.selected_entry = null;
          this.directory =
            ok.labels !== undefined
              ? {
                  entries: ok.entries,
                  labels: ok.labels,
                  filter: [],
                }
              : {
                  entries: ok.entries,
                  labels: undefined,
                  filter: undefined,
                };
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
