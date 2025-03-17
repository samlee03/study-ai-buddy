import React from 'react'
import Header from '../components/Header'
import "../styles/UploadPage.css"

const UploadPage = () => {
  return (
    <div>
      <Header/>
          <div className="Page-container">
              <div className="Upload-block">
                  <div className="Upload-title"><h1 className="Upload-header">New Math Study</h1></div>
                  <div className="Second-block">
                    <div className="Drop-area"> Drag and drop files here!
                    </div>
                    <div className="Drop-list">
                    </div>
                  </div>
              </div>
          </div>
    </div>
  )
}

export default UploadPage