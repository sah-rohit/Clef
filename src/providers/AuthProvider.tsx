import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";
import { useConvexAuth } from "convex/react";
import { useAuthActions } from "@convex-dev/auth/react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../convex/_generated/api";

export type UserSession = {
  id: string;
  name: string;
  username: string;
  email: string;
  avatar: string | null;
  isGuest: boolean;
  createdAt: string;
  lastLogin: string;
};

export type LoginActivity = {
  id: string;
  timestamp: string;
  device: string;
  browser: string;
  ip: string;
  active: boolean;
};

export type Notification = {
  id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "error";
  read: boolean;
  timestamp: string;
};

type AuthContextType = {
  user: UserSession | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  notifications: Notification[];
  loginActivities: LoginActivity[];
  loginAsGuest: () => void;
  signInWithEmail: (email: string, password: string) => Promise<boolean>;
  signUpWithEmail: (email: string, password: string, name: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (data: Partial<Pick<UserSession, "name" | "username" | "avatar">>) => void;
  updateEmail: (newEmail: string) => void;
  resetPassword: (oldPassword: string, newPassword: string) => boolean;
  deleteAccount: () => void;
  addNotification: (notif: Omit<Notification, "id" | "timestamp" | "read">) => void;
  markNotificationRead: (id: string) => void;
  clearNotifications: () => void;
  logoutFromDevice: (sessionId: string) => void;
  downloadUserData: () => void;
};

const AuthContext = createContext<AuthContextType | null>(null);

const STORAGE_KEY = "clef_user";
const ACTIVITIES_KEY = "clef_activities";
const NOTIFICATIONS_KEY = "clef_notifications";

function generateId() {
  return Math.random().toString(36).substring(2) + Date.now().toString(36);
}

function getBrowserInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Chrome")) return "Chrome";
  if (ua.includes("Firefox")) return "Firefox";
  if (ua.includes("Safari")) return "Safari";
  if (ua.includes("Edge")) return "Edge";
  return "Unknown Browser";
}

