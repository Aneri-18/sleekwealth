import bcrypt from 'bcryptjs'

export function verifyCredentials(username: string, password: string): boolean {
  const expectedUsername = process.env.ADMIN_USERNAME
  const expectedHash = process.env.ADMIN_PASSWORD_HASH
  if (!expectedUsername || !expectedHash) {
    throw new Error('ADMIN_USERNAME / ADMIN_PASSWORD_HASH are not set — run scripts/hash-password.mjs')
  }
  const usernameMatch = username === expectedUsername
  const passwordMatch = bcrypt.compareSync(password, expectedHash)
  // TEMPORARY diagnostic — logs lengths/shape only, never actual values. Remove once login is confirmed working.
  console.log('[pixie-auth-debug]', {
    usernameMatch,
    passwordMatch,
    receivedUsernameLength: username.length,
    expectedUsernameLength: expectedUsername.length,
    receivedPasswordLength: password.length,
    expectedHashLength: expectedHash.length,
    expectedHashLooksValid: /^\$2[aby]\$\d{2}\$.{53}$/.test(expectedHash),
  })
  if (!usernameMatch) return false
  return passwordMatch
}
