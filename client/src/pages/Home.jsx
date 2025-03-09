import React from 'react'
import { useNavigate } from 'react-router-dom';
import Header from '../components/Header'
import "../styles/Home.css"
const Home = () =>{
  const navigate = useNavigate(); 

  const handleTryItClick = () => {
    navigate('./main'); 
  };
  return (
    <div>
      <Header/>
      <div>
              <div className="Page-container">
        <div className="Home-block">
          <div className="Home-content">
            <h1 className="Home-title">Study Buddy</h1>
            <p className="Home-subtitle">An AI-Powered Study Tool</p>
            <button className="Home-tryit-button" onClick={handleTryItClick}>
              Try It Now!
            </button>
                      </div>
          </div>
        </div>
      </div>
      
    </div>
  )
}

export default Home