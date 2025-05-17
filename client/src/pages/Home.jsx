import React from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import "../styles/Home.css"
import { useTheme } from '../components/ThemeContext';
import RobotHome from "../assets/RobotHome.svg";
import RobotHead from "../assets/RobotHeadForward.svg"
import CheckAuth from '../components/CheckAuth';

const Home = () => {
    const { isLoggedIn } = CheckAuth()
    const { theme} = useTheme();
    const navigate = useNavigate();

    const handleTryItClick = () => {
        if (isLoggedIn) {
            navigate('/main');
        } else {
            navigate('/login');
        }
    };
    return (
        <div
            style={{
                '--primary' : theme.primary,
                '--secondary' : theme.secondary,
                '--background': theme.background,
                '--background2': theme.background2,
                '--title': theme.title,
                '--subtitle': theme.subtitle,
                '--text': theme.textColor,
                '--border': theme.border,
                '--buttonBackground' : theme.buttonBackground,
                '--buttonHover' : theme.buttonHover,
                '--buttonText' : theme.buttonText,
            }}
            className="Page-container-Home"
        >
            <Header />
            <div className='HomeBG'>
                <div className="Home-block">
                    <div className="Home-content">
                        <h1 className="Home-title">Study Buddy</h1>
                        <p className="Home-subtitle">An AI-Powered Study Tool</p>
                        <button className="Home-tryit-button" onClick={handleTryItClick}>
                            <img src={RobotHead} alt="Try It" className="button-image" />
                            Try It Now!
                        </button>
                    </div>
                    <div className="Home-image">
                        <img 
                            src={RobotHome} 
                            alt="Robot"
                            srcSet={`${RobotHome} 100w, ${RobotHome} 200w, ${RobotHome} 300w`} 
                            sizes="(max-width: 500px) 100px, (max-width: 800px) 150px, 200px"
                        />
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Home