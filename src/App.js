import React, { useState } from "react";
import axios from "axios";
import "./styles.css";

const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    margin: "50px"
  },
  input: {
    height: "30px",
    width: "400px",
    fontSize: "20px",
    padding: "10px",
    marginBottom: "20px"
  },
  button: {
    height: "50px",
    width: "200px",
    fontSize: "20px",
    margin: "20px"
  },
  image: {
    height: "400px",
    width: "400px",
    margin: "20px"
  },
  result: {
    fontSize: "30px",
    margin: "20px"
  },
  "@media (max-width: 767px)": {
    container: {
      margin: "20px"
    },
    input: {
      width: "200px"
    },
    button: {
      width: "100px"
    },
    image: {
      height: "200px",
      width: "200px"
    }
  }
};

const ImageGame = () => {
  const [prompt, setPrompt] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [imageSource, setImageSource] = useState("");
  const [result, setResult] = useState("");

  const handleGenerate = async () => {
    const randomNum = Math.floor(Math.random() * 2) + 1;
    if (randomNum === 1) {
      const response = await axios.post(
        "https://api.openai.com/v1/images/generations",
        {
          prompt: prompt,
          size: "512x512"
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${process.env.REACT_APP_OPENAI_KEY}`
          }
        }
      );
      setImageUrl(response.data.data[0].url);
    } else {
      const response = await axios.get(
        `https://api.pexels.com/v1/search?query=${prompt}&per_page=1&page=1`,
        {
          headers: {
            Authorization: `Bearer ${process.env.REACT_APP_PEXELS_KEY}`
          }
        }
      );
      setImageUrl(response.data.photos[0].src.original);
    }
  };

  const handleGuess = (guess) => {
    if (guess === imageSource) {
      setResult("Correct");
    } else {
      setResult("Incorrect");
    }
  };

  const handleReset = () => {
    setPrompt("");
    setImageUrl("");
    setResult("");
  };

  return (
    <div style={styles.container}>
      <h1 style={{ fontSize: "50px" }}>Bot or Not Game</h1>
      <a href="https://www.pexels.com" style={{ padding: "12px" }}>
        Human Photos by Pexels
      </a>
      <input
        type="text"
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        style={styles.input}
      />
      <button onClick={handleGenerate} style={styles.button}>
        Generate
      </button>
      {imageUrl ? <img src={imageUrl} alt={prompt} style={styles.image} /> : ""}
      {imageUrl ? (
        <div>
          <button onClick={() => handleGuess("AI")} style={styles.button}>
            AI
          </button>
          <button onClick={() => handleGuess("Human")} style={styles.button}>
            Human
          </button>
        </div>
      ) : (
        ""
      )}
      {result ? <p style={styles.result}>Result: {result}</p> : ""}
      {result ? (
        <button onClick={handleReset} style={styles.button}>
          Reset
        </button>
      ) : (
        ""
      )}
      <a href="https://www.nikhildesigns.com" style={{ padding: "12px" }}>
        Made By Nikhil Designs
      </a>
    </div>
  );
};

export default ImageGame;