function getDeviceInfo(): string {
  const ua = navigator.userAgent;
  if (ua.includes("Windows")) return "Windows PC";
  if (ua.includes("Mac")) return "macOS";
  if (ua.includes("Linux")) return "Linux";
  if (ua.includes("iPhone")) return "iPhone";
  if (ua.includes("Android")) return "Android";
  return "Unknown Device";
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const { isAuthenticated: isConvexAuthenticated, isLoading: isConvexLoading } = useConvexAuth();
  const { signIn, signOut } = useAuthActions();
  const currentUser = useQuery(api.users.current);
  const updateProfileMutation = useMutation(api.users.updateProfile);
  const updateEmailMutation = useMutation(api.users.updateEmail);

  const [user, setUser] = useState<UserSession | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loginActivities, setLoginActivities] = useState<LoginActivity[]>([]);

  useEffect(() => {
    if (isConvexAuthenticated && currentUser) {
      setUser({
        id: currentUser._id,
        name: currentUser.name || currentUser.email?.split("@")[0] || "User",
        username: currentUser.username || currentUser.email?.split("@")[0] || "user",
        email: currentUser.email || "",
        avatar: currentUser.image || null,
        isGuest: false,
        createdAt: new Date(currentUser._creationTime).toISOString(),
        lastLogin: new Date().toISOString(),
      });
      setIsLoading(false);
      return;
    }

    if (!isConvexAuthenticated && !isConvexLoading) {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        try {
          const parsed = JSON.parse(stored);
          if (parsed.isGuest) setUser(parsed);
          else localStorage.removeItem(STORAGE_KEY);
        } catch {
          localStorage.removeItem(STORAGE_KEY);
        }
      } else {
        setUser(null);
      }
      setIsLoading(false);
    }
  }, [isConvexAuthenticated, isConvexLoading, currentUser]);

  useEffect(() => {
    const storedNotifs = localStorage.getItem(NOTIFICATIONS_KEY);
    if (storedNotifs) {
      try { setNotifications(JSON.parse(storedNotifs)); } catch { /* ignore */ }
    }
    const storedActivities = localStorage.getItem(ACTIVITIES_KEY);
    if (storedActivities) {
      try { setLoginActivities(JSON.parse(storedActivities)); } catch { /* ignore */ }
    }
  }, []);

  const saveUser = useCallback((u: UserSession | null) => {
    setUser(u);
    if (u && u.isGuest) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(u));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const saveNotifications = useCallback((n: Notification[]) => {
    setNotifications(n);
    localStorage.setItem(NOTIFICATIONS_KEY, JSON.stringify(n));
  }, []);

  const saveActivities = useCallback((a: LoginActivity[]) => {
    setLoginActivities(a);
    localStorage.setItem(ACTIVITIES_KEY, JSON.stringify(a));
  }, []);

  const addLoginActivity = useCallback(() => {
    const activity: LoginActivity = {
      id: generateId(),
      timestamp: new Date().toISOString(),
      device: getDeviceInfo(),
      browser: getBrowserInfo(),
      ip: "192.168." + Math.floor(Math.random() * 255) + "." + Math.floor(Math.random() * 255),
      active: true,
    };
    const updated = [activity, ...loginActivities].slice(0, 20);
    saveActivities(updated);
  }, [loginActivities, saveActivities]);

  const loginAsGuest = useCallback(() => {
    const guestUser: UserSession = {
      id: generateId(),
      name: "Guest User",
      username: "guest_" + Math.floor(Math.random() * 9999),
      email: "",
      avatar: null,
      isGuest: true,
      createdAt: new Date().toISOString(),
      lastLogin: new Date().toISOString(),
    };
    saveUser(guestUser);
    addLoginActivity();
    const welcomeNotif: Notification = {
      id: generateId(),
      title: "Welcome to Clef!",
      message: "You're signed in as a guest. All tools are free to use. Create an account with email to save your preferences.",
      type: "info",
      read: false,
      timestamp: new Date().toISOString(),
    };
    saveNotifications([welcomeNotif, ...notifications]);
  }, [saveUser, addLoginActivity, notifications, saveNotifications]);

  const signInWithEmail = useCallback(async (email: string, password: string): Promise<boolean> => {
    await signIn("password", { email, password, flow: "signIn" });
    addLoginActivity();
    return true;
  }, [signIn, addLoginActivity]);

  const signUpWithEmail = useCallback(async (email: string, password: string, name: string): Promise<boolean> => {
    await signIn("password", { email, password, flow: "signUp" });
    
    try {
      await updateProfileMutation({ 
        name: name,
        username: name.toLowerCase().replace(/[^a-z0-9_]/g, "").substring(0, 15) || "user"
      });
    } catch (e) {
      console.error("Profile name patch failed", e);
    }

    const welcomeNotif: Notification = {
      id: generateId(),
      title: "Account Created!",
      message: "Welcome to Clef! Your account has been created via Convex Database.",
      type: "success",
      read: false,
      timestamp: new Date().toISOString(),
    };
    saveNotifications([welcomeNotif, ...notifications]);
    addLoginActivity();
    return true;
  }, [signIn, addLoginActivity, notifications, saveNotifications]);

  const logout = useCallback(() => {
    if (isConvexAuthenticated) {
      signOut();
    }
    saveUser(null);
    const updated = loginActivities.map((a, i) => i === 0 ? { ...a, active: false } : a);
    saveActivities(updated);
  }, [isConvexAuthenticated, signOut, saveUser, loginActivities, saveActivities]);

  const updateProfile = useCallback(async (data: Partial<Pick<UserSession, "name" | "username" | "avatar">>) => {
    if (!user) return;
    
    if (user.isGuest) {
      const updated = { ...user, ...data };
      saveUser(updated);
    } else if (isConvexAuthenticated) {
      try {
        await updateProfileMutation({
          name: data.name,
          username: data.username,
          image: data.avatar || undefined,
        });
      } catch (e) {
        console.error("Failed to update profile", e);
      }
    }
  }, [user, saveUser, isConvexAuthenticated, updateProfileMutation]);

  const updateEmail = useCallback(async (newEmail: string) => {
    if (!user) return;
    
    if (user.isGuest) {
      saveUser({ ...user, email: newEmail });
    } else if (isConvexAuthenticated) {
      try {
        await updateEmailMutation({ email: newEmail });
      } catch (e) {
        console.error("Failed to update email", e);
      }
    }
  }, [user, saveUser, isConvexAuthenticated, updateEmailMutation]);

  const resetPassword = useCallback((oldPassword: string, newPassword: string): boolean => {
    if (!user || user.isGuest || !isConvexAuthenticated) return false;
    console.warn("Password reset is not fully implemented in this flow without email verification.");
    return false;
  }, [user, isConvexAuthenticated]);

  const deleteAccount = useCallback(async () => {
    if (!user) return;
    if (!user.isGuest && isConvexAuthenticated) {
      await signOut();
    }
    localStorage.removeItem(STORAGE_KEY);
    localStorage.removeItem(ACTIVITIES_KEY);
    localStorage.removeItem(NOTIFICATIONS_KEY);
    setUser(null);
    setNotifications([]);
    setLoginActivities([]);
  }, [user, isConvexAuthenticated, signOut]);

  const addNotification = useCallback((notif: Omit<Notification, "id" | "timestamp" | "read">) => {
    const newNotif: Notification = {
      ...notif,
      id: generateId(),
      timestamp: new Date().toISOString(),
      read: false,
    };
    saveNotifications([newNotif, ...notifications]);
  }, [notifications, saveNotifications]);

  const markNotificationRead = useCallback((id: string) => {
    const updated = notifications.map(n => n.id === id ? { ...n, read: true } : n);
    saveNotifications(updated);
  }, [notifications, saveNotifications]);

  const clearNotifications = useCallback(() => {
    saveNotifications([]);
  }, [saveNotifications]);

  const logoutFromDevice = useCallback((sessionId: string) => {
    const updated = loginActivities.map(a => a.id === sessionId ? { ...a, active: false } : a);
    saveActivities(updated);
  }, [loginActivities, saveActivities]);

  const downloadUserData = useCallback(() => {
    if (!user) return;
    const data = {
      profile: user,
      loginHistory: loginActivities,
      notifications,
      exportedAt: new Date().toISOString(),
      platform: "Clef",
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `clef_userdata_${(user as any).username || 'user'}_${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  }, [user, loginActivities, notifications]);

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        notifications,
        loginActivities,
        loginAsGuest,
        signInWithEmail,
        signUpWithEmail,
        logout,
        updateProfile,
        updateEmail,
        resetPassword,
        deleteAccount,
        addNotification,
        markNotificationRead,
        clearNotifications,
        logoutFromDevice,
        downloadUserData,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error("useAuth must be used within AuthProvider");
  return ctx;
}
