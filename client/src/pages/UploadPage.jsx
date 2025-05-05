import React, { useState } from 'react'
import Header from '../components/Header'
import "../styles/UploadPage.css"
import { useParams, useNavigate } from "react-router-dom"
import { useTheme } from '../components/ThemeContext';
import { useDropzone } from 'react-dropzone'
import Upload from "../assets/upload.png"

const UploadPage = () => {
    const { type } = useParams();
    const navigate = useNavigate();
    const [title, setTitle] = useState('')
    const [subtitle, setSubtitle] = useState('')
    const [comments, setComments] = useState('')
    // const handleFileAdd = () => {
    //     document.getElementById("FileList").innerHTML = '';
    //     for (let i = 0; i < document.getElementById("FileDrop").files.length; i++) {
    //         const newFile = document.createElement("li");
    //         const fName = document.createTextNode("Document "+ (i+1) + ": "+ document.getElementById("FileDrop").files[i].name);
    //         newFile.appendChild(fName);
    //         document.getElementById("FileList").appendChild(newFile);
    //     }
    // };
    const { theme } = useTheme();

    const handleTitle = (e) => {
      setTitle(e.target.value)
    }

    const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
        
        accept: {
            'text/pdf': ['.pdf'],
          }
    }
    );
  
    const files = acceptedFiles.map(file => (
        <li key={file.path}>
        {file.path} - {file.size} bytes
        </li>
    ));

    const handleUpload = async (file) => {
        if (!file){
          return ;
        }
        const formData = new FormData()
        formData.append('file', file)
        formData.append('title', title)
        formData.append('subtitle', subtitle)
        formData.append('comments', comments) 
        if (type == "normal"){
          try {
            const response = await fetch('/api/get_flashcard', {
              method: 'POST',
              body: formData,
            });
    
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json()
            navigate("/main")

          } catch (error) {
            console.error("Error:", error);
          }
        }
        else if(type == "shortResponse") {
          try {
            const response = await fetch('/api/get_short_response', {
              method: 'POST',
              body: formData,
            });
    
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json()
            navigate("/main")

          } catch (error) {
            console.error("Error:", error);
          }
        
        } else {
    
          
          try {
            const response = await fetch('/api/get_questions', {
              method: 'POST',
              body: formData,
            });
    
            if (!response.ok) throw new Error('Failed to extract text');
            const data = await response.json()
            navigate("/main")
          } catch (error) {
            console.error("Error:", error);
          }
        }
      }

    return (
        <div
            style={{
                '--primary': theme.primary,
                '--secondary': theme.secondary,
                '--background': theme.background,
                '--title': theme.title,
                '--subtitle': theme.subtitle,
                '--text': theme.textColor,
                '--border': theme.border,
                '--buttonBackground': theme.buttonBackground,
                '--buttonHover': theme.buttonHover,
                '--buttonText': theme.buttonText,
                '--buttonDisable': theme.buttonDisable,
                '--boxShadow': theme.boxShadow
            }}>
            <Header />
            <div className="Page-container-Main">
                <div className='upload-container-main'>
                    {/* <div className="Upload-container">
                        <form>
                            <label htmlFor="FileDrop">Drag and Drop Files Here:</label>
                            <input type="file" id="FileDrop" accept=".pdf" className="FileDrop" onInputCapture={handleFileAdd} multiple>
                            </input>
                            <label htmlFor="Upload-name">Upload Name:</label>
                            <input type="text"></input>
                            <input type="submit" value="Upload Files"></input>
                        </form>
                        <ul id="FileList">
                        </ul>
                    </div> */}
                    {/* Src: template from react-dropzone documentation */}
                    <section className="upload-file-container">
                        <div className='file-content'>

                            <div {...getRootProps({className: 'dropzone'})}>
                                <input {...getInputProps()} />
                                    <img className='file-upload-img' src={Upload} />
                                    <h3>Drag & drop files or <span style={{ textDecoration: 'underline'}}>Browse</span></h3>
                                    <p>Supported Formats: pdf </p>
                            </div>
                            <div className='files-text-section'>
                                <h4>File to Upload</h4>
                                {acceptedFiles.length > 0 ? <div className='file-display'>{acceptedFiles[0].name}</div> : <p>No file selected</p>}<br></br>
                                <label htmlFor='title'>Title</label><br></br>
                                <input type='text' id='title' name='title' placeholder='Title your upload..' onChange={(e) => setTitle(e.target.value)}></input>                                
                                <label htmlFor='subtitle' >Subtitle</label><br></br>
                                <input type='text' id='subtitle' name='subtitle'  placeholder='Add a subtitle..' onChange={(e) => setSubtitle(e.target.value)}></input>       
                                <label htmlFor='comments'>Comments</label><br></br>
                                <input type='textbox' id='comments' name='comments' placeholder='Any specific details you would like to let us know..' onChange={(e) => setComments(e.target.value)}></input>                       
                            </div>
                        </div>
                        <div>
                            <button className="upload-button" onClick={() => handleUpload(acceptedFiles[0])}>Upload</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default UploadPage