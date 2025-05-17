import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/RecentUpload.css';
import { useTheme } from '../components/ThemeContext';

const RecentUpload = ({id, title, subtitle, image, type, content}) => {
    const { theme} = useTheme();
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/FlashcardsView', { state: { id, title, subtitle, type, content, last_updated } });
    };

    return (
        <div 
        style={{
            '--primary' : theme.primary,
            '--secondary' : theme.secondary,
            '--background': theme.background,
            '--title': theme.title,
            '--subtitle': theme.subtitle,
            '--text': theme.textColor,
            '--border': theme.border,
            '--buttonBackground' : theme.buttonBackground,
            '--buttonHover' : theme.buttonHover,
            '--buttonText' : theme.buttonText,
            '--buttonDisable' : theme.buttonDisable,
            '--boxShadow': theme.boxShadow
          }}
        className='Upload-Recent'>
            <img src={image} alt="Upload preview" className="UploadImage-Recent" />
            <div className="UploadContent-Recent">
                <div className='UploadTitle-Recent'>
                    {title}
                </div>
                <p className='UploadSubtitle-Recent'>
                    {subtitle}
                </p>
                <button className="Button-RecentUpload" onClick={handleViewClick}>
                    View
                </button>
            </div>
        </div>
    )
}

export default RecentUpload;