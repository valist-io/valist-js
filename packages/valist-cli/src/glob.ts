import globby from 'globby';
import * as fs from 'node:fs';

export default async function * (patterns: string[]) {
  const cwd = process.cwd()

  for await (const source of globby.stream(patterns)) {
    const path = source.toString().replace(cwd, '').replace(/\\/g, '/')
    const stat = await fs.promises.stat(source)
    const content = stat.isFile() ? fs.createReadStream(source) : undefined

    // path or content must be defined
    if (path === '' && content === undefined) continue

    yield {
      path: path,
      content: content,
      mode: stat.mode,
      mtime: stat.mtime,
    }
  }
}
