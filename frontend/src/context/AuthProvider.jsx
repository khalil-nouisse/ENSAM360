import { createContext, useState, useEffect } from "react";
import axios from "../api/axios";

//This creates the global auth context.
//All components inside the AuthProvider can access its values using:  useContext(AuthContext)
const AuthContext = createContext({});

export const AuthProvider = ({ children }) => {
    // State to hold the authenticated user
    const [auth, setAuth] = useState({});

    const login = async (email , password) =>{
        try {
            const response = await axios.post('api/auth/login' ,
                {
                     email, password 
                } , 
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            const accessToken = response.data.accessToken;
            const refreshToken = response.data.refreshToken;

            setAuth({ email ,accessToken , refreshToken });  

            localStorage.setItem('token' , accessToken);
            localStorage.setItem('refreshToken', refreshToken);

            return true;
        }catch(err){
            console.error("Login Failed", err);
            throw err;
        }
    }

    const register = async (firstname, lastname , email , password) =>{
        try{
            const response = await axios.post('api/auth/register' , 
                {
                    firstname, lastname , email , password
                },
                {
                    headers: { 'Content-Type': 'application/json' }
                }
            );

            return true;
        }catch(err){
            console.error("Login Failed", err);
            throw err;
        }
    }

    const logout = async () => {
        try {
            // We need to send the header because route uses 'authMiddleware'
            await axios.post('/auth/logout', {}, {
                headers: { Authorization: `Bearer ${auth.accessToken}` }
            });
        } catch (err) {
            console.error("Logout Error", err);
        } finally {
            setAuth({});
            localStorage.removeItem('token');
            localStorage.removeItem('refreshToken');
        }
    }

    useEffect(() => {
        const token = localStorage.getItem('token');
        const refreshToken = localStorage.getItem('refreshToken');
        if (token) {
            setAuth({ accessToken: token, refreshToken });
        }
    }, []);

    return (
        <AuthContext.Provider value={{ auth, setAuth, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthContext;