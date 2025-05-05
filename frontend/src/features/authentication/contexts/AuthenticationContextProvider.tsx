import { createContext, Dispatch, SetStateAction, useContext, useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Loader } from "../../../components/Loader/Loader";
import { request } from "../../../utils/api";

interface IAuthenticationResponse {
  token: string;
  message: string; // Fix typo: 'messgage' to 'message'
}

export interface IUser {
  id: string;
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
  ouathLogin: (code: string, page: "login" | "signup") => Promise<void>;
}

const AuthenticationContext = createContext<IAuthenticationContextType | null>(null);

export function useAuthentication() {
  return useContext(AuthenticationContext)!;
}

// Validate email format
const validateEmail = (email: string): boolean => {
  // Basic email format: must start with a letter and follow proper email structure
  const emailRegex = /^[A-Za-z][A-Za-z0-9._%+-]*@gmail\.com$/i;
  return emailRegex.test(email);
};


export function AuthenticationContextProvider() {
  const location = useLocation();
  const [user, setUser] = useState<IUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null); // State to store error message

  const isOnAuthPage =
    location.pathname === "/authentication/login" ||
    location.pathname === "/authentication/signup" ||
    location.pathname === "/authentication/request-password-reset";

  const login = async (email: string, password: string) => {
    if (!validateEmail(email)) {
      throw new Error("Invalid email address. Please check your email format.");
    }
    
    setError(null); // Reset error if email is valid

    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/login",
      method: "POST",
      body: JSON.stringify({ email, password }),
      onSuccess: ({ token }) => {
        localStorage.setItem("token", token);
      },
      onFailure: (error) => {
        setError("Login failed: " + error);
      },
    });
  };

  const ouathLogin = async (code: string, page: "login" | "signup") => {
    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/oauth/google/login",
      method: "POST",
      body: JSON.stringify({ code, page }),
      onSuccess: ({ token }) => {
        localStorage.setItem("token", token);
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
    
    setError(null); // Reset error if email is valid

    await request<IAuthenticationResponse>({
      endpoint: "/api/v1/authentication/register",
      method: "POST",
      body: JSON.stringify({ email, password }),
      onSuccess: ({ token }) => {
        localStorage.setItem("token", token);
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
    if (user) {
      return;
    }
    setIsLoading(true);
    const fetchUser = async () => {
      await request<IUser>({
        endpoint: "/api/v1/authentication/users/me",
        onSuccess: (data) => setUser(data),
        onFailure: (error) => {
          console.log(error);
        },
      });
      setIsLoading(false);
    };

    fetchUser();
  }, [user, location.pathname]);

  if (isLoading) {
    return <Loader />;
  }

  if (!isLoading && !user && !isOnAuthPage) {
    return <Navigate to="/authentication/login" state={{ from: location.pathname }} />;
  }

  if (user && !user.emailVerified && location.pathname !== "/authentication/verify-email") {
    return <Navigate to="/authentication/verify-email" />;
  }

  if (user && user.emailVerified && location.pathname == "/authentication/verify-email") {
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
        ouathLogin,
      }}
    >
      <Outlet />
      {/* Display error if there is any */}
      {error && <div style={{ color: "red" }}>{error}</div>}
    </AuthenticationContext.Provider>
  );
}
