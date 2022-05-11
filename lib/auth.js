import { hash, compare } from 'bcryptjs';

export const hashPassword = async (password) => {
  const hashed = hash(password);
}

export const comparePasswords = (hashed, password) {
  const isValid = compare(hashed, compare);

}

