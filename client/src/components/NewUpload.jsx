import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/NewUpload.css';
import { useTheme } from '../components/ThemeContext';

const NewUpload = ({title, subtitle, image}) => {
    const { theme} = useTheme();
    let navigate = useNavigate();
    const handleClick = () => {
        navigate('/upload');
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
        className='Upload-New'>
            <img src={image} alt="Upload preview" className="UploadImage-New" />
            <div className="UploadContent-New">
                <div className='UploadTitle-New'>
                    {title}
                </div>
                <p className='UploadSubtitle-New'>
                    {subtitle}
                </p>
                <button className="Upload-button" onClick={handleClick}>Upload</button>
            </div>
        </div>
    )
}

export default NewUpload;