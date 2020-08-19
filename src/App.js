import React, { useState, useRef, useEffect } from "react";
import "./App.css";
import ml5 from "ml5";
import useInterval from "./hooks/useInterval";
import GaugeChart from "react-gauge-chart";

let classifier;

function App() {
  const videoRef = useRef();
  const [gaugeData, setGaugeData] = useState(false);
  const [shouldClassify, setShouldClassify] = useState(false);

  useEffect(() => {
    startVideo();

    return () => {
      stopVideo();
    };
  }, []);
  const startVideo = () => {
    classifier = ml5.imageClassifier("./my-model/model.json", () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: false })
          .then((stream) => {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
          });
      }
    });
  };
  const stopVideo = (e) => {
    if (videoRef.current) {
      let stream = videoRef.current.srcObject;
      let tracks = stream.getTracks();

      for (let i = 0; i < tracks.length; i++) {
        const track = tracks[i];
        track.stop();
      }
    }

    videoRef.current.srcObject = null;
  };
  useInterval(() => {
    if (classifier && shouldClassify) {
      classifier.classify(videoRef.current, (error, results) => {
        if (error) {
          console.error(error);
          return;
        }
        results.sort((a, b) => b.label.localeCompare(a.label));
        setGaugeData(results.sort((a, b) => b.label.localeCompare(a.label)));
      });
    }
  }, 500);
  return (
    <div className="App">
      <header className="App-header">
        <p>TensorflowJS con ml5 y TeachableMachine</p>
        {shouldClassify && gaugeData && (
          <>
            <small>
              [
              {` Etiqueta:${
                gaugeData[Object.keys(gaugeData)[0]]?.label
              }  probabilidad:
              ${gaugeData[Object.keys(gaugeData)[0]].confidence?.toFixed(
                2
              )} , Etiqueta: ${gaugeData[Object.keys(gaugeData)[1]]?.label}
                probabilidad :
              ${gaugeData[Object.keys(gaugeData)[1]].confidence?.toFixed(2)}
              `}
               ]
            </small>
            <GaugeChart
              id="gauge-chart4"
              nrOfLevels={10}
              arcPadding={0.1}
              cornerRadius={5}
              percent={
                +gaugeData[Object.keys(gaugeData)[0]].confidence?.toFixed(2)
              }
            />
          </>
        )}
        <button onClick={() => setShouldClassify(!shouldClassify)}>
          {shouldClassify ? "Dejar de monitorear" : "Empezar a Monitorear"}
        </button>
        <video
          ref={videoRef}
          style={{ transform: "scale(-1, 1)" }}
          width="300"
          height="150"
        />
      </header>
    </div>
  );
}

export default App;
