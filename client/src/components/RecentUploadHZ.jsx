import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/RecentUpload.css';
import { useTheme } from './ThemeContext';

const RecentUpload = ({id, title, subtitle, image, type, content}) => {
    const { theme} = useTheme();
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/FlashcardsView', { state: { id, title, subtitle, type, content } });
    };

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
                    {title}
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
                        Card Amount
                    </div>
                    <div>
                        Time
                    </div>
                </div>
            </div>
        </button>
    )
}

export default RecentUpload;