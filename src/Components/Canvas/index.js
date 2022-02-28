import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";

// UTILS
import { COLORS, OFFSET, VALUES, DRAW, RESET } from "../../utils/Constants";
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
      drawRectangle({...rectLocation, s: true});
    } else if (rectLocation) {
      drawRectangle({ ...rectLocation, ...RESET });
    }

    if (showCirc && circLocation) {
      drawCircle({...circLocation, s: true});
    } else if (circLocation) {
      drawCircle({...circLocation, ...RESET});
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
  const drawRectangle = (param) => {
    const { x, y, w, h, c, s, hv } = param;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (hv) {
      const hover = {
        x: x - OFFSET.HOVER,
        y: y - OFFSET.HOVER,
        w: w + OFFSET.HOVER * 2,
        h: h + OFFSET.HOVER * 2,
      };
      ctx.lineWidth = OFFSET.HOVERWIDTH;
      ctx.strokeStyle = COLORS.HOVER;
      ctx.strokeRect(hover.x, hover.y, hover.w, hover.h);
    }

    if (showRect || s) {
      const select = {
        x: x - OFFSET.SELECT,
        y: y - OFFSET.SELECT,
        w: w + OFFSET.SELECT * 2,
        h: h + OFFSET.SELECT * 2,
      };
      ctx.lineWidth = OFFSET.SELECTWIDTH;
      ctx.strokeStyle = COLORS.SELECT;
      ctx.strokeRect(select.x, select.y, select.w, select.h);
    }

    // drawing rectangle
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);

    setRectLocation(param);
    storeCanvas();
  };

  // drawing circle and hover/select
  const drawCircle = (param) => {
    const { x, y, r, c, s, hv } = param;

    // getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    if (hv) {
      const hover = {
        x: x,
        y: y,
        r: r + OFFSET.HOVER,
      };
      ctx.beginPath();
      ctx.arc(hover.x, hover.y, hover.r, 0, 2 * Math.PI);
      ctx.lineWidth = OFFSET.HOVERWIDTH;
      ctx.strokeStyle = COLORS.HOVER;
      ctx.stroke();
    }

    if (showCirc || s) {
      const select = {
        x: x,
        y: y,
        r: r + OFFSET.SELECT,
      };
      ctx.beginPath();
      ctx.arc(select.x, select.y, select.r, 0, 2 * Math.PI);
      ctx.lineWidth = OFFSET.SELECTWIDTH;
      ctx.strokeStyle = COLORS.SELECT;
      ctx.stroke();
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
      drawCircle({ ...circLocation, ...RESET });
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
      drawRectangle({ ...rectLocation, ...RESET });
    }
  };

  // check location against rectangle location
  const checkMouseRect = (location) => {
    const a = findAreas();
    const { areaR } = a;
    const { x, y } = areaR;
    if (rectLocation && checkArea(location, x, y)) {
      if (!showRect) {
        setShowRect(true);
        // saving the starting position
        setRecMov(rectLocation);
        // rerender with highlight
        drawRectangle({ ...rectLocation, s: true });
      }
    } else if (!location.shift) {
      setShowRect(false);
    }
  };

  // check location against circle location
  const checkMouseCirc = (location) => {
    const a = findAreas();
    const { areaC } = a;
    const { x, y } = areaC;
    if (circLocation && checkArea(location, x, y)) {
      if (!showCirc) {
        setShowCirc(true);
        // saving the starting position
        setCircMov(circLocation);
        // rerender with highlight
        drawCircle({ ...circLocation, s: true });
      } 
    } else if (!location.shift) {
      setShowCirc(false);
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
    // checking for hover
    if (!isDragging && location) {
      const a = findAreas();
      const { areaR, areaC } = a;
      clearCanvas();
      resetCanvas();
      if (rectLocation && checkArea(location, areaR.x, areaR.y)) {
        drawRectangle({...rectLocation, hv: true});
      } else if (rectLocation) {
        drawRectangle({...rectLocation, ...RESET});
      }
      if (circLocation && checkArea(location, areaC.x, areaC.y)) {
        drawCircle({...circLocation, hv: true});
      } else if (circLocation) {
        drawCircle({...circLocation, ...RESET});
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
          s: true,
          hv: false,
        };
        drawRectangle(rParam);
      }
      if (showCirc) {
        const cParam = {
          x: circMov.x + dX,
          y: circMov.y + dY,
          r: circMov.r,
          c: circMov.c,
          s: true,
          hv: false,
        };
        drawCircle(cParam);
      }
      if (!showRect && rectLocation) {
        drawRectangle({ ...rectLocation, ...RESET });
      }
      if (!showCirc && circLocation) {
        drawCircle({...circLocation, ...RESET });
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
