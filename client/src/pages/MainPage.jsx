import React from 'react'
import Header from '../components/Header'
import NewUpload from '../components/NewUpload'; 
import RecentUpload from '../components/RecentUpload'; 
import '../styles/MainPage.css';
import logo from "../assets/StudyBuddyIcon.png"

const MainPage = () => {
    return (
        <div>
            <Header />
        <div className="Page-container">
        <div className='Upload-page'>
            <h2>New Upload</h2>
            <div className='NewUploadContainer'>
                <NewUpload 
                    title="Vocabulary" 
                    subtitle="Learn new words and improve your language skills." 
                    image={logo} 
                />
                <NewUpload 
                    title="Math" 
                    subtitle="Practice math problems and improve calculations." 
                    image={logo} 
                />
                <NewUpload 
                    title="History" 
                    subtitle="History Subtitles...................................." 
                    image={logo} 
                />
            </div>
            <hr className="divider" />
            <h2>Recent Upload</h2>
            <div className='RecentUploadContainer'>
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
                <RecentUpload
                    title = "Past Upload"
                    subtitle= " Something"
                    image = {logo}
                />
            </div>   
                </div>
            </div>
        </div>
    )
}

export default MainPage