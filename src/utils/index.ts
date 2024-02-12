export function parsePath(path: string): string[] {
  if (path === "") return [];
  const splittedPath = path.split(path.startsWith("/") ? "/" : "\\");
  if (splittedPath[splittedPath.length - 1] === "") {
    splittedPath.pop();
  }
  return splittedPath;
}

export function stringifyPath(
  path: string[],
  fileType: "Dir" | "File"
): string {
  return path[0] === ""
    ? // Unix
      path.join("/") + (fileType === "Dir" ? "/" : "")
    : // Windows
      path.join("\\") + (fileType === "Dir" ? "\\" : "");
}

export function stringifySize(size: number): string {
  if (size < 1024) {
    return `${size} B`;
  }
  const kb = size / 2 ** 10;
  if (kb < 1000) {
    return `${kb.toPrecision(3)} KB`;
  } else if (kb < 1024) {
    return `${kb.toFixed(0)} KB`;
  }
  const mb = size / 2 ** 20;
  if (mb < 1000) {
    return `${mb.toPrecision(3)} MB`;
  } else if (mb < 1024) {
    return `${mb.toFixed(0)} MB`;
  }
  const gb = size / 2 ** 30;
  return `${gb.toPrecision(3)} GB`;
}
