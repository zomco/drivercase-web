import React, {createContext, useContext, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";


const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // 验证用户权限的时候，访问该函数
  const login = async (data: string) => {
    setUser(data);
    navigate("/profile");
  };

  // 登出
  const logout = () => {
    setUser(null);
    navigate("/", { replace: true });
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};