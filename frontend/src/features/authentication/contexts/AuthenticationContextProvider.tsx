import {
  createContext,
  Dispatch,
  SetStateAction,
  useContext,
  useEffect,
  useState,
} from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";
import { request } from "../../../utils/api";
import Cookies from "js-cookie";
interface IAuthenticationResponse {
  token: string;
  refreshToken: string;
  message: string;
}

export interface IUser {
  id: number;
  email: string;
  emailVerified: boolean;
  firstName?: string;
  lastName?: string;
  company?: string;
  position?: string;
  location?: string;
  profileComplete: boolean;
  profilePicture?: string;
  coverPicture?: string;
  about?: string;
}

interface IAuthenticationContextType {
  user: IUser | null;
  setUser: Dispatch<SetStateAction<IUser | null>>;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  signup: (email: string, password: string) => Promise<void>;
  oauthLogin: (code: string, page: "login" | "signup") => Promise<void>;
}

const AuthenticationContext = createContext<IAuthenticationContextType | null>(
  null
);

export function useAuthentication() {
  return useContext(AuthenticationContext)!;
}

const validateEmail = (email: string): boolean => {
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@gmail\.com$/i;
  return emailRegex.test(email);
};

export function AuthenticationContextProvider() {
  const location = useLocation();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const isOnAuthPage =
    location.pathname === "/authentication/login" ||
    location.pathname === "/authentication/signup" ||
    location.pathname === "/authentication/request-password-reset";
  location.pathname === "/authentication/request-password-reset" ||
    location.pathname === "/about-us";

  const login = async (email: string, password: string) => {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address. Please check your email format.");
    }

    setError(null);

    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/login",
      method: "POST",
      body: JSON.stringify({ email, password }),
      onSuccess: ({ token, refreshToken }) => {
        localStorage.setItem("token", token);
        Cookies.set("refreshToken", refreshToken, {
          expires: 3, // days
          secure: true,
          sameSite: "Strict",
        });
      },
      onFailure: (error) => {
        setError("Login failed: " + error);
      },
    });
  };

  const oauthLogin = async (code: string, page: "login" | "signup") => {
    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/oauth/google/login",
      method: "POST",
      body: JSON.stringify({ code, page }),
      onSuccess: ({ token, refreshToken }) => {
        localStorage.setItem("token", token);
        Cookies.set("refreshToken", refreshToken, {
          expires: 3, // days
          secure: true,
          sameSite: "Strict",
        });
      },
      onFailure: (error) => {
        setError("OAuth login failed: " + error);
      },
    });
  };

  const signup = async (email: string, password: string) => {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address. Please check your email format.");
    }

    setError(null);

    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/register",
      method: "POST",
      body: JSON.stringify({ email, password }),
      onSuccess: ({ token, refreshToken }) => {
        localStorage.setItem("token", token);
        Cookies.set("refreshToken", refreshToken, {
          expires: 3,
          secure: true,
          sameSite: "Strict",
        });
      },
      onFailure: (error) => {
        setError("Signup failed: " + error);
      },
    });
  };

  const logout = async () => {
    localStorage.removeItem("token");
    setUser(null);
  };

useEffect(() => {
  const token = localStorage.getItem("token");
  if (user || !token) {
    setIsLoading(false);
    return;
  }

  const fetchUser = async () => {
    setIsLoading(true);
    await request<IUser>({
      endpoint: "/api/v1/authentication/users/me",
      onSuccess: (data) => setUser(data),
      onFailure: (error) => {
        console.log("Error fetching user:", error);
        localStorage.removeItem("token"); // Cleanup
      },
    });
    setIsLoading(false);
  };

  fetchUser();
}, [user, location.pathname]);


  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !localStorage.getItem("token") && !isOnAuthPage) {
    console.log("Redirecting unauthenticated user to /about-us");
    return (
      <Navigate
        to="/about-us"
        state={{ from: location.pathname }}
      />
    );
  }

  if (
    user &&
    !user.emailVerified &&
    location.pathname !== "/authentication/verify-email"
  ) {
    return <Navigate to="/authentication/verify-email" />;
  }

  if (
    user &&
    user.emailVerified &&
    location.pathname == "/authentication/verify-email"
  ) {
    return <Navigate to="/" />;
  }

  if (
    user &&
    user.emailVerified &&
    !user.profileComplete &&
    !location.pathname.includes("/authentication/profile")
  ) {
    return <Navigate to={`/authentication/profile/${user.id}`} />;
  }

  if (
    user &&
    user.emailVerified &&
    user.profileComplete &&
    location.pathname.includes("/authentication/profile")
  ) {
    return <Navigate to="/" />;
  }

  if (user && isOnAuthPage) {
    return <Navigate to={location.state?.from || "/"} />;
  }

  return (
    <AuthenticationContext.Provider
      value={{
        user,
        login,
        logout,
        signup,
        setUser,
        oauthLogin,
      }}
    >
      <Outlet />
      {/* Display error if there is any */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </AuthenticationContext.Provider>
  );
}
