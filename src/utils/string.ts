

export const PASSWORD_REGEXP = /^(?=.*[0-9])(?=.*[a-zA-Z])(?!.* ).{8,16}$/;

export const USERNAME_REGEXP = /^(?=[a-zA-Z0-9._]{5,10}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

export const COMPANY_NAME_REGEXP = /^[\u4e00-\u9fa5（）\da-zA-Z&]{5,50}$/gi;

export const COMPANY_CODE_REGEXP = /^([0-9A-HJ-NPQRTUWXY]{2}\d{6}[0-9A-HJ-NPQRTUWXY]{10}|[1-9]\d{14})$/;

export const MOBILE_REGEXP = /^1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}$/;

export const LANDLINE_REGEXP = /^\d{3}-\d{7,8}|\d{4}-\d{7,8}$/;

export const PHONE_NUMBER_REGEXP = /^1(?:3\d{3}|5[^4\D]\d{2}|8\d{3}|7(?:[235-8]\d{2}|4(?:0\d|1[0-2]|9\d))|9[0-35-9]\d{2}|66\d{2})\d{6}|\d{3}-\d{7,8}|\d{4}-\d{7,8$/;

export const PERSON_NAME_REGEXP = /^[\u4E00-\u9FA5]{2,6}$/;

export const PERSON_CODE_REGEXP = /^([1-6][1-9]|50)\d{4}(18|19|20)\d{2}((0[1-9])|10|11|12)(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/;