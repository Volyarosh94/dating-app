export const ErrorMessagesEnum = {
  AUTH: {
    INVALID_TOKEN: 'Invalid token',
    INVALID_CREDENTIALS: 'Invalid credentials',
    TOKEN_NOT_FOUND: 'Token not found',
    OTP_SENT: 'Verification code sent!',
  },
  USER: {
    CREDENTIAL_EXISTS: 'User with given credentials already exists',
    NOT_FOUND: 'User not found',
  },
  OTP: {
    INVALID_OTP: 'Invalid otp code',
    OTP_EXPIRED: 'Otp code expired',
  },
  SCHEDULE: {
    BUSY_TIME: 'You have another schedule in this time',
    NOT_FOUND: 'Date schedule not found',
    EXPIRED: 'Schedule time date expired',
  },
  COMMON: {
    PERMISSION_DENIED: 'Permission denied',
  },
  CALL: {
    NOT_FOUND: 'Call not found',
    EXISTS: 'Call for schedule exists',
  },
};
