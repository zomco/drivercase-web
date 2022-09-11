import React, {createContext, useContext, useMemo} from "react";
import { useNavigate } from "react-router-dom";
import { useLocalStorage } from "./useLocalStorage";
import axios, {AxiosError, AxiosResponse} from "axios";
import {message} from "antd";


const AuthContext = createContext<AuthContextType>(undefined!);

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useLocalStorage("user", null);
  const navigate = useNavigate();

  // 验证用户权限的时候，访问该函数
  const login = async (data: AuthUser) => {
    setUser(data);
    navigate("/");
  };

  // 登出
  const logout = () => {
    setUser(null);
    navigate("/login", { replace: true });
  };

  const errHandler = async <P = any, R = any>(e: any) => {
    const err = e as AxiosError<ResultData<R>, P>;
    switch (err.response?.status) {
      case 400: {
        const data: ResultData<R> | undefined = err.response?.data;
        if (data) {
          message.error(data.message);
        }
        break;
      }
      case 401: {
        navigate("/login", { replace: true });
        break;
      }
      default:
        message.error(err.message);
    }
  }

  const post = async <P = any, R = any>(endpoint: string, param: P) =>{
    try {
      const response: AxiosResponse<ResultData<R>, P> = await axios.post(
          endpoint,
          param,
          { headers: { Authorization: `Bearer ${user.accessToken}`}});
      return response.data.result;
    } catch (e) {
      await errHandler(e);
    }
  };

  const get = async <P = any, R = any>(endpoint: string) =>{
    try {
      const response: AxiosResponse<ResultData<R>, P> = await axios.get(
          endpoint,
          { headers: { Authorization: `Bearer ${user.accessToken}`}});
      return response.data.result;
    } catch (e) {
      await errHandler(e);
    }
  };

  const put = async <P = any, R = any>(endpoint: string, param: P) =>{
    try {
      const response: AxiosResponse<ResultData<R>, P> = await axios.put(
          endpoint,
          param,
          { headers: { Authorization: `Bearer ${user.accessToken}`}});
      return response.data.result;
    } catch (e) {
      await errHandler(e);
    }
  };

  const del = async <P = any, R = any>(endpoint: string) =>{
    try {
      const response: AxiosResponse<ResultData<R>, P> = await axios.delete(
          endpoint,
          { headers: { Authorization: `Bearer ${user.accessToken}`}});
      return response.data.result;
    } catch (e) {
      await errHandler(e);
    }
  };

  const value = useMemo<AuthContextType>(
    () => ({
      user,
      login,
      logout,
      post,
      put,
      get,
      del,
    }),
    [user]
  );
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  return useContext(AuthContext);
};