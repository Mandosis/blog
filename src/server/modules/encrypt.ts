import * as winston from 'winston';
import * as bcrypt from 'bcrypt';

const SALT_WORK_FACTOR: number = 10; // Don't go past 25

export function EncryptPassword(password): string {
  let salt = bcrypt.genSaltSync(SALT_WORK_FACTOR);

  return bcrypt.hashSync(password, salt);
};

export function ComparePassword(candidate, stored) {
  return bcrypt.compareSync(candidate, stored);
}
