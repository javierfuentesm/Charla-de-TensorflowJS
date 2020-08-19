import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ml5 from "ml5";
import leon from "./leon.jpg";

function App() {
  const [predictions, setPredictions] = useState([]);
  const imgRef = useRef();

  const classify = async () => {
    const classifier = ml5.imageClassifier("MobileNet", () => {
      console.log("El modelo esta listo ");
    });

    const result = await classifier.predict(
      imgRef.current,
      5,
      (err, results) => results
    );
    setPredictions(result);
  };

  useEffect(() => {
    classify();
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={leon} ref={imgRef} id="image" width="400" alt="" />
        {predictions.length > 0 && (
          <>
            {predictions.map(({ label, confidence }, index) => (
              <div key={index}>
                {index + 1}. Predicción: {label} con {confidence.toFixed(2)}
              </div>
            ))}
          </>
        )}
      </header>
    </div>
  );
}

export default App;
