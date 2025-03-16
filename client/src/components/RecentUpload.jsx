import React from 'react'
import { useNavigate } from "react-router-dom";
import '../styles/RecentUpload.css';

const RecentUpload = ({title, subtitle, image, type}) => {
    const navigate = useNavigate();

    const handleViewClick = () => {
        navigate('/FlashcardTest', { state: { type } });
    };
    return (
        <div className='Upload-Recent'>
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