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

/**
 * Case
 */

enum CaseVisibility {
    PRIVATE,
    PUBLIC,
    AUTHORIZE,
}

enum CaseStatus {
    WAITING,
    COMMENT,
    TEMPLATE,
    APPROVED,
}

type CaseReviewParam = {
    status: string,
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
    userId: string,
    name: string,
    code: string,
    description: string,
    visibility: CaseVisibility,
    status: CaseStatus,
    review: string,
}

/**
 * Contact
 */

enum ContactStatus {
    UNCERTAIN,
    CONFIRMED,
    REJECTED,
}

type ContactResult = {
    id: string,
    userId: string,
    caseId: string,
    status: ContactStatus,
}

/**
 * MediaFile
 */

enum MediaFileSource {
    USER_COMPANY,
    USER_OPERATOR,
    USER_REPRESENTATIVE,
    CASE,
}

type MediaFileResult = {
    id: string,
    sourceId: string,
    source: MediaFileSource,
    name: string,
}