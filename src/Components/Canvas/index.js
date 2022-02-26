import React, { useRef, useState, useEffect } from "react";
import { css } from "@emotion/css";
import tw, { styled } from "twin.macro";
// HELPERS
import useMousePosition from "../../Helpers/mousePosition";

const canvasStyle = css`
  border: 1px solid gray;
`;

function Canvas() {
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
    }
  };

  const drawRectangle = (param) => {
    const { x, y, w, h, c } = param;

    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // drawing rectangle
    ctx.beginPath();
    ctx.fillStyle = c;
    ctx.fillRect(x, y, w, h);

    setRectLocation(param);
  };

  // highlight rectangle
  const selectRect = (click) => {
    // getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const offset = click ? 4 : 5;

    const highlight = {
      x: rectLocation.x - offset,
      y: rectLocation.y - offset,
      w: rectLocation.w + offset * 2,
      h: rectLocation.h + offset * 2,
      c: click ? "chartreuse" : "plum",
    };
    // drawing highlight
    ctx.fillStyle = highlight.c;
    ctx.fillRect(highlight.x, highlight.y, highlight.w, highlight.h);
    drawRectangle(rectLocation);
  };

  // finding hot area of rectangle
  useEffect(() => {
    if (rectLocation && canvasRef) {
      const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
      tempObj.x.min = canvasRef.current.offsetLeft + rectLocation.x;
      tempObj.x.max = tempObj.x.min + rectLocation.w;
      tempObj.y.min = canvasRef.current.offsetTop + rectLocation.y;
      tempObj.y.max = tempObj.y.min + rectLocation.h;
      setRectArea(tempObj);
    }
  }, [rectLocation]);

  const drawCircle = (param) => {
    const { x, y, r, c } = param;

    // getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    // drawing circle
    ctx.beginPath();
    ctx.arc(x, y, r, 0, 2 * Math.PI);
    ctx.fillStyle = c;
    ctx.fill();

    // setting initial location for circle
    setCircLocation(param);
  };

  // highlight circle
  const selectCircle = (click) => {
    // getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");

    const offset = click ? 4 : 5;

    const highlight = {
      x: circLocation.x,
      y: circLocation.y,
      radius: circLocation.radius + offset,
      color: click ? "chartreuse" : "plum",
    };

    // drawing circle
    ctx.beginPath();
    ctx.arc(highlight.x, highlight.y, highlight.radius, 0, 2 * Math.PI);
    ctx.fillStyle = highlight.color;
    ctx.fill();
    drawCircle(circLocation);
  };
  // finding hot area of circle
  useEffect(() => {
    if (circLocation && canvasRef) {
      const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
      tempObj.x.min =
        canvasRef.current.offsetLeft + circLocation.x - circLocation.r;
      tempObj.x.max = tempObj.x.min + circLocation.r * 2;
      tempObj.y.min =
        canvasRef.current.offsetTop + circLocation.y - circLocation.r;
      tempObj.y.max = tempObj.y.min + circLocation.r * 2;
      setCircArea(tempObj);
    }
  }, [circLocation]);

  // if circle or rectangle are selected, highlight them
  // useEffect(() => {
  //   // resetting highlight
  //   if (canvasRef) {
  //     clearCanvas();
  //     if (showCirc) {
  //       selectCircle(true);
  //     }
  //     if (showRect) {
  //       selectRect(true);
  //     }
  //     if (!showRect && rectLocation) {
  //       drawRectangle(rectLocation);
  //     }
  //     if (!showCirc && circLocation) {
  //       drawCircle(circLocation);
  //     }
  //   }
  // }, [showCirc, showRect, circLocation, rectLocation]);

  // for hover highlight using custom hook to watch for changes to mouse position
  //    useEffect(() => {
  //       if (showRect && rectLocation?.x && rectArea && canvasRef?.current && mouseX > rectArea.x.min &&  mouseX < rectArea.x.max  && mouseY > rectArea.y.min && mouseY < rectArea.y.max){
  //           selectRect(false);
  //       } else if (showRect) {
  //           clearCanvas();
  //           //redraw
  //           drawRectangle(rectLocation);
  //           if (circLocation?.x){
  //               drawCircle(circLocation);
  //           }
  //       } else {
  //         if (circLocation?.x){
  //           clearCanvas();
  //           drawCircle(circLocation);
  //         }
  //       }

  //       if (showCirc && circLocation?.x && circArea && canvasRef?.current && mouseX > circArea.y.min && mouseX < circArea.y.max  && mouseY > circArea.y.min  && mouseY < circArea.y.max){
  //           selectCircle(false);
  //       } else if (showCirc) {
  //         clearCanvas();
  //           drawCircle(circLocation);
  //           if (rectLocation?.x){
  //               drawRectangle(rectLocation);
  //           }
  //       } else {
  //         if (rectLocation?.x){
  //           clearCanvas();
  //           drawRectangle(rectLocation);
  //        }
  //       }

  //  }, [mouseX, mouseY]);

  // delete rectangle component
  const deleteRect = () => {
    setShowRect(false);
    setRectLocation();
    setRectArea();
    setRecMov();
    clearCanvas();
    // redraw circ
  };

  // delete circle component
  const deleteCirc = () => {
    setShowCirc(false);
    setCircLocation();
    setCircArea();
    setCircMov();
    clearCanvas();
    // redraw rect
  };

  // check location against rectangle location
  const checkMouseRect = (location) => {
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
    } else if (!location.shift) {
      setShowRect(false);
    }
  };

  // check location against circle location
  // this does not currently account for area
  const checkMouseCirc = (location) => {
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
    } else if (!location.shift) {
      setShowCirc(false);
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
    setCircMov(circLocation);
    setRecMov(rectLocation);
  };
  const handleMouseOut = (e) => {
    handleMouseUp(e);
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
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
      drawRectangle(rParam);
    }
    if (showCirc) {
      const cParam = {
        x: circMov.x + dX,
        y: circMov.y + dY,
        r: circMov.r,
        c: circMov.c,
      };
      drawCircle(cParam);
    }
    if (!showRect && rectLocation) {
      drawRectangle(rectLocation);
    }
    if (!showCirc && circLocation) {
      drawCircle(circLocation);
    }
  };

  return (
    <div>
      <div
        data-testid="left-pane"
        className={css`
          width: 60%;
          float: left;
        `}
      >
        {mouseX} {mouseY}
        <br />
        Rect:
        {JSON.stringify(rectLocation)}
        <br />
        Cir:
        {JSON.stringify(circLocation)}
        <div
          data-testid="button-wrapper"
          className={css`
            display: flex;
            flex-direction: column;
            width: 200px;
            margin: auto;
            height: 100px;
            justify-content: space-between;
            margin-bottom: 2rem;
          `}
        >
          <button
            type="button"
            data-testid="rectangle-button"
            disabled={rectLocation}
            onClick={() =>
              drawRectangle({ x: 10, y: 10, w: 100, h: 100, c: "teal" })
            }
          >
            add rectangle
          </button>
          <button
            type="button"
            data-testid="circle-button"
            disabled={circLocation}
            onClick={() => drawCircle({ x: 300, y: 300, r: 50, c: "orange" })}
          >
            add circle
          </button>
          <button
            type="button"
            data-testid="clear-button"
            disabled={!circLocation && !rectLocation}
            onClick={() => {
              clearCanvas();
              deleteCirc();
              deleteRect();
            }}
          >
            clear
          </button>
        </div>
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
        <br />
        {isDragging ? "dragging..." : "not dragging"}
      </div>
      <div
        data-testid="right-pane"
        className={css`
          width: 30%;
          float: left;
        `}
      >
        {showRect && (
          <div>
            <h2>Rectangle location</h2>
            <label htmlFor="rect-x">x location</label>
            <input
              type="number"
              id="rect-x"
              name="rect-x"
              value={rectLocation.x}
              min="1"
              max="500"
              onChange={(val) =>
                drawRectangle({
                  x: val,
                  y: rectLocation.y,
                  w: rectLocation.w,
                  h: rectLocation.h,
                  c: rectLocation.c,
                })
              }
            />

            <label htmlFor="rect-y">y location</label>
            <input
              type="number"
              id="rect-y"
              name="rect-y"
              value={rectLocation.y}
              min="1"
              max="500"
              onChange={(val) =>
                drawRectangle({
                  x: rectLocation.x,
                  y: val,
                  w: rectLocation.w,
                  h: rectLocation.h,
                  c: rectLocation.c,
                })
              }
            />

            <button type="button" data-testid="clear-rect" onClick={deleteRect}>
              delete
            </button>
          </div>
        )}
        {showCirc && (
          <div>
            <h2>Circle location</h2>
            <label htmlFor="rect-x">
              x location
              <input
                type="number"
                id="rect-x"
                value={circLocation.x}
                min="1"
                max="500"
              />
            </label>
            <label htmlFor="rect-y">
              y location
              <input
                type="number"
                id="rect-y"
                value={circLocation.y}
                min="1"
                max="500"
              />
            </label>
            <button type="button" data-testid="clear-circ" onClick={deleteCirc}>
              delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default Canvas;

// todo
// drag to move
//
// fix highlight on hover
// local storage
// undo

// make it pretty

// refactor
// component for displaying content
// helper functions

// things to add later
// validations

//shapes.map and combine into two object types
