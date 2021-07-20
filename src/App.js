import React, { useEffect, useState, useRef } from "react";
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
import "./App.css";
import MenuIcon from "@material-ui/icons/Menu";
import { makeStyles } from "@material-ui/core/styles";

import Webcam from "react-webcam";
import * as cvstfjs from "@microsoft/customvision-tfjs";

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

  // const [start, setStart] = useState(false);
  const webcamRef = React.useRef(null);

  const [videoWidth, setVideoWidth] = useState(0);
  const [videoHeight, setVideoHeight] = useState(0);

  // const mounted = useRef(false);

  async function predictionFunction() {
    setVideoHeight(webcamRef.current.video.videoHeight);
    setVideoWidth(webcamRef.current.video.videoWidth);
    //testing azure vision api
    let model = new cvstfjs.ObjectDetectionModel();
    await model.loadModelAsync("model.json");
    // const image = document.getElementById("img");
    // console.log(model);
    // const result = await model.executeAsync(image);

    const predictions = await model.executeAsync(
      document.getElementById("img")
    );

    console.log(videoWidth);
    console.log(videoHeight);
    var cnvs = document.getElementById("myCanvas");

    cnvs.style.position = "absolute";

    var ctx = cnvs.getContext("2d");
    ctx.clearRect(0, 0, cnvs.width, cnvs.height);

    console.log(predictions);
    if (predictions[0].length > 0) {
      for (let n = 0; n < predictions[0].length; n++) {
        // Check scores
        if (predictions[1][n] > 0.5) {
          const p = document.createElement("p");
          p.innerText =
            "Pill" +
            ": " +
            Math.round(parseFloat(predictions[1][n]) * 100) +
            "%";
          console.log(predictions[0][n][0]);
          console.log(videoWidth);
          let bboxLeft =
            predictions[0][n][0] * webcamRef.current.video.videoWidth;
          let bboxTop =
            predictions[0][n][1] * webcamRef.current.video.videoHeight;
          let bboxWidth =
            predictions[0][n][2] * webcamRef.current.video.videoWidth -
            bboxLeft;
          let bboxHeight =
            predictions[0][n][3] * webcamRef.current.video.videoHeight -
            bboxTop;

          console.log("bboxLeft: " + bboxLeft);
          console.log("bboxTop: " + bboxTop);

          console.log("bboxWidth: " + bboxWidth);

          console.log("bboxHeight: " + bboxHeight);

          ctx.beginPath();
          ctx.font = "28px Arial";
          ctx.fillStyle = "red";

          ctx.fillText(
            "Pill" +
              ": " +
              Math.round(parseFloat(predictions[1][n]) * 100) +
              "%",
            bboxLeft,
            bboxTop + 70
          );

          ctx.rect(bboxLeft, bboxTop + 80, bboxWidth, bboxHeight);
          ctx.strokeStyle = "#FF0000";

          ctx.lineWidth = 3;
          ctx.stroke();

          console.log("detected");
        }
      }
      setTimeout(() => predictionFunction(), 500);
    }
  }

  // useEffect(() => {
  //   //prevent initial triggering
  //   if (mounted.current) {
  //     console.log("hello");
  //     predictionFunction();
  //   } else {
  //     mounted.current = true;
  //   }
  // }, [start]);


  const videoConstraints = {
    height: 1080,
    width: 1920,
    // height: 120,
    facingMode: "environment",
  };

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
      <AppBar position="static">
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
            Pill Detection
          </Typography>
        </Toolbar>
      </AppBar>

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
            <Box mt={2} />
            {
              <Button
                variant={"contained"}
                style={{
                  color: "white",
                  backgroundColor: "blueviolet",
                  width: "50%",
                  maxWidth: "250px",
                }}
                onClick={() => {
                  predictionFunction();
                }}
              >
                Start Detect
              </Button>
            }
            <Box mt={2} />{" "}
          </>
          <canvas
            id="myCanvas"
            width={videoWidth}
            height={videoHeight}
            style={{ backgroundColor: "transparent" }}
          />
          <Webcam
            audio={false}
            id="img"
            ref={webcamRef}
            //  width={640}
            screenshotQuality={1}
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
          />
          {/* <img
          style={{ width: "100%", objectFit: "fill" }}
          id="img"
          src={imageData}
        ></img>  */}
        </Grid>
        <Grid item xs={12} md={12}></Grid>
      </Grid>
    </div>
  );
}

export default App;
