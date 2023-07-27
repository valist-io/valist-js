import fs from 'graceful-fs';
import path from 'path';
import { Readable } from 'stream';

export type FileLike = Pick<File, 'stream' | 'name' | 'size'>;

export type FileObject = {
  name: string;
  stream: () => any;
  size: number | bigint;
}

function promisify<T, A extends unknown[]>(
  func: (...args: [...A, (error: unknown, result?: T) => void]) => void
): (...args: A) => Promise<T> {
  return (...args: A) =>
    new Promise<T>((resolve, reject) =>
      func(...args, (error: unknown, result?: T) => {
        if (error) {
          reject(error);
        } else {
          resolve(result!);
        }
      })
    );
}

const fsStat = promisify(fs.stat);
const fsReaddir = promisify(fs.readdir);

export async function filesFromPaths(paths: Iterable<string>, options: { hidden?: boolean } = {}) {
  let commonParts;
  const files = [];
  for (const p of paths) {
    for await (const file of filesFromPath(p, options)) {
      files.push(file)
      const nameParts = file.name.split(path.sep)
      if (commonParts == null) {
        commonParts = nameParts.slice(0, -1);
        continue;
      }
      for (let i = 0; i < commonParts.length; i++) {
        if (commonParts[i] !== nameParts[i]) {
          commonParts = commonParts.slice(0, i)
          break
        }
      }
    }
  }
  const commonPath = `${(commonParts ?? []).join('/')}/`
  return files.map(f => ({ ...f, name: f.name.slice(commonPath.length) }))
}

async function* filesFromPath(filepath: string, options: { hidden?: boolean } = {}) {
  filepath = path.resolve(filepath)
  const hidden = options.hidden ?? false

  const filter = (filepath: string) => {
    if (!hidden && path.basename(filepath).startsWith('.')) return false
    return true
  }

  const name = filepath
  const stat = await fsStat(name, {})

  if (!filter(name)) {
    return
  }

  if (stat.isFile()) {
    // @ts-expect-error node web stream not type compatible with web stream
    yield { name, stream: () => Readable.toWeb(fs.createReadStream(name)), size: stat.size }
  } else if (stat.isDirectory()) {
    yield* filesFromDir(name, filter)
  }
}


async function* filesFromDir(dir: string, filter: (name: string) => boolean): AsyncIterableIterator<FileLike> {
  const entries = await fsReaddir(path.join(dir), { withFileTypes: true })
  for (const entry of entries) {
    if (!filter(entry.name)) {
      continue
    }

    if (entry.isFile()) {
      const name = path.join(dir, entry.name)
      const { size } = await fsStat(name, {})
      // @ts-expect-error node web stream not type compatible with web stream
      yield { name, stream: () => Readable.toWeb(fs.createReadStream(name)), size }
    } else if (entry.isDirectory()) {
      yield* filesFromDir(path.join(dir, entry.name), filter)
    }
  }
}