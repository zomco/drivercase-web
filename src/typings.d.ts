declare module '*.css';
declare module '*.less';
declare module '*.scss';
declare module '*.sass';
declare module '*.svg';
declare module '*.png';
declare module '*.jpg';
declare module '*.jpeg';
declare module '*.gif';
declare module '*.bmp';
declare module '*.tiff';

/**
 * Auth
 */

interface AuthProviderProps {
  children: React.ReactNode;
}

type AuthUser = {
  accessToken: string,
  username: string,
  cpName: string,
}

type AuthContextType = {
  user: AuthUser;
  login: (string) => Promise<void>;
  logout: () => void;
  post: <P = any, R = any>(endpoint: string, param: P) => Promise<R | undefined>;
  put: <P = any, R = any>(endpoint: string, param: P) => Promise<R | undefined>;
  get: <R = any>(endpoint: string) => Promise<R | undefined>;
  del: <R = any>(endpoint: string) => Promise<R | undefined>;
}

type ResultData<T> = {
  success: boolean,
  message: string,
  code: number,
  timestamp: number,
  result: T
}


type LoginParam = {
  username: string,
  password: string,
  autoLogin: boolean,
}

type LoginResult = {
  accessToken: string,
  username: string,
  cpName: string,
}

/**
 * User
 */

type UserBasicParam = {
  username: string,
  password: string,
}

type UserCompanyParam = {
  cpName: string,
  cpCode: string,
  cpMobile: string,
  cpLocation: string,
  cpCaptcha: string,
  cpFiles: string[],
}

type UserRepresentativeParam = {
  rpName: string,
  rpCode: string,
  rpMobile: string,
  rpCaptcha: string,
  rpFiles: string[],
}

type UserOperatorParam = {
  opName: string,
  opCode: string,
  opMobile: string,
  opCaptcha: string,
  opFiles: string[],
}

type UserParam = {
  basic?: UserBasicParam,
  company?: UserCompanyParam,
  representative?: UserRepresentativeParam,
  operator?: UserOperatorParam,
}

type UserReviewParam = {
  status: UserStatus,
}


type UserResult = {
  id: string,
  cpLocation: string,
  cpName: string,
  cpCode: string,
  cpMobile: string,

  cases?: CaseResult[],
  contacts?: ContactResult[],
}

/**
 * Case
 */

type CaseReviewParam = {
  status: CaseStatus,
  review: string,
}

type CaseCreateParam = {
  name: string,
  code: string,
  description: string,
  visibility: CaseVisibility,
  files: string[],
}

type CaseResult = {
  id: string,
  name: string,
  code: string,
  description: string,
  visibility: CaseVisibility,
  source: CaseSource,
  cpName: string,
  cpLocation: string,

  status: CaseStatus,
  review?: string,
  files?: MediaFileResult[],
  user: UserResult,
  contact?: ContactResult,
  updateTime: string,
}

/**
 * Contact
 */


type ContactResult = {
  id: string,
  status: ContactStatus,

  user?: UserResult,
  caze?: CaseResult,
}

/**
 * MediaFile
 */


type MediaFileResult = {
  id: string,
  name: string,
  value: string,
}

/**
 * Admin
 */

type AdminUserResult = {
  id: string,
  name: string,
  cpLocation: string,
  cpName: string,
  cpCode: string,
  cpMobile: string,
  rpName: string,
  rpCode: string,
  rpMobile: string,
  opName: string,
  opCode: string,
  opMobile: string,

  cpFiles?: MediaFileResult[],
  rpFiles?: MediaFileResult[],
  opFiles?: MediaFileResult[],
}

type AdminCaseResult = {
  id: string,
  name: string,
  code: string,
  description: string,

  status: CaseStatus,
  review?: string,
  files?: MediaFileResult[],
}

type AdminCountResult = {
  user: string,
  caze: string,
}