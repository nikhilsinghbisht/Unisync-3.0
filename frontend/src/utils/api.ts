const BASE_URL = import.meta.env.VITE_API_URL;

interface IRequestParams<T> {
  endpoint: string;
  method?: "GET" | "POST" | "PUT" | "DELETE";
  contentType?: "application/json" | "multipart/form-data";
  body?: BodyInit | FormData;
  onSuccess: (data: T) => void;
  onFailure: (error: string) => void;
}

interface IHeaders extends Record<string, string> {
  Authorization: string;
}

let isRefreshing = false;
let requestQueue: (() => void)[] = [];

const getAccessToken = () => localStorage.getItem("token");
const setAccessToken = (token: string) => localStorage.setItem("token", token);

const redirectTo = (path: string) => {
  window.location.href = path;
};

const refreshToken = async (): Promise<string | null> => {
  try {
    const res = await fetch(`${BASE_URL}/api/v1/authentication/refresh`, {
      method: "POST",
      credentials: "include",
    });

    if (!res.ok) throw new Error("Refresh token invalid");

    const data = await res.json();
    setAccessToken(data.accessToken);
    return data.accessToken;
  } catch (error) {
    localStorage.removeItem("token");
    redirectTo("/authentication/login");
    return null;
  }
};

export const request = async <T>({
  endpoint,
  method = "GET",
  body,
  contentType = "application/json",
  onSuccess,
  onFailure,
}: IRequestParams<T>): Promise<void> => {
  const makeRequest = async (accessToken?: string): Promise<void> => {
    const headers: IHeaders = {
      Authorization: `Bearer ${accessToken || getAccessToken() || ""}`,
    };

    if (contentType === "application/json") {
      headers["Content-Type"] = "application/json";
    }

    try {
      const response = await fetch(`${BASE_URL}${endpoint}`, {
        method,
        headers,
        body,
        credentials: "include", // Always include credentials for secure APIs
      });

      if (!response.ok) {
        if (response.status === 401) throw new Error("UNAUTHORIZED");

        if (response.status === 403) {
          redirectTo("/forbidden");
          return;
        }

        if (response.status === 404) {
          redirectTo("/not-found");
          return;
        }

        if ([500, 502, 503, 504].includes(response.status)) {
          redirectTo("/server-error");
          return;
        }

        const { message } = await response.json();
        throw new Error(message || "Something went wrong");
      }

      const data: T = await response.json();
      onSuccess(data);
    } catch (error: any) {
      if (error.message === "UNAUTHORIZED") {
        if (!isRefreshing) {
          isRefreshing = true;
          const newAccessToken = await refreshToken();
          isRefreshing = false;

          if (newAccessToken) {
            requestQueue.forEach((cb) => cb());
            requestQueue = [];
            return;
          }
        }

        return new Promise<void>((resolve) => {
          requestQueue.push(() => {
            makeRequest(getAccessToken() || "").then(resolve);
          });
        });
      } else {
        onFailure(error.message || "Unexpected error occurred");
      }
    }
  };

  return makeRequest();
};
