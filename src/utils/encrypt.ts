import bcrypt from 'bcrypt';
export const hashpassword = (password: string): string => {
  return bcrypt.hashSync(password, 10);
};

export const comparePassword = async (
  db_password: string,
  password: string,
): Promise<boolean> => {
  return await bcrypt.compare(password, db_password);
};