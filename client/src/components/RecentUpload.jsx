import React from 'react'
import '../styles/RecentUpload.css';

const RecentUpload = ({title, subtitle, image}) => {
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
                <button>Button</button>
            </div>
        </div>
    )
}

export default RecentUpload;