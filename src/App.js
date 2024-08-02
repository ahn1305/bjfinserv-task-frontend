import React, { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [jsonInput, setJsonInput] = useState('');
  const [error, setError] = useState(null);
  const [responseData, setResponseData] = useState(null);
  const [selectedOptions, setSelectedOptions] = useState([]);

  const handleInputChange = (e) => {
    setJsonInput(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const parsedData = JSON.parse(jsonInput);
      if (!parsedData.data) {
        throw new Error('Invalid JSON: Missing "data" field.');
      }
      setError(null);
      const response = await axios.post('https://bjfinserv-task.onrender.com/bfhl', parsedData);
      setResponseData(response.data);
    } catch (err) {
      setError('Invalid JSON input. Please enter valid JSON.');
      setResponseData(null);
    }
  };

  const handleOptionChange = (e) => {
    const { options } = e.target;
    const selected = [];
    for (const option of options) {
      if (option.selected) {
        selected.push(option.value);
      }
    }
    setSelectedOptions(selected);
  };

  const renderResponse = () => {
    if (!responseData) return null;

    const { alphabets, numbers, highest_alphabet } = responseData;
    const result = {};

    if (selectedOptions.includes('Alphabets')) {
      result.alphabets = alphabets;
    }
    if (selectedOptions.includes('Numbers')) {
      result.numbers = numbers;
    }
    if (selectedOptions.includes('Highest alphabet')) {
      result.highest_alphabet = highest_alphabet;
    }

    if (selectedOptions.length === 0) {
      return (
        <div className="response-container">
          <h3>Full Response</h3>
          <pre>{JSON.stringify(responseData, null, 2)}</pre>
        </div>
      );
    }

    return (
      <div className="response-container">
        <h3>Filtered Response</h3>
        <pre>{JSON.stringify(result, null, 2)}</pre>
      </div>
    );
  };

  return (
    <div className="App">
      <header className="App-header">
        <h1>Enter valid input</h1>
      </header>
      <main className="main-content">
        <form className="form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="jsonInput">JSON Input:</label>
            <textarea
              id="jsonInput"
              value={jsonInput}
              onChange={handleInputChange}
              rows="5"
              cols="50"
              className="input-field"
              placeholder='Enter JSON here, e.g., {"data": ["A","C","z"]}'
            />
          </div>
          {error && <div className="error">{error}</div>}
          <button type="submit" className="submit-button">Submit</button>
        </form>
        {responseData && (
          <div className="filter-container">
            <label htmlFor="filterSelect">Select data to display:</label>
            <select
              id="filterSelect"
              multiple={true}
              value={selectedOptions}
              onChange={handleOptionChange}
              className="filter-select"
            >
              <option value="Alphabets">Alphabets</option>
              <option value="Numbers">Numbers</option>
              <option value="Highest alphabet">Highest alphabet</option>
            </select>
            {renderResponse()}
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
