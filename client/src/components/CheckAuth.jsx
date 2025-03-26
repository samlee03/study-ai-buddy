import React from 'react'
import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"
function CheckAuth() {
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async () => {
            const response = await fetch("http://localhost:5000/api/check-cookie", {
                method: "GET",
                credentials: "include"

            })
            const data = await response.json();
            setIsLoggedIn(data.loggedIn);
        }
        checkCookie();
    }, []);

    useEffect(() => {
        if(isLoggedIn == null) return;
        if (!isLoggedIn) {
            navigate("/login")
        }
    }, [isLoggedIn])
  return  { isLoggedIn }
}

export default CheckAuth