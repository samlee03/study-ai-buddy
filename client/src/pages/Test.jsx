import React from 'react'
import { useState, useEffect } from 'react'
const Test = () => {
  return (
    <>
      <Questions/>
      <FileUpload/>
    </>
  )
}
const Questions = () => {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:5000/api/test")
    .then(response => response.json())
    .then(data => setData(data))
  }, [])
  return (
    <div>
      <div>Questions</div>
      {(typeof data === 'undefined') ? (
        <p>loading</p>
      ) : (
        <div>
          {data.questions.map((e, i) => {
            return (
              <div key={i}>
                <p>{e.question}</p>
                <ul>
                  {e.options.map((e, i) => {
                    return <li key={i}>{e}</li>
                  })}
                </ul>
              </div>
            )
          })}
        </div> 
      )}
    </div>
  )
}

const FileUpload = () => {
  const [file, setFile] = useState();
  const [response, setResponse] = useState();
  const [text, setText] = useState();
  const handleFileChange = (e) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
    }
  }

  const handleExtractText = async () => {
    if (!file){
      return ;
    }
    const formData = new FormData()
    formData.append('file', file)
    try {
      const response = await fetch('http://localhost:5000/api/readpdf', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to extract text');
      const data = await response.json()
      setText(data.text);
    } catch (error) {
      console.error("Error:", error);
    }
    console.log("sent?");
  }
  return (
    <>
      <button onClick={handleExtractText}>Extract Text</button>
      <input type="file" onChange={handleFileChange} />
      
      <p>{text}</p>
    </>
  )
}
export default Test