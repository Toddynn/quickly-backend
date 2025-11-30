import { compare, hash } from 'bcrypt';

const SALT_ROUNDS = process.env.SALT_ROUNDS;

export async function hashPassword(password: string): Promise<string> {
     const hashedPassword = await hash(password, Number(SALT_ROUNDS));
     return hashedPassword;
}

export async function comparePassword(plainText: string, hash: string): Promise<boolean> {
     const isMatch = await compare(plainText, hash);
     return isMatch;
}