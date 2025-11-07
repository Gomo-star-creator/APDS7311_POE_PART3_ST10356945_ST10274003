const bcrypt = require('bcrypt');

async function generateHash() {
  const password = 'Password123!'; // your desired password
  const saltRounds = 12;
  const hash = await bcrypt.hash(password, saltRounds);
  console.log(hash);
}

generateHash();
