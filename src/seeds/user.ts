import * as bcrypt from 'bcrypt';

export const users = [
  {
    username: 'DarkMaxime',
    mail: 'dark.maxime@mail.com',
    password: bcrypt.hashSync('Password123!', 10),
  },
  {
    username: 'DarkMarius',
    mail: 'dark.marius@mail.com',
    password: bcrypt.hashSync('Password456!', 10),
  },
];
