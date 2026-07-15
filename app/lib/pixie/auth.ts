import bcrypt from 'bcryptjs'

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedHash = process.env.ADMIN_PASSWORD_HASH
  if (!expectedUsername || !expectedHash) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set — run scripts/hash-password.mjs')
  }
  if (username !== expectedUsername) return false
  return bcrypt.compareSync(password, expectedHash)
}
