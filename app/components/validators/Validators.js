export const PATTERN_NAME = /^[a-zA-Z ]+$/;
export const PATTERN_DOB = /\d{1,2}\/\d{1,2}\/\d{4}/;
export const PATTERN_EMAIL = /\S+@\S+\.\S+/;
export const PATTERN_PASSWORD = /^.{6,}$/;
export const PATTERN_PHONE = /^(\+\d{1,3}[- ]?)?\d{11}$/;
export const PATTERN_SMS_CODE = /\d{4}/;
export const PATTERN_CARD_NUMBER = /\d{4} \d{4} \d{4} \d{4}/;
export const PATTERN_CARD_EXPIRE_DATE = /\d{2}\/\d{2}/;
export const PATTERN_CARD_CVV = /\d{3}/;
export const PATTERN_FULLNAME = /^$|^[a-zA-ZčČćĆđĐšŠžŽ-]+ [a-zA-ZčČćĆđĐšŠžŽ-]+$/;

export const PATTERN_USERNAME = /^[a-zA-Z][a-zA-Z0-9_]{6,15}$/;
export const PATTERN_EMAIL_USERNAME = /(^[a-zA-Z][a-zA-Z0-9]{5,15}$)|(^\S+@\S+\.\S+$)/;

export const NameValidator = (value) => {
  return RegExpValidator(PATTERN_NAME, value);
};

export const EmailUsernameValidator = (value) => {
  return RegExpValidator(PATTERN_EMAIL_USERNAME, value);
};

export const UsernameValidator = (value) => {
  return RegExpValidator(PATTERN_USERNAME, value);
};

export const DOBValidator = (value) => {
  return RegExpValidator(PATTERN_DOB, value);
};

export const EmailValidator = (value) => {
  return RegExpValidator(PATTERN_EMAIL, value);
};

export const ConfirmPasswordValidator = (pass, cpass) => {
  return pass === cpass;
};

export const PasswordValidator = (value) => {
  return RegExpValidator(PATTERN_PASSWORD, value);
};

export const PhoneNumberValidator = (value) => {
  return RegExpValidator(PATTERN_PHONE, value);
};

export const SMSCodeValidator = (value) => {
  return RegExpValidator(PATTERN_SMS_CODE, value);
};

export const CardNumberValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_NUMBER, value);
};

export const ExpirationDateValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_EXPIRE_DATE, value);
};

export const CvvValidator = (value) => {
  return RegExpValidator(PATTERN_CARD_CVV, value);
};

export const CardholderNameValidator = (value) => {
  return RegExpValidator(PATTERN_FULLNAME, value);
};

export const StringValidator = (value) => {
  return !!value && value.length > 0;
};

const RegExpValidator = (regexp, value) => {
  return regexp.test(value);
};
