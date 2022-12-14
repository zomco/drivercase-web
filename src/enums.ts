export enum CaseStatus {
  WAITING = "WAITING",
  COMMENT = "COMMENT",
  TEMPLATE = "TEMPLATE",
  APPROVED = "APPROVED",
}

export enum UserStatus {
  UNCERTAIN = "UNCERTAIN",
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
}

export enum ContactStatus {
  REGISTER = "REGISTER",
  CONFIRMED = "CONFIRMED",
  REJECTED = "REJECTED",
  UNCERTAIN = "UNCERTAIN"
}

export enum MediaFileSource {
  USER_COMPANY = "USER_COMPANY",
  USER_OPERATOR = "USER_OPERATOR",
  USER_REPRESENTATIVE = "USER_REPRESENTATIVE",
  CASE = "CASE",
}

export enum CaseVisibility {
  PRIVATE = "PRIVATE",
  PUBLIC = "PUBLIC",
  AUTHORIZE = "AUTHORIZE",
}

export enum CaseSource {
  USER = "USER",
  ADMIN = "ADMIN",
}
