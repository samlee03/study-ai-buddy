import React from 'react'
import '../styles/NewUpload.css';

const NewUpload = ({title, subtitle, image}) => {
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
                <button>Button</button>
            </div>
        </div>
    )
}

export default NewUpload;