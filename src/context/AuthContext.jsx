    import React, { createContext, useContext, useState } from 'react';

    const AuthContext = createContext();

    export const AuthProvider=({children})=>{
            const[isLoggedIn,setIsLoggedIn]=useState(false);

            const logout=()=>{
                setIsLoggedIn("false")

            }
            const login=()=>{
                setIsLoggedIn("true")
            }

            return(
               < AuthContext.Provider value={{isLoggedIn,login,logout}}>
                    {children}
                </AuthContext.Provider>
            )
    }
    export const useAuth=()=>{
        return useContext(AuthContext);
    };
