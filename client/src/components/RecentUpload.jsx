import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/RecentUpload.css';
import { useTheme } from '../components/ThemeContext';

const RecentUpload = ({id, title, subtitle, image, type, content, last_updated}) => {
    const { theme} = useTheme();
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/FlashcardsView', { state: { id, title, subtitle, type, content, last_updated } });
    };

    const convertPythonTime = (t) => {
        const date = new Date(t * 1000);
        return date.toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }
    return (
        <button
            type="button"
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
            className="Upload-Recent"
            onClick={handleViewClick}
        >
            <img src={image} alt="Upload preview" className="UploadImage-Recent" />
            <div className="UploadContent-Recent">
                <div className='UploadTitle-Recent'>
                    {title?.trim() ? title : 'Untitled'}
                </div>
                <p className='UploadSubtitle-Recent'>
                    {subtitle}
                </p>
                <div>
                    {(content?.length ?? 0)} Cards
                </div>
                <div>
                    Last Edited {convertPythonTime(last_updated)}
                </div>
            </div>
        </button>
    )
}

export default RecentUpload;