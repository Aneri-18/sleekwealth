// One-time local setup: prompts for the Pixie admin username/password and
// prints the .env.local lines to paste in. Nothing here is sent anywhere.
import bcrypt from 'bcryptjs'
import readline from 'node:readline/promises'
import { stdin, stdout } from 'node:process'

const rl = readline.createInterface({ input: stdin, output: stdout })

const username = await rl.question('Pixie username: ')
const password = await rl.question('Pixie password: ')
rl.close()

if (!username.trim() || !password.trim()) {
  console.error('\nUsername and password cannot be empty.')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

console.log('\nAdd these two lines to .env.local:\n')
console.log(`ADMIN_USERNAME=${username.trim()}`)
console.log(`ADMIN_PASSWORD_HASH=${hash}`)
