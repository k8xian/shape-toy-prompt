import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";

// UTILS
import { COLORS, OFFSET, VALUES, DRAW } from "../../utils/Constants";
import { findRectArea, findCircArea, checkArea } from "../../utils/Helpers";

// COMPONENTS
import ShapeControl from "./ShapeControl";

// STYLES
import * as Styled from "./canvas.styles";

const canvasStyle = css`
  border: 1px solid gray;
`;

const Canvas = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  // current location of circle
  const [circLocation, setCircLocation] = useState(() => {
    const savedCirc = localStorage.getItem("circle");
    const storedValue = JSON.parse(savedCirc);
    return storedValue || "";
  });
  // location of circle when it beings moving
  const [circMov, setCircMov] = useState();
  // current relative area of circle
  const [circArea, setCircArea] = useState();
  // whether circle is selected
  const [showCirc, setShowCirc] = useState(false);

  // current location of rectangle
  const [rectLocation, setRectLocation] = useState(() => {
    const savedRect = localStorage.getItem("rectangle");
    const storedValue = JSON.parse(savedRect);
    return storedValue || "";
  });
  // location of circle when it beings moving
  const [recMov, setRecMov] = useState();
  // current relative area of circle
  const [rectArea, setRectArea] = useState();
  // whether circle is selected
  const [showRect, setShowRect] = useState(false);

  // mouse location when dragging begins
  const [dragInit, setDragInit] = useState();
  //when dragging is actively happening
  const [isDragging, setisDragging] = useState(false);

  const canvasRef = useRef(null);

  //saving the current location of each to the canvas
  const storeCanvas = () => {
    if (rectLocation) {
      localStorage.setItem("rectangle", JSON.stringify(rectLocation));
    }

    if (circLocation) {
      localStorage.setItem("circle", JSON.stringify(circLocation));
    }
  };

  // clear canvas
  const clearCanvas = () => {
    if (canvasRef) {
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // adding a white background for saving
      ctx.fillStyle = "#FFFFFF";
      ctx.fillRect(0, 0, canvas.width, canvas.height);
    }
    storeCanvas();
  };

  //resetting the canvas according to current state
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
    storeCanvas();
  };

  // separate function to reset states too
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
    //clearing local storage
    localStorage.removeItem("rectangle");
    localStorage.removeItem("circle");
  };

  // restoring local storage on load
  useEffect(() => {
    if (!isInitialized && canvasRef) {
      resetCanvas();
      setIsInitialized(true);
    }
  }, [isInitialized]);

  // drawing rectangle and hover/select
  const drawRectangle = (param, select) => {
    const { x, y, w, h, c } = param;

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
    storeCanvas();
  };

  // drawing circle and hover/select
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
    storeCanvas();
  };

  //finding current relative position of shapes
  const findAreas = () => {
    let areaR;
    let areaC;
    if (rectLocation) {
      areaR = findRectArea(
        rectLocation,
        canvasRef.current.offsetLeft,
        canvasRef.current.offsetTop
      );
      setRectArea(areaR);
    }

    if (circLocation) {
      areaC = findCircArea(
        circLocation,
        canvasRef.current.offsetLeft,
        canvasRef.current.offsetTop
      );
      setCircArea(areaC);
    }
    return { areaR, areaC };
  };

  // delete rectangle component
  const deleteRect = () => {
    setShowRect(false);
    setRectLocation();
    setRectArea();
    setRecMov();
    clearCanvas();
    localStorage.removeItem("rectangle");
    // restore circle
    if (circLocation) {
      drawCircle(circLocation);
    }
  };

  // delete circle component
  const deleteCirc = () => {
    setShowCirc(false);
    setCircLocation();
    setCircArea();
    setCircMov();
    clearCanvas();
    localStorage.removeItem("circle");
    // restore rectangle
    if (rectLocation) {
      drawRectangle(rectLocation);
    }
  };

  // check location against rectangle location
  const checkMouseRect = (location) => {
    const a = findAreas();
    const { areaR } = a;
    const { x, y } = areaR;
    if (rectLocation && checkArea(location, x, y)) {
      setShowRect(true);
      // saving the starting position
      setRecMov(rectLocation);
      // rerender with highlight
      drawRectangle(rectLocation, 1);
    } else if (!location.shift) {
      setShowRect(false);
      // removing highlight
      // drawRectangle(rectLocation, false);
    }
  };

  // check location against circle location
  const checkMouseCirc = (location) => {
    const a = findAreas();
    const { areaC } = a;
    const { x, y } = areaC;
    if (circLocation && checkArea(location, x, y)) {
      setShowCirc(true);
      // saving the starting position
      setCircMov(circLocation);
      // rerender with highlight
      drawCircle(circLocation, 1);
    } else if (!location.shift) {
      setShowCirc(false);
      // remove highlight
      // drawCircle(circLocation, false);
    }
  };

  const handleMouseDown = (e) => {
    const click = { x: e.clientX, y: e.clientY, shift: e.shiftKey };
    if (rectLocation) {
      checkMouseRect(click);
    }
    if (circLocation) {
      checkMouseCirc(click);
    }
    setisDragging(true);
    setDragInit({ x: click.x, y: click.y });
  };

  const handleMouseUp = (e) => {
    setisDragging(false);
    setDragInit();
    // updating latest location for when both move together
    setCircMov(circLocation);
    setRecMov(rectLocation);
    resetCanvas();
  };
  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };


  const handleMouseMove = (e) => {
    const location = { x: e.clientX, y: e.clientY };
    console.log("location", location);
    // checking for hover
    if (!isDragging && location) {
      const a = findAreas();
      console.log("areas", a);
      const { areaR, areaC } = a;
      clearCanvas();
      if (rectLocation && checkArea(location, areaR.x, areaR.y)) {
        drawRectangle(rectLocation, 2);
      } else if (rectLocation) {
        drawRectangle(rectLocation, false);
      }
      if (circLocation && checkArea(location, areaC.x, areaC.y)) {
        drawCircle(circLocation, 2);
      } else if (circLocation) {
        drawCircle(circLocation, false);
      }
      // else if we are dragging an object
    } else {
      const dX = e.clientX - dragInit.x;
      const dY = e.clientY - dragInit.y;

      // resetting to prevent snakes
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
      storeCanvas();
    }
  };

  // Save | Download image
  const downloadImage = (data, filename) => {
    const a = document.createElement("a");
    a.href = data;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
  };

  const saveCanvas = () => {
    // making sure background is white
    clearCanvas();
    resetCanvas();
    const dataURL = canvasRef.current.toDataURL("image/jpeg", 1.0);
    downloadImage(dataURL, "canvas.jpg");
  };

  return (
    <div>
      <Styled.Title>shape toy prompt | kate christian</Styled.Title>
      <Styled.ButtonPane>
        <Styled.ControlButtons
          data-testid="draw-rectangle-button"
          type="button"
          disabled={rectLocation}
          onClick={() => drawRectangle(DRAW.RECT)}
        >
          draw rectangle
        </Styled.ControlButtons>
        <Styled.ControlButtons
          data-testid="draw-circle-button"
          type="button"
          disabled={circLocation}
          onClick={() => drawCircle(DRAW.CIRC)}
        >
          draw circle
        </Styled.ControlButtons>
        <Styled.ControlButtons
          data-testid="clear-button"
          disabled={!circLocation && !rectLocation}
          onClick={() => {
            clearEverything();
          }}
        >
          clear
        </Styled.ControlButtons>
        <Styled.ControlButtons
          type="button"
          data-testid="save-button"
          disabled={!rectLocation && !circLocation}
          onClick={saveCanvas}
        >
          save
        </Styled.ControlButtons>
      </Styled.ButtonPane>

      <div
        data-testid="left-pane"
        className={css`
        width: 502px;
        float: left;
        text-align: left;
    }
        `}
      >
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
        data-testid="control-pane"
        className={css`
          width: 30%;
          min-width: 300px;
          float: left;
        `}
      >
        {showRect && (
          <ShapeControl
            shapeLocation={rectLocation}
            otherShapeLocation={circLocation}
            clearCanvas={clearCanvas}
            draw={drawRectangle}
            drawOther={drawCircle}
            deleteShape={deleteRect}
            isCircle={false}
          />
        )}
        {showCirc && (
          <ShapeControl
            shapeLocation={circLocation}
            otherShapeLocation={rectLocation}
            clearCanvas={clearCanvas}
            draw={drawCircle}
            drawOther={drawRectangle}
            deleteShape={deleteCirc}
            isCircle
          />
        )}
      </div>
    </div>
  );
};

export default Canvas;

// todo
// fix hover bug with whole canvas being targeted (probably related)
// refactor
// deploy
// add instructions for running locally
