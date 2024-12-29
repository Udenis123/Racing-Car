// storage.ts
export const savePlayerData = (email: string, nickname: string, level: number) => {
  const playerData = { nickname, level };
  localStorage.setItem(email, JSON.stringify(playerData));
};

export const getPlayerData = (email: string) => {
  const data = localStorage.getItem(email);
  return data ? JSON.parse(data) : null;
};

export const clearPlayerData = (email: string) => {
  localStorage.removeItem(email);
};