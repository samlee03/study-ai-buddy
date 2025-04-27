import React from 'react'
import Header from '../components/Header'
import "../styles/UploadPage.css"
import { useTheme } from '../components/ThemeContext';
import { useDropzone } from 'react-dropzone'
import Upload from "../assets/upload.png"

const UploadPage = () => {
    const handleFileAdd = () => {
        document.getElementById("FileList").innerHTML = '';
        for (let i = 0; i < document.getElementById("FileDrop").files.length; i++) {
            const newFile = document.createElement("li");
            const fName = document.createTextNode("Document "+ (i+1) + ": "+ document.getElementById("FileDrop").files[i].name);
            newFile.appendChild(fName);
            document.getElementById("FileList").appendChild(newFile);
        }
    };
    const { theme } = useTheme();


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
                                    <h3>Drag & drop files or <span style={{ textDecoration: 'underline', cursor: 'pointer' }}>Browse</span></h3>


                                    <p>Supported Formats: pdf </p>
                            </div>
                            <div className='files-text-section'>
                                <h4>File to Upload</h4>
                                {acceptedFiles.length > 0 ? <div className='file-display'>{acceptedFiles[0].name}</div> : <p>No file selected</p>}<br></br>
                                <label htmlFor='title'>Title</label><br></br>
                                <input type='text' id='title' name='title'></input>                                
                                <label htmlFor='subtitle'>Subtitle</label><br></br>
                                <input type='text' id='subtitle' name='subtitle'></input>                                
                            </div>
                        </div>
                        <div>
                            <button>Upload</button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    )
}

export default UploadPage