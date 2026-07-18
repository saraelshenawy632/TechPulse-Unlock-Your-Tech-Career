import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    // =====================================
    // Load User From LocalStorage
    // =====================================

    useEffect(() => {

        const token = localStorage.getItem("token");

        const savedUser = localStorage.getItem("user");

        if (token && savedUser) {

            try {

                setUser(JSON.parse(savedUser));

            }

            catch {

                localStorage.removeItem("token");

                localStorage.removeItem("user");

            }

        }

        setLoading(false);

    }, []);

    // =====================================
    // Register
    // =====================================

    const register = async (name, email, password) => {

        const response = await fetch(

            "http://localhost:5000/api/auth/register",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    name,

                    email,

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(

                data.message || "Registration Failed"

            );

        }

        if (data.token) {

            localStorage.setItem(

                "token",

                data.token

            );

        }

        if (data.user) {

            localStorage.setItem(

                "user",

                JSON.stringify(data.user)

            );

            setUser(data.user);

        }

        return data.user;

    };

    // =====================================
    // Login
    // =====================================

    const login = async (email, password) => {

        const response = await fetch(

            "http://localhost:5000/api/auth/login",

            {

                method: "POST",

                headers: {

                    "Content-Type": "application/json"

                },

                body: JSON.stringify({

                    email,

                    password

                })

            }

        );

        const data = await response.json();

        if (!response.ok) {

            throw new Error(

                data.message || "Login Failed"

            );

        }

        localStorage.setItem(

            "token",

            data.token

        );

        localStorage.setItem(

            "user",

            JSON.stringify(data.user)

        );

        setUser(data.user);

        return data.user;

    };

    // =====================================
    // Logout
    // =====================================

    const logout = () => {

        localStorage.removeItem("token");

        localStorage.removeItem("user");

        setUser(null);

    };

    // =====================================
    // Provider
    // =====================================

    return (

        <AuthContext.Provider

            value={{

                user,

                loading,

                login,

                register,

                logout,

                isAuthenticated: !!user,

                isAdmin: user?.role === "Admin"

            }}

        >

            {children}

        </AuthContext.Provider>

    );

}

export const useAuth = () => useContext(AuthContext);