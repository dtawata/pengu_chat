import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
  const hashedPassword = await hash(password, 12);
  return hashedPassword;
}

// export const comparePasswords = (hashed, password) {
//   const isValid = compare(hashed, compare);

// }

