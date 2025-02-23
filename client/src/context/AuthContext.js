import React, { createContext, useContext, useState ,useEffect} from 'react';
import { jwtDecode } from 'jwt-decode';
import axios from 'axios';
import { UserContext } from './UserContext';

const AuthContext = createContext();

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    useEffect(() => {
        // Check for user session in localStorage
        const userData = localStorage.getItem('user');
        if (userData) {
            const parsedUserData = JSON.parse(userData);
            const decodedToken = jwtDecode(parsedUserData.token);
            const userId = decodedToken.id; 
            setUser({ ...parsedUserData, id: userId });
        }
    }, []);

    const login = async (userData,dispatch) => {
        const decodedToken = jwtDecode(userData.token);
        const userId = decodedToken.id;
        localStorage.setItem('user', JSON.stringify(userData));
        setUser({ ...userData, id: userId });
       
    };
    

    const logout = (dispatch) => {
        localStorage.removeItem('user');
        setUser(null);
        dispatch({type:'LOGOUT'});
    };

    return (
        <AuthContext.Provider value={{ user, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};
export { AuthContext, AuthProvider};
