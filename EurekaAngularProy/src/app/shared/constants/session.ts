export const loginResultStatus = {
  success: 1,
  notRegistered: 2,
  errorCredentials: 3,
  userBlocked: 4,
  userInactive: 5,
};

export type loginResultType = keyof typeof loginResultStatus;
