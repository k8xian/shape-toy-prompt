import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";

// HELPERS
import useMousePosition from "../../Helpers/mousePosition";
import { COLORS, OFFSET, VALUES, DRAW } from "../../Helpers/Constants";

// COMPONENTS
import ShapeControlRect from "./ShapeControls/ShapeControlRect";
import ShapeControlCirc from "./ShapeControls/ShapeControlCirc";

// STYLES
import * as Styled from "./canvas.styles";

const canvasStyle = css`
  border: 1px solid gray;
`;

const Canvas = () => {
  const [isInitialized, setIsInitialized] = useState(false);

  const [circLocation, setCircLocation] = useState(() => {
    const savedCirc = localStorage.getItem("circle");
    const storedValue = JSON.parse(savedCirc);
    return storedValue || "";
  });
  const [circMov, setCircMov] = useState();
  const [circArea, setCircArea] = useState();
  const [showCirc, setShowCirc] = useState(false);

  const [rectLocation, setRectLocation] = useState(() => {
    const savedRect = localStorage.getItem("rectangle");
    const storedValue = JSON.parse(savedRect);
    return storedValue || "";
  });
  const [recMov, setRecMov] = useState();
  const [rectArea, setRectArea] = useState();
  const [showRect, setShowRect] = useState(false);

  const [dragInit, setDragInit] = useState();
  const [isDragging, setisDragging] = useState(false);

  const canvasRef = useRef(null);

  const { mouseX, mouseY } = useMousePosition();


//saving the current location of each to the canvas
  const storeCanvas = () => {
    if (rectLocation){
      localStorage.setItem("rectangle", JSON.stringify(rectLocation));
    }

    if (circLocation){
      localStorage.setItem("circle", JSON.stringify(circLocation))
    }
  }

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

  // separate function to reset states
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
    storeCanvas();
  };

  // restoring local storage
  useEffect(() => {
    if (!isInitialized && canvasRef){
      resetCanvas();
      setIsInitialized(true);
    }

  }, [isInitialized]);




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
  

  // delete rectangle component
  const deleteRect = () => {
    setShowRect(false);
    setRectLocation();
    setRectArea();
    setRecMov();
    clearCanvas();
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
    // restore rectangle
    if (rectLocation) {
      drawRectangle(rectLocation);
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
      // explicit return in case state change subject to rerender
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
      // explicit return in case state change subject to rerender
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
    getCircArea();
    if (
      circLocation &&
      location.x > circArea.x.min &&
      location.x < circArea.x.max &&
      location.y > circArea.y.min &&
      location.y < circArea.y.max
    ) {
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
    checkMouseRect(click);
    checkMouseCirc(click);
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
    // checking for hover
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
      <Styled.Title>shape toy prompt</Styled.Title>
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
          save button
        </Styled.ControlButtons>
      </Styled.ButtonPane>

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
          <div
            className={css`
              display: flex;
              flex-direction: column;
            `}
          >
            <h2>Rectangle location</h2>X location: {rectLocation.x}Y location"{" "}
            {rectLocation.y}
            <label htmlFor="height">Height: {rectLocation.h}px</label>
            <input
              type="range"
              id="rect-height"
              name="height"
              min="30"
              max="300"
              value={rectLocation.h}
              onChange={(e) => {
                clearCanvas();
                drawRectangle({ ...rectLocation, h: e.target.value }, 1);
                if (circLocation) {
                  drawCircle(circLocation);
                }
              }}
            />
            <label htmlFor="width">Width: {rectLocation.w}px</label>
            <input
              type="range"
              id="rect-width"
              name="width"
              min="30"
              max="300"
              value={rectLocation.w}
              onChange={(e) => {
                clearCanvas();
                drawRectangle({ ...rectLocation, w: e.target.value }, 1);
                if (circLocation) {
                  drawCircle(circLocation);
                }
              }}
            />
            <label htmlFor="rect-color">Color</label>
            <input
              type="color"
              id="rect-color"
              name="rect-color"
              value={rectLocation.c}
              onChange={(e) => {
                clearCanvas();
                drawRectangle({ ...rectLocation, c: e.target.value }, 1);
                if (circLocation) {
                  drawCircle(circLocation);
                }
              }}
            />
            <button type="button" data-testid="clear-rect" onClick={deleteRect}>
              delete
            </button>
          </div>
        )}
        {showCirc && (
          <div
          className={css`
            display: flex;
            flex-direction: column;
          `}
        >
          <h2>Circle location</h2>X location: {circLocation.x}Y location:{" "}
          {circLocation.y}
          <label htmlFor="width">Radius: {circLocation.r}px</label>
          <input
            type="range"
            id="radius"
            name="radius"
            min="15"
            max="150"
            value={circLocation.r}
            onChange={(e) => {
              clearCanvas();
              drawCircle({ ...circLocation, r: e.target.value }, 1);
              if (rectLocation) {
                drawRectangle(rectLocation);
              }
            }}
          />
          <input
            type="color"
            id="circ-color"
            name="circ-color"
            value={circLocation.c}
            onChange={(e) => {
              clearCanvas();
              drawCircle({ ...circLocation, c: e.target.value }, 1);
              if (rectLocation) {
                drawRectangle(rectLocation);
              }
            }}
          />
          <button type="button" data-testid="clear-circ" onClick={deleteCirc}>
            delete
          </button>
        </div>
        )}
      </div>
    </div>
  );
};

export default Canvas;

// todo
// fix bug with height and width manipulation
// fix hover bug with whole canvas being targeted (probably related)
// refactor
