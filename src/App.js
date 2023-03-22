import './App.css';
import { useState } from 'react';
import Submit from './Submit';

function App() {
  const [url, setUrl] = useState('');
  const [output, setOutput] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (url.trim() === '') {
      alert('Please enter a valid URL.');
      return;
    }
    setIsLoading(true);
    try {
      const requestUrl = `http://localhost:3001/scrape?url=${url}`;
      const response = await fetch(requestUrl);
      if (!response.ok) {
        throw new Error(`Failed to fetch data (${response.status})`);
      }
      const data = await response.json();
      setOutput(data);
      setIsLoading(false);
    } catch (error) {
      setOutput({ error: error.message });
      setIsLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setUrl(event.target.value);
  };

  const handleButtonHover = (event) => {
    event.target.style.backgroundColor = '#006699';
  };

  const handleButtonLeave = (event) => {
    event.target.style.backgroundColor = '#0077b5';
  };

  return (
    <div className="container">
      <h1>LinkedIn Profile Scraper</h1>
      <p>Enter the URL of the LinkedIn profile you want to extract data from:</p>
      <form onSubmit={handleSubmit}>
        <input type="text" id="url-input" placeholder="e.g. https://www.linkedin.com/in/johndoe" value={url} onChange={handleInputChange} />
        <button type="submit" id="submit-button" onMouseOver={handleButtonHover} onMouseLeave={handleButtonLeave}>
          Extract Data
        </button>
      </form>
      {isLoading ? (
        <p>Loading...</p>
      ) : output.error ? (
        <p>Error: {output.error}</p>
      ) : (
        <div id="output">
          {output.Name && <Submit data={output} />}
        </div>
      )}
    </div>
  );
}

export default App;
