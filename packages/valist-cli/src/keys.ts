import keytar from 'keytar';
import * as inquirer from 'inquirer';

export async function select() {
  const credentials = await keytar.findCredentials('VALIST')
  if (credentials.length === 0) {
    throw new Error('no accounts found. use import to add an account.')
  }

  const { account } = await inquirer.prompt([{
    name: 'account',
    message: 'select an account',
    type: 'list',
    choices: credentials.map(c => ({ name: c.account, value: c.password })),
  }]);

  return account
}