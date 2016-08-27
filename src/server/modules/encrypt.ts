import * as winston from 'winston';
import * as bcrypt from 'bcrypt';
import * as Promise from 'bluebird';

const SALT_WORK_FACTOR: number = 10; // Don't go past 25

/**
 * Encrypts user passwords
 */
export function Encrypt(password) {
  return new Promise((resolve, reject) => {
    let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);
    let hash = bcrypt.hashSync(password, salt);
    resolve(hash);
  });
}

/**
 * Synchronous version of Encrypt
 */
export function EncryptSync(password): string {
  let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);

  return bcrypt.hashSync(password, salt);
};

export function ComparePassword(candidate, stored) {
  return bcrypt.compareSync(candidate, stored);
}
