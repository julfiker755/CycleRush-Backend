export const fileName = (filePath: string) => {
  return filePath.split('/').pop() ?? '';
};