/* eslint-disable prettier/prettier */
/* eslint-disable import/prefer-default-export */
export const dateFormatter = (time: number) => {
  const date = new Date(time);
  return `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
};
