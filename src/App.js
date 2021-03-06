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
import * as tf from "@tensorflow/tfjs";
// import {loadGraphModel} from '@tensorflow/tfjs-converter';

// import * as posenet from '@tensorflow-models/posenet';
import Webcam from "react-webcam";
import { createWorker,createScheduler  } from 'tesseract.js';


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
      "https://orangerx.b-cdn.net/model/model.json",
  };
  // https://github.com/naptha/tesseract.js/blob/master/docs/api.md#worker-set-parameters
  const [inputText, setInput] = useState("");
  const [imageData, setImageData] = useState("./hand.jpg");
  const [model, setModel] = useState();
  const [predictionData, setPredictionData] = useState("");
  const [start, setStart] = useState(false);
  const [fingerState, setFingerState] = useState([]);
  const [handDetected, setHandDetected] = useState(false)
  const [noOfBalloon, setBalloon] = useState(0)
  // const [score, setScore] = useState(0)
  const counterBaloon = useRef(0);
  const score = useRef(0);
 
  const scheduler = createScheduler();
  const worker = createWorker({
    logger: m => console.log(m),
  });

  const [ocr, setOcr] = useState('Recognizing...');

  const mounted = useRef(false);

  async function loadModel() {
    try {
      for (let i = 0; i < 4; i++) {
        const w = createWorker();
        await w.load();
        await w.loadLanguage('eng');
        await w.initialize('eng');
        console.log("worker"+i)
        scheduler.addWorker(w);
      }
    
      
      // await worker.terminate();
      // console.log("setloadedModel")
    } catch (err) {
      console.log(err);
      console.log("failed load model")

    }


  }




  async function predictionFunction() {
    // const poseNet = await net.estimateSinglePose(document.getElementById("img"), {
    //   flipHorizontal: false
    // });
    predictModel(model);
    
  }


  async function predictModel(model) {
    // const { data } = await worker.recognize(  "https://tesseract.projectnaptha.com/img/eng_bw.png");
      //  const { data } = await worker.recognize(  webcamRef.current.getScreenshot({width: 1920, height: 1080}));
    console.log(webcamRef.current.getScreenshot({width: 1920, height: 1080}))
       const data =  await  scheduler.addJob('recognize',  webcamRef.current.getScreenshot({width: 1920, height: 1080}));
    // );
      console.log(data)
      setOcr(data.data.text);
    // const predictions = await model.detect(
    //   document.getElementById("img")
    // );

   
  }




  useEffect(() => {
    tf.ready().then(() => {
      loadModel();
    });
  }, []);

  useEffect(()=>{
    //prevent initial triggering
    if (mounted.current) {
      predictionFunction()
      // generateBalloon()
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
          {predictionData ? null : (
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
          )}
           <Webcam
        // style={{ position: "absolute", bottom: "8px", right: "16px" }}
        audio={false}
        id="img"
        ref={webcamRef}
        // width={640}
        screenshotQuality={1}
        screenshotFormat="image/jpeg"
        videoConstraints={videoConstraints}
      />
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
