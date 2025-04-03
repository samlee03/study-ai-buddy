import React from 'react'
import Header from '../components/Header'
import "../styles/UploadPage.css"
import { useTheme } from '../components/ThemeContext';

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
                <div className="Upload-container">
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
                </div>
            </div>
        </div>
    )
}

export default UploadPage