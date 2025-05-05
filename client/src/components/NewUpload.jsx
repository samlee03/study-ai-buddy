import React from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../styles/NewUpload.css';
import { useTheme } from '../components/ThemeContext';
import Upload from "../assets/upload.png"

const NewUpload = ({title, subtitle, image, type}) => {
    const { theme} = useTheme();
    let navigate = useNavigate();
    const handleClick = () => {
        navigate('/upload');
    };
    const handleAddClick = () => {
        let content = [];
        if (type == "question"){
            content = [{"question" : "", "options" : [""], "answer" : ""}]
        }
        else if(type == "shortResponse") {
            content = [{"question" : "", "answer" : ""}]
        }
        else{
            content = [{"front" : "", "back" : ""}]
        }

        navigate('/FlashcardsView', { state: { 
            id : 0, title : "", subtitle : "", type, content
        }});
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
                {/* <p className='UploadSubtitle-New'>
                    {subtitle}
                </p> */}
                <div className='UploadButtonContainer-New'>
                    <Link to={`/upload/` + type} className="Upload-button-New" onClick={handleClick}>
                        <img src={Upload} alt="Upload" className="Upload-icon" />
                    </Link>
                    <button className="Upload-button-New" onClick={handleAddClick}>
                        +
                    </button>
                </div>
            </div>
        </div>
    )
}

export default NewUpload;