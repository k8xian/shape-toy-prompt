import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";

// HELPERS
import useMousePosition from "../../Helpers/mousePosition";
import { COLORS, OFFSET, VALUES, DRAW } from "../../Helpers/Constants";

// COMPONENTS
import ShapeControlRect from "./ShapeControls/ShapeControlRect";
import ShapeControlCirc from "./ShapeControls/ShapeControlCirc";

// STYLES
import * as Styled from './canvas.styles';

const canvasStyle = css`
  border: 1px solid gray;
`;

const Canvas = () => {
  const [circLocation, setCircLocation] = useState();
  const [circMov, setCircMov] = useState();
  const [circArea, setCircArea] = useState();
  const [showCirc, setShowCirc] = useState(false);

  const [rectLocation, setRectLocation] = useState();
  const [recMov, setRecMov] = useState();
  const [rectArea, setRectArea] = useState();
  const [showRect, setShowRect] = useState(false);

  const [dragInit, setDragInit] = useState();
  const [isDragging, setisDragging] = useState(false);

  const canvasRef = useRef(null);

  const { mouseX, mouseY } = useMousePosition();

  // clear canvas
  const clearCanvas = () => {
    if (canvasRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      //adding a white background for saving
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
  };

  //separate function to reset states
  const clearEverything = () => {
    setShowCirc(false);
    setCircLocation();
    setCircArea();
    setCircMov();
    setShowRect(false);
    setRectLocation();
    setRectArea();
    setRecMov();
    clearCanvas();
  };

  const drawRectangle = (param, select) => {
    const { x, y, w, h, c } = param;
    console.log(JSON.stringify(param));

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const offset = select === 1 ? OFFSET.SELECT : OFFSET.HOVER;

    if (showRect || select) {
      const highlight = {
        x: x - offset,
        y: y - offset,
        w: w + offset * 2,
        h: h + offset * 2,
        c: select === 1 ? COLORS.SELECT : COLORS.HOVER,
      };
      ctx.fillStyle = highlight.c;
      ctx.fillRect(highlight.x, highlight.y, highlight.w, highlight.h);
    }

    // drawing rectangle
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);

    setRectLocation(param);
  };

  const drawCircle = (param, select) => {
    const { x, y, r, c } = param;

    // getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const offset = select === 1 ? OFFSET.SELECT : OFFSET.HOVER;

    if (showCirc || select) {
      const highlight = {
        x: x,
        y: y,
        radius: r + offset,
        color: select === 1 ? COLORS.SELECT : COLORS.HOVER,
      };

      ctx.beginPath();
      ctx.arc(highlight.x, highlight.y, highlight.radius, 0, 2 * Math.PI);
      ctx.fillStyle = highlight.color;
      ctx.fill();
    }

    // drawing circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = c;
    ctx.fill();

    // setting initial location for circle
    setCircLocation(param);
  };

  // delete rectangle component
  const deleteRect = () => {
    setShowRect(false);
    setRectLocation();
    setRectArea();
    setRecMov();
    clearCanvas();
    if (circLocation) {
      drawCircle(circLocation);
    }
    // redraw circ
  };

  // delete circle component
  const deleteCirc = () => {
    setShowCirc(false);
    setCircLocation();
    setCircArea();
    setCircMov();
    clearCanvas();
    if (rectLocation) {
      drawRectangle(rectLocation);
    }
    // redraw rect
  };

  const resetCanvas = () => {
    clearCanvas();
    if (showRect && rectLocation) {
      drawRectangle(rectLocation, 1);
    } else if (rectLocation) {
      drawRectangle(rectLocation, false);
    }

    if (showCirc && circLocation) {
      drawCircle(circLocation, 1);
    } else if (circLocation) {
      drawCircle(circLocation, false);
    }
  };

  const getRectArea = () => {
    if (rectLocation && canvasRef) {
      const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
      tempObj.x.min = canvasRef.current.offsetLeft + rectLocation.x;
      tempObj.x.max = tempObj.x.min + rectLocation.w;
      tempObj.y.min = canvasRef.current.offsetTop + rectLocation.y;
      tempObj.y.max = tempObj.y.min + rectLocation.h;
      setRectArea(tempObj);
      //explicit return in case state change subject to rerender
      return tempObj;
    }
  };

  const getCircArea = () => {
    if (circLocation && canvasRef) {
      const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
      tempObj.x.min =
        canvasRef.current.offsetLeft + circLocation.x - circLocation.r;
      tempObj.x.max = tempObj.x.min + circLocation.r * 2;
      tempObj.y.min =
        canvasRef.current.offsetTop + circLocation.y - circLocation.r;
      tempObj.y.max = tempObj.y.min + circLocation.r * 2;
      setCircArea(tempObj);
      //explicit return in case state change subject to rerender
      return tempObj;
    }
  };

  // check location against rectangle location
  const checkMouseRect = (location) => {
    getRectArea();
    if (
      rectLocation &&
      location.x > rectArea.x.min &&
      location.x < rectArea.x.max &&
      location.y > rectArea.y.min &&
      location.y < rectArea.y.max
    ) {
      setShowRect(true);

      //saving the starting position
      setRecMov(rectLocation);
      //rerender with highlight
      drawRectangle(rectLocation, 1);
    } else if (!location.shift) {
      setShowRect(false);
      //removing highlight
      // drawRectangle(rectLocation, false);
    }
  };

  // check location against circle location
  const checkMouseCirc = (location) => {
    getCircArea();
    if (
      circLocation &&
      location.x > circArea.x.min &&
      location.x < circArea.x.max &&
      location.y > circArea.y.min &&
      location.y < circArea.y.max
    ) {
      setShowCirc(true);
      //saving the starting position
      setCircMov(circLocation);
      //rerender with highlight
      drawCircle(circLocation, 1);
    } else if (!location.shift) {
      setShowCirc(false);
      //remove highlight
      // drawCircle(circLocation, false);
    }
  };

  const handleMouseDown = (e) => {
    const click = { x: e.clientX, y: e.clientY, shift: e.shiftKey };
    checkMouseRect(click);
    checkMouseCirc(click);
    setisDragging(true);
    setDragInit({ x: click.x, y: click.y });
  };

  const handleMouseUp = (e) => {
    setisDragging(false);
    setDragInit();
    //updating latest location for when both move together
    setCircMov(circLocation);
    setRecMov(rectLocation);
    resetCanvas();
  };
  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

  const handleMouseMove = (e) => {
    const location = { x: e.clientX, y: e.clientY };
    //checking for hover
    if (!isDragging && location) {
      getRectArea();
      getCircArea();
      clearCanvas();
      if (
        rectLocation &&
        rectArea &&
        location.x > rectArea.x.min &&
        location.x < rectArea.x.max &&
        location.y > rectArea.y.min &&
        location.y < rectArea.y.max
      ) {
        drawRectangle(rectLocation, 2);
      } else if (rectLocation) {
        drawRectangle(rectLocation, false);
      }

      if (
        circLocation &&
        circArea &&
        location.x > circArea.x.min &&
        location.x < circArea.x.max &&
        location.y > circArea.y.min &&
        location.y < circArea.y.max
      ) {
        drawCircle(circLocation, 2);
      } else if (circLocation) {
        drawCircle(circLocation, false);
      }
    } else {
      const dX = e.clientX - dragInit.x;
      const dY = e.clientY - dragInit.y;

      //resetting to prevent snakes
      clearCanvas();
      if (showRect) {
        const rParam = {
          x: recMov.x + dX,
          y: recMov.y + dY,
          w: recMov.w,
          h: recMov.h,
          c: recMov.c,
        };
        drawRectangle(rParam, 1);
      }
      if (showCirc) {
        const cParam = {
          x: circMov.x + dX,
          y: circMov.y + dY,
          r: circMov.r,
          c: circMov.c,
        };
        drawCircle(cParam, 1);
      }
      if (!showRect && rectLocation) {
        drawRectangle(rectLocation, false);
      }
      if (!showCirc && circLocation) {
        drawCircle(circLocation, false);
      }
    }
  };

  // Save | Download image
  const downloadImage = (data, filename) => {
    var a = document.createElement("a");
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  };

  const saveCanvas = () => {
    //making sure background is white
    clearCanvas();
    resetCanvas();
    const dataURL = canvasRef.current.toDataURL("image/jpeg", 1.0);
    downloadImage(dataURL, "canvas.jpg");
  };

  return (
    <div>
      
      <div
        data-testid="left-pane"
        className={css`
        width: 30%;
        float: left;
        text-align: left;
        min-width: 600px;
    }
        `}
      >
        {" "}
        <canvas
          className={canvasStyle}
          ref={canvasRef}
          width={500}
          height={500}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          onMouseOut={handleMouseOut}
          onMouseMove={handleMouseMove}
        />
      </div>
      <div
        data-testid="right-pane"
        className={css`
          width: 30%;
          float: left;
        `}
      >
        {showRect && (
          <ShapeControlRect
            rectLocation={rectLocation}
            clearCanvas={clearCanvas}
            drawRectangle={drawRectangle}
            drawCircle={drawCircle}
            deleteRect={deleteRect}
          />
        )}
        {showCirc && (
          <ShapeControlCirc
            circLocation={circLocation}
            clearCanvas={clearCanvas}
            drawRectangle={drawRectangle}
            drawCircle={drawCircle}
            deleteCirc={deleteCirc}
          />
        )}
      </div>
    </div>
  );
}

export default Canvas;

//current defects- when selected, highlights no matter what on canvas
//hover is super weird and wonky

//explain why removed use effects

// todo

// fix highlight on hover
// local storage
// undo

// make it pretty

// refactor
// component for displaying content
// helper functions