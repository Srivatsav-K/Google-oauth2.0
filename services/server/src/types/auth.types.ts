export type AccessTokenData = {
  userId: string;
};

export type RefreshTokenData = {
  userId: string;
  refreshTokenVersion?: number;
};
