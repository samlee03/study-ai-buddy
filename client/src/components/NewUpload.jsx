import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom';
import '../styles/NewUpload.css';
import { useTheme } from '../components/ThemeContext';
import Upload from "../assets/upload.png"
import { v4 as uuidv4 } from 'uuid';
import { sub } from 'date-fns';

const NewUpload = ({title, subtitle, image, type}) => {
    const { theme} = useTheme();
    const [isHovered, setIsHovered] = useState(false);
    
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
            id : uuidv4(), title : "", subtitle : "", type, content
        }});
    };
    return (
        <div
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)} 
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
            className='NewUploadMain'
        >
            <div className='Upload-New'>
                <img src={image} alt="Upload preview" className="UploadImage-New" />
                <div className="UploadContent-New">
                    <div className='UploadTitle-New'>
                        {title}
                    </div>
                    <div className='UploadButtonContainer-New'>
                        <div className="UploadButtonWrapper">
                            <Link to={`/upload/` + type} className="Upload-button-New" onClick={handleClick}>
                                <img src={Upload} alt="Upload" className="Upload-icon" />
                            </Link>
                            {isHovered && <div className="UploadButtonLabel">Upload New</div>}
                        </div>
                        <div className="UploadButtonWrapper">
                            <button className="Upload-button-New" onClick={handleAddClick}>
                                +
                            </button>
                            {isHovered && <div className="UploadButtonLabel">Create Blank</div>}
                        </div>
                    </div>
                </div>
            </div>
            <div className='UploadSubtitle-New'> 
                {subtitle}
            </div>
        </div>
    )
}

export default NewUpload;