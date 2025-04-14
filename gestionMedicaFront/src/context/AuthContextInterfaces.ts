export type AuthContextType = {
    user: any;
    token: string | null;
    setAuth: (user: any, token: string) => void;
    logout: () => void;
  };