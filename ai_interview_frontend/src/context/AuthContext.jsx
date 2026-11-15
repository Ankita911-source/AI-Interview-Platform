import { createContext, useContext, useEffect, useState } from "react";
import { TOKEN_KEY } from "../services/api";
import { loginAPI, signupAPI, meAPI } from "../services/authSer";

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(Boolean(localStorage.getItem(TOKEN_KEY)));

    useEffect(() => {
        if (!localStorage.getItem(TOKEN_KEY)) {
            return;
        }

        meAPI()
            .then(setUser)
            .catch(() => localStorage.removeItem(TOKEN_KEY))
            .finally(() => setLoading(false));
    }, []);

    const saveLogin = (data) => {
        localStorage.setItem(TOKEN_KEY, data.access_token);
        setUser(data.user);
    };

    const login = async (email, password) => {
        saveLogin(await loginAPI(email, password));
    };

    const signup = async (name, email, password) => {
        saveLogin(await signupAPI(name, email, password));
    };

    const logout = () => {
        localStorage.removeItem(TOKEN_KEY);
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, signup, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);
