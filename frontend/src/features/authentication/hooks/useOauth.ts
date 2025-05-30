import { useEffect, useState } from "react";
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useAuthentication } from "../contexts/AuthenticationContextProvider";

const GOOGLE_OAUTH2_CLIENT_ID = import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID;
const VITE_GOOGLE_OAUTH_URL = import.meta.env.VITE_GOOGLE_OAUTH_URL;

export function useOauth(page: "login" | "signup") {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const location = useLocation();
  const { oauthLogin } = useAuthentication();
  const code = searchParams.get("code");
  const state = searchParams.get("state");
  const error = searchParams.get("error");

  const [isOauthInProgress, setIsOauthInProgress] = useState(
    code !== null || error !== null
  );
  const [oauthError, setOauthError] = useState("");

  useEffect(() => {
    async function fetchData() {
      if (error) {
        setOauthError(
          error === "access_denied"
            ? "You denied access to your Google account."
            : "An unknown error occurred."
        );
        cleanup();
        return;
      }

      if (!code || !state) return;

      let parsedState;
      try {
        parsedState = JSON.parse(state);
      } catch {
        setOauthError("Invalid state format.");
        cleanup();
        return;
      }

      const { destination, antiForgeryToken } = parsedState;
      if (antiForgeryToken !== "n6kibcv2ov") {
        setOauthError("Invalid state parameter.");
        cleanup();
        return;
      }

      try {
        await oauthLogin(code, page);
        navigate(destination || "/");
      } catch (err) {
        setOauthError(
          err instanceof Error ? err.message : "An unknown error occurred."
        );
      } finally {
        cleanup();
      }
    }

    function cleanup() {
      setIsOauthInProgress(false);
      setSearchParams({});
    }

    fetchData();
  }, [code, error, navigate, oauthLogin, page, setSearchParams, state]);

  return {
    isOauthInProgress,
    oauthError,
    startOauth: () => {
      const redirectUri = `${window.location.origin}/authentication/${page}`;
      const state = JSON.stringify({
        antiForgeryToken: "n6kibcv2ov",
        destination: location.state?.from || "/",
      });

      const authUrl = `${VITE_GOOGLE_OAUTH_URL}?client_id=${GOOGLE_OAUTH2_CLIENT_ID}&redirect_uri=${encodeURIComponent(
        redirectUri
      )}&scope=openid%20email%20profile&response_type=code&state=${encodeURIComponent(
        state
      )}&access_type=offline&prompt=consent`;

      window.location.href = authUrl;
    },
  };
}
