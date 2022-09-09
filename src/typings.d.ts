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

interface AuthProviderProps {
    children: React.ReactNode;
}

type AuthContextType = {
    user: string;
    login: (string) => Promise<void>;
    logout: () => void;
}

type ResultMessage = {
    success: boolean,
    message: string,
    code: number,
    timestamp: number,
    result: any
}

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