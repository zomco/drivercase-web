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