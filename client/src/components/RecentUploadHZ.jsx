import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/RecentUpload.css';
import { useTheme } from './ThemeContext';

const RecentUpload = ({id, title, subtitle, image, type, content, last_updated}) => {
    const { theme} = useTheme();
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/FlashcardsView', { state: { id, title, subtitle, type, content } });
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
        className="Upload-RecentHZ"
        onClick={handleViewClick}
        >
            <img src={image} alt="Upload preview" className="UploadImage-RecentHZ" />
            <div style={{
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'flex-start'
            }}>
                <div className='UploadTitle-RecentHZ'>
                    {title?.trim() ? title : 'Untitled'}
                </div>
                <div style={{
                    display: 'flex',
                    flexDirection: 'row',
                    justifyContent: 'flex-start',
                    gap: '20px',    
                }}>
                    {subtitle !== '' && (
                        <p className='UploadSubtitle-Recent'>
                            {subtitle}
                        </p>
                    )}
                    <div>
                        {(content?.length ?? 0)} Cards
                    </div>
                    <div>
                        {convertPythonTime(last_updated)}
                    </div>
                </div>
            </div>
        </button>
    )
}

export default RecentUpload;