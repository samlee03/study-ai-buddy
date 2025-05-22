import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"

// CheckAuth Component is created with ChatGPT, to allow easier cookie-checking, instead of calling endpoint in every Frontend Component
// When this component is used, it calls to check whether the cookie (containing jwt) exists, redirects to LoginPage if cookie does not exist
function CheckAuth() {
    const backendUrl = "https://study-ai-buddy-backend.onrender.com"
    const [isLoggedIn, setIsLoggedIn] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const checkCookie = async () => {
            const response = await fetch(`${backendUrl}/api/check-cookie`, {
                method: "GET",
                credentials: "include"
            })
            const data = await response.json();
            console.log(data.loggedIn);
            setIsLoggedIn(data.loggedIn);
        }
        checkCookie();
    }, []);

    useEffect(() => {
        if(isLoggedIn == null) return;
        const noRedirectPaths = ['/', '/signup', '/forgot', '/verify']
        if (!isLoggedIn && !noRedirectPaths.includes(location.pathname)) {
            navigate("/login")
        }
    }, [isLoggedIn])
  return  { isLoggedIn }
}

export default CheckAuth