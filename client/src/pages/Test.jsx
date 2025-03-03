import React from 'react'
import { useState, useEffect } from 'react'
const Test = () => {
  const [data, setData] = useState();
  useEffect(() => {
    fetch("http://localhost:5000/api/test")  // Use the relative path
      .then(response => response.json())
      .then(data => setData(data))
      .catch(error => console.error('Error fetching data:', error));
  }, []);
  return (
    <>
      <div>Questions</div>
      {(typeof data === 'undefined') ? (
        <p>loading</p>
      ) : (
        <div>
          {data.questions.map((e, i) => {
            return (
              <div index={i}>
                <p>{e.question}</p>
                <ul>
                  {e.options.map((e, i) => {
                    return <li index={i}>{e}</li>
                  })}
                </ul>
              </div>
            )
          })}
        </div> 
      )}
    </>
  )
}

export default Test