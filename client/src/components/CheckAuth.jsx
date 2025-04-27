import { useState, useEffect } from 'react'
import { useNavigate } from "react-router-dom"


// CheckAuth Component is created with ChatGPT, to allow easier cookie-checking, instead of calling endpoint in every Frontend Component
// When this component is used, it calls to check whether the cookie (containing jwt) exists, redirects to LoginPage if cookie does not exist
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