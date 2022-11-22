import logo from './logo.png';
import './App.css';
import React, { useState, useEffect }  from 'react';

function App() {

  const [error, setError] = useState(null);
  const [isLoaded, setIsLoaded] = useState(false);
  const [messages, setMessages] = useState([]);

  useEffect(() => {
    fetch(process.env.REACT_APP_API_URL)
      .then(res => res.json())
      .then((data) => {
        setIsLoaded(true);
        setMessages(data);
      },
      (error) => {
        setIsLoaded(true);
        setError(error);
      })
    }, [])

  if (error) {
    return <div>Error: {error.message}</div>;
  } else if (!isLoaded) {
    return <div>Loading...</div>;
  } else {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <p>
            The Demo API says:
            <br></br>
            { messages.appName } { messages.message }
          </p>
          <a
            className="App-link"
            href="https://gbh.com.do/careers/"
            target="_blank"
            rel="noopener noreferrer"
          >
            See our open positions!
          </a>
        </header>
      </div>
    );
  }
}

export default App;
