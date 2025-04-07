import React from 'react'
import { useState, useEffect } from 'react'
import Header from '../components/Header'
// import Cookies from 'js-cookie'
import { useNavigate } from 'react-router-dom';
import CheckAuth from '../components/CheckAuth';
const Test = () => {
  
  // const [cookies] = useCookies(['token']);
  const { isLoggedIn } = CheckAuth();
  if (isLoggedIn){
    return (
      <>
        <Header />
        <GetCookie/>
        <p>TOken exists!</p>
        

        {/* <Questions/> */}
        <FileUpload type="mcq"/>
        <br></br>
        <FileUpload type="flashcard"/>
      </>
    )
    
  } else {
    return (<><Header/></>)
  }
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

const FileUpload = ({type}) => {
  const [file, setFile] = useState();
  const [text, setText] = useState([]);
  useEffect(() => {
    console.log(text)
  }, [text])
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
    if (type == "flashcard"){
      try {
        const response = await fetch('/api/get_flashcard', {
          method: 'POST',
          body: formData,
        });

        if (!response.ok) throw new Error('Failed to extract text');
        const data = await response.json()
        setText(data.text);

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
        setText(data.text);
      } catch (error) {
        console.error("Error:", error);
      }
    }
  }
  return (
    <>
      <button onClick={handleExtractText}>Extract Text for {type}</button>
      <input type="file" onChange={handleFileChange} />
      {/* <p>{text}</p> */}
      {/* {text.map((e, i) => {
          return <div key={i}>
            <p><strong>{e.front}</strong></p>
            <p>{e.back}</p>
          </div>
        })
      } */}
    </>
  )
}

const GetCookie = () => {
  const handleCookie = async() => {
    fetch('http://localhost:5000/api/cookie', {method: "GET", credentials: 'include'})
    .then(response => response.json())
    .then(data => {
      console.log(data)
    })
  }
  return (
    <>
      <div>
        <button onClick={handleCookie}>Get Cookie</button>
      </div>
    </>
  )
}
export default Test