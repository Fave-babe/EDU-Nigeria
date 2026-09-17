
import {
  createContext,
  useContext,
  useState,
  useEffect,
} from "react";

import { authApi } from "../api/auth.api";

import {
  getToken,
  setToken,
  clearToken,
  getStoredUser,
  setStoredUser,
} from "../api/token";

import { addItem } from "../data/store";

const AuthContext = createContext(null);

// =========================================================
// ROLE HELPERS
// =========================================================

export function normalizeRole(role) {
  return role?.toLowerCase?.() || "";
}

// =========================================================
// DETERMINE COUNSELLOR
// =========================================================

export function isCounsellorUser(user) {
  if (!user) return false;

  return (
    normalizeRole(user.role) === "staff" &&
    normalizeRole(user.staffRole) === "counsellor"
  );
}

// =========================================================
// GET EFFECTIVE ROLE
// =========================================================

export function getEffectiveRole(user) {
  if (!user) return "";

  if (isCounsellorUser(user)) {
    return "counsellor";
  }

  return normalizeRole(user.role);
}

// =========================================================
// NORMALIZE USER
// =========================================================

export function normalizeUser(user) {
  if (!user) return null;

  return {
    ...user,

    role: normalizeRole(user.role),

    staffRole: user.staffRole || null,

    effectiveRole: getEffectiveRole(user),
  };
}

// =========================================================
// REDIRECT PATH
// =========================================================

export function getRedirectPath(user) {
  if (!user) {
    return "/login";
  }

  const role = getEffectiveRole(user);

  switch (role) {
    case "super_admin":
    case "superadmin":
      return "/super-admin";

    case "admin":
      return "/dashboard";

    case "staff":
      return "/Sdashboard";

    case "counsellor":
      return "/Cdashboard";

    case "teacher":
      return "/Tdashboard";

    case "bursar":
      return "/Bdashboard";

    case "student":
      return "/Stdashboard";

    case "parent":
      return "/Pdashboard";

    default:
      return "/login";
  }
}

// =========================================================
// AUTH PROVIDER
// =========================================================

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // =======================================================
  // THEME
  // =======================================================

  const [theme, setTheme] = useState(() => {
    return localStorage.getItem("theme") || "light";
  });

  useEffect(() => {
    document.documentElement.setAttribute(
      "data-theme",
      theme
    );

    localStorage.setItem("theme", theme);
  }, [theme]);

  function toggleTheme() {
    setTheme((prev) =>
      prev === "light" ? "dark" : "light"
    );
  }

  // =======================================================
  // RESTORE SESSION
  // =======================================================

  useEffect(() => {
    const token = getToken();
    const storedUser = getStoredUser();

    if (token && storedUser) {
      const normalizedStoredUser =
        normalizeUser(storedUser);

      setUser(normalizedStoredUser);

      authApi
        .me()
        .then((res) => {
          console.log("ME RESPONSE:", res);

          const freshUser = normalizeUser({
            ...res.user,

            role:
              res.role ??
              res.user?.role ??
              storedUser?.role,

            staffRole:
              res.staffRole ??
              res.user?.staffRole ??
              storedUser?.staffRole,
          });

          console.log("FRESH USER:", freshUser);

          setUser(freshUser);
          setStoredUser(freshUser);
        })
        .catch((err) => {
          console.error(
            "SESSION RESTORE ERROR:",
            err
          );

          clearToken();
          setUser(null);
        })
        .finally(() => {
          console.log(
            "SESSION RESTORE FINISHED"
          );

          setLoading(false);
        });
    } else {
      setLoading(false);
    }
  }, []);

  // =======================================================
  // REGISTER
  // =======================================================

  async function register(userData) {
    try {
      const payload = {
        ...userData,
      };

      await authApi.register(payload);

      // Student registration creates admission record
      if (
        normalizeRole(userData.role) ===
        "student"
      ) {
        const admission = {
          id: Date.now(),

          firstName:
            userData.firstName,

          lastName:
            userData.lastName,

          email:
            userData.email,

          studentClass:
            userData.studentClass,

          gender:
            userData.gender,

          previousSchool:
            userData.previousSchool,

          status: "pending",

          createdAt:
            new Date().toISOString(),
        };

        addItem(
          "admissions",
          admission
        );

        window.dispatchEvent(
          new CustomEvent(
            "faveschool:admissions-updated",
            {
              detail: admission,
            }
          )
        );
      }

      return {
        success: true,
      };
    } catch (err) {
      console.error(
        "REGISTRATION ERROR:",
        err
      );

      return {
        success: false,

        message:
          err.message ||
          "Registration failed. Please try again.",
      };
    }
  }

  // =======================================================
  // LOGIN
  // =======================================================

  async function login(email, password) {
    try {
      console.log("LOGIN STARTED");

      const res = await authApi.login(
        email,
        password
      );

      console.log(
        "LOGIN API RESPONSE:",
        res
      );

      const {
        token,
        user: loggedInUser,
      } = res;

      if (!token || !loggedInUser) {
        return {
          success: false,
          message:
            "Login response is missing user or token.",
        };
      }

      // Normalize user
      const normalizedUser =
        normalizeUser(
          loggedInUser
        );

      console.log(
        "NORMALIZED USER:",
        normalizedUser
      );

      // Store authentication
      setToken(token);

      setStoredUser(
        normalizedUser
      );

      // Update context
      setUser(
        normalizedUser
      );

      console.log(
        "LOGIN SUCCESS:",
        normalizedUser
      );

      return {
        success: true,

        user:
          normalizedUser,
      };
    } catch (err) {
      console.error(
        "LOGIN ERROR:",
        err
      );

      return {
        success: false,

        message:
          err.message ||
          "Login failed. Please try again.",
      };
    }
  }

  // =======================================================
  // LOGOUT
  // =======================================================

  function logout() {
    clearToken();
    setUser(null);
  }

  // =======================================================
  // HAS ROLE
  // =======================================================

  function hasRole(role) {
    if (!user) {
      return false;
    }

    const currentRole =
      getEffectiveRole(user);

    const requestedRole =
      normalizeRole(role);

    // Admin has access to
    // school management modules.
    if (currentRole === "admin") {
      return true;
    }

    return (
      currentRole ===
      requestedRole
    );
  }

  // =======================================================
  // CAN ACCESS
  // =======================================================

  function canAccess(allowedRoles) {
    if (!user) {
      return false;
    }

    const currentRole =
      getEffectiveRole(user);

    // Admin can access school
    // management modules.
    if (currentRole === "admin") {
      return true;
    }

    return allowedRoles.some(
      (allowedRole) =>
        normalizeRole(
          allowedRole
        ) === currentRole
    );
  }

  // =======================================================
  // IS COUNSELLOR
  // =======================================================

  function isCounsellor(u = user) {
    return (
      getEffectiveRole(u) ===
      "counsellor"
    );
  }

  // =======================================================
  // CONTEXT VALUE
  // =======================================================

  return (
    <AuthContext.Provider
      value={{
        user,

        loading,

        register,

        login,

        logout,

        hasRole,

        canAccess,

        isCounsellor,

        getEffectiveRole,

        getRedirectPath,

        theme,

        toggleTheme,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =========================================================
// USE AUTH
// =========================================================

export function useAuth() {
  const ctx =
    useContext(AuthContext);

  if (!ctx) {
    throw new Error(
      "useAuth must be used within AuthProvider"
    );
  }

  return ctx;
}

