import React from 'react'
import { useNavigate } from 'react-router-dom';
import '../styles/NewUpload.css';

const NewUpload = ({title, subtitle, image}) => {
    let navigate = useNavigate();
    const handleClick = () => {
        navigate('/upload');
    };
    return (
        <div className='Upload-New'>
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