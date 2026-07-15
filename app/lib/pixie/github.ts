import { Octokit } from '@octokit/rest'

const OWNER = 'Aneri-18'
const REPO = 'sleekwealth'
const BRANCH = 'master'

function getOctokit(): Octokit {
  const auth = process.env.GITHUB_TOKEN
  if (!auth) throw new Error('GITHUB_TOKEN is not set')
  return new Octokit({ auth })
}

function isNotFoundError(err: unknown): boolean {
  return !!err && typeof err === 'object' && 'status' in err && (err as { status: unknown }).status === 404
}

async function getExistingSha(path: string): Promise<string | undefined> {
  const octokit = getOctokit()
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH })
    if (Array.isArray(data) || data.type !== 'file') throw new Error(`${path} is not a file`)
    return data.sha
  } catch (err) {
    if (isNotFoundError(err)) return undefined
    throw err
  }
}

export async function createOrUpdateFile(path: string, content: Buffer, message: string): Promise<void> {
  const octokit = getOctokit()
  const sha = await getExistingSha(path)
  try {
    await octokit.repos.createOrUpdateFileContents({
      owner: OWNER,
      repo: REPO,
      path,
      message,
      branch: BRANCH,
      content: content.toString('base64'),
      ...(sha ? { sha } : {}),
    })
  } catch (err) {
    if (err && typeof err === 'object' && 'status' in err && (err as { status: unknown }).status === 409) {
      // Stale sha (branch moved between read and write) — refetch and retry once.
      const freshSha = await getExistingSha(path)
      await octokit.repos.createOrUpdateFileContents({
        owner: OWNER,
        repo: REPO,
        path,
        message,
        branch: BRANCH,
        content: content.toString('base64'),
        ...(freshSha ? { sha: freshSha } : {}),
      })
      return
    }
    throw err
  }
}

export async function deleteFile(path: string, message: string): Promise<void> {
  const octokit = getOctokit()
  const sha = await getExistingSha(path)
  if (!sha) return
  await octokit.repos.deleteFile({ owner: OWNER, repo: REPO, path, message, branch: BRANCH, sha })
}

export async function listDirectory(path: string): Promise<string[]> {
  const octokit = getOctokit()
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH })
    if (!Array.isArray(data)) return []
    return data.filter((entry) => entry.type === 'file').map((entry) => entry.name)
  } catch (err) {
    if (isNotFoundError(err)) return []
    throw err
  }
}

export async function getFileContent(path: string): Promise<string | undefined> {
  const octokit = getOctokit()
  try {
    const { data } = await octokit.repos.getContent({ owner: OWNER, repo: REPO, path, ref: BRANCH })
    if (Array.isArray(data) || data.type !== 'file' || !data.content) return undefined
    return Buffer.from(data.content, 'base64').toString('utf-8')
  } catch (err) {
    if (isNotFoundError(err)) return undefined
    throw err
  }
}
