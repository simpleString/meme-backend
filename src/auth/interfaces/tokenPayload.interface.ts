export interface IRefreshTokenPayload {
  userId: string;
}

export interface IAccessTokenPayload {
  userId: string;
  refreshTokenId: string;
}
