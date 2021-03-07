import React, { useEffect, useState, useRef } from "react";
import logo from "./logo.svg";
import {
  TextField,
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Box,
  IconButton,
  Button,
} from "@material-ui/core";
import './App.css'
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
// import * as cocoSsd from "@tensorflow-models/coco-ssd";
// import * as tf from "@tensorflow/tfjs-core";
// import * as tf from "@tensorflow/tfjs";
// import {loadGraphModel} from '@tensorflow/tfjs-converter';

// import * as posenet from '@tensorflow-models/posenet';
import Webcam from "react-webcam";
import { createWorker,createScheduler  } from 'tesseract.js';
import * as cvstfjs from '@microsoft/customvision-tfjs';


function App() {
  const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    menuButton: {
      marginRight: theme.spacing(2),
    },
    title: {
      flexGrow: 1,
    },
  }));
  const classes = useStyles();

  const url = {
    model:
      // "https://orangerx.b-cdn.net/model/model.json",

      "https://orangerx.b-cdn.net/tfjsModel/model.json",
  };
  const [imageData, setImageData] = useState("./pic2.jpg");
  const [model, setModel] = useState();
  const [predictionData, setPredictionData] = useState("");
  const [start, setStart] = useState(false);
  const [fingerState, setFingerState] = useState([]);
  const [handDetected, setHandDetected] = useState(false)

  const counterBaloon = useRef(0);
  const score = useRef(0);
 
  const scheduler = createScheduler();
  const worker = createWorker({
    logger: m => console.log(m),
  });

  const [ocr, setOcr] = useState('Recognizing...');

  const mounted = useRef(false);
 
  async function loadModel(url) {
    try {
      // const model = await tf.loadGraphModel(url.model);
      // const model = await tf.loadGraphModel("model.json");
      // setModel(model);
      // console.log("setloadedModel");

      // await worker.terminate();
      // console.log("setloadedModel")
    } catch (err) {
      console.log(err);
      console.log("failed load model");
    }
  }


  useEffect(() => {
    // tf.ready().then(() => {
    //   loadModel(url);
    // });
  }, []);



  async function predictionFunction() {
    //testing azure vision api
    let model = new cvstfjs.ObjectDetectionModel();
    await model.loadModelAsync("model.json");
    const image = document.getElementById('img');
    console.log(model)
    const result = await model.executeAsync(image);

    console.log(result)
    // predictModel(model);
    
  }


  async function predictModel(model) {
  //   console.log(model.inputs[0].shape[1]);
  //   let tensor = tf.browser
  //     .fromPixels(document.getElementById("img"), 3)
  //     .resizeNearestNeighbor([
  //       model.inputs[0].shape[1],
  //       model.inputs[0].shape[1],
  //     ]) // change the image size, depend on training image
  //     .expandDims()
  //     .toFloat();
  //   // .reverse(-1); // RGB -> BGR if old model needed

  //   let outputs = await model.predict(tensor).data();

	// let predictions = await outputs;
  // console.log(predictions)
  //   // console.log(processPrediction(predictions));

  //   if (predictions.length > 0) {
  //     setPredictionData(predictions);
  //     // console.log(predictions);
 
  //   }
  }

  useEffect(() => {
    //prevent initial triggering
    if (mounted.current) {
      predictionFunction();
      // generateBalloon()
    } else {
      mounted.current = true;
    }
  }, [start]);

  const ANCHORS = [0.573, 0.677, 1.87, 2.06, 3.34, 5.47, 7.88, 3.53, 9.77, 9.17];

  function _logistic(x) {
    if (x > 0) {
        return (1 / (1 + Math.exp(-x)));
    } else {
        const e = Math.exp(x);
        return e / (1 + e);
    }
  }
  

  // async function processPrediction(predictions){
  //   if (predictions.length != 3) {
 
  //       const num_anchor = ANCHORS.length / 2;
  //     const channels = predictions[0][0][0].length;
  //     const height = predictions[0].length;
  //     const width = predictions[0][0].length;
  
  //     const num_class = channels / num_anchor - 5;
  
  //     let boxes = [];
  //     let scores = [];
  //     let classes = [];
  
  //     for (var grid_y = 0; grid_y < height; grid_y++) {
  //       for (var grid_x = 0; grid_x < width; grid_x++) {
  //         let offset = 0;
  
  //         for (var i = 0; i < num_anchor; i++) {
  //           let x = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_x) / width;
  //           let y = (_logistic(predictions[0][grid_y][grid_x][offset++]) + grid_y) / height;
  //           let w = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2] / width;
  //           let h = Math.exp(predictions[0][grid_y][grid_x][offset++]) * ANCHORS[i * 2 + 1] / height;
  
  //           let objectness = tf.scalar(_logistic(predictions[0][grid_y][grid_x][offset++]));
  //           let class_probabilities = tf.tensor1d(predictions[0][grid_y][grid_x].slice(offset, offset + num_class)).softmax();
  //           offset += num_class;
  
  //           class_probabilities = class_probabilities.mul(objectness);
  //           let max_index = class_probabilities.argMax();
  //           boxes.push([x - w / 2, y - h / 2, x + w / 2, y + h / 2]);
  //           scores.push(class_probabilities.max().dataSync()[0]);
  //           classes.push(max_index.dataSync()[0]);
  //         }
  //       }
  //     }
  
  //     boxes = tf.tensor2d(boxes);
  //     scores = tf.tensor1d(scores);
  //     classes = tf.tensor1d(classes);
  
  //     const selected_indices = await tf.image.nonMaxSuppressionAsync(boxes, scores, 10);
  //     predictions = [await boxes.gather(selected_indices).array(), await scores.gather(selected_indices).array(), await classes.gather(selected_indices).array()];
  //   }
  
  //   return predictions;
  // }

  useEffect(()=>{
    //prevent initial triggering
    if (mounted.current) {
      // predictionFunction()
    } else {
      mounted.current = true;
    }
   
  }, [start])
 
  const videoConstraints = {
    height: 1080,
          width: 1920,
      // height: 120,
    facingMode: "environment"
  };


    const webcamRef = React.useRef(null);
   
 



  return (
    <div
      style={{
        width: "100%",
        height: "100%",
        marginTop: -8,
        backgroundImage:
          "radial-gradient( circle 993px at 0.5% 50.5%,  rgba(137,171,245,0.37) 0%, rgba(245,247,252,1) 100.2% )",
      }}
    >
      {/* <AppBar position="static">
        <Toolbar>
          <IconButton
            edge="start"
            className={classes.menuButton}
            color="inherit"
            aria-label="menu"
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" className={classes.title}>
            TensorflowJS Image Classification
          </Typography>
        </Toolbar>
      </AppBar> */}

      <Box mt={1} />
      <Grid
        container
        style={{
          height: "100vh",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          padding: 20,
        }}
      >
        <Grid
          item
          xs={12}
          md={12}
          style={{
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
        
            <>
              {" "}
              <Box mt={15} />
              <Typography
                align="center"
                style={{
                  fontSize: "50px",
                  fontWeight: "bold",
                  fontFamily: "Roboto",
                }}
              >
               {ocr}
              </Typography>
             
              <Box mt={2} />
              { (
                <Button
                  variant={"contained"}
                  style={{
                    color: "white",
                    backgroundColor: "blueviolet",
                    width: "50%",
                    maxWidth: "250px",
                  }}
                  onClick={() => {
                    predictionFunction()

                  }}
                >
                  Start Game
                </Button>
              )}
              <Box mt={2} />{" "}
            </>
       
           {/* <Webcam
        audio={false}
        id="img"
        ref={webcamRef}
        // width={640}
        screenshotQuality={1}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      /> */}
        <img
          style={{ width: "100%", objectFit: "fill" }}
          id="img"
          src={imageData}
        ></img> 
        </Grid>
        <Grid item xs={12} md={12}>
          {/* <canvas
          id="myCanvas"
          width={predictionData? 1280:0}
          height={predictionData? 720 : 0}
          style={{ backgroundColor: "transparent" }}
        /> */}
          {/* 
        <img
          style={{ width: "50%", objectFit: "fill" }}
          id="img"
          src={imageData}
        ></img> */}
        </Grid>
      </Grid>
     
      {start ? (
        handDetected ? null : (
          <>
            <div
              className={"blink_me"}
              style={{
                position: "absolute",
                textAlign: "center",
                bottom: "30px",
                left: "25px",
              }}
            >
              <Typography style={{ fontSize: 25, fontWeight: "bold" }}>
                ✋
              </Typography>
              <Typography style={{ fontSize: 20, fontWeight: "bold" }}>
                No Hand Detected
              </Typography>
            </div>
          </>
        )
      ) : null}
    </div>
  );
}

export default App;
