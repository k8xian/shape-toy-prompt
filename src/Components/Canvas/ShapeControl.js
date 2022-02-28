import React, { useState } from "react";
import { css } from "@emotion/css";

// STYLES
import * as Styled from "./canvas.styles";

const ShapeControl = ({
  shapeLocation,
  otherShapeLocation,
  clearCanvas,
  draw,
  drawOther,
  deleteShape,
  isCircle,
}) => {
  const { x, y, h, w, r, c } = shapeLocation;
  return (
    <div
      className={css`
        display: flex;
        flex-direction: column;
        border-top: 2px solid rgba(0,0,0,.54);
        margin-bottom: 2rem;
      `}
    >
      <div
        className={css`
          display: flex;
          flex-direction: flex-row;
          flex-wrap: wrap;
        `}
      >
        <button
          className={css`
            font-size: 2rem;
            width: 50%;
            height: 2.5rem;
            line-height: 2rem;
          `}
          type="button"
          onClick={deleteShape}
        >
          &#128465;
        </button>
        <h2
          className={css`
            width: 50%;
            height: 2.5rem;
            margin: 0;
            line-height: 2.5rem;
          `}
        >
          {isCircle ? "circle" : "rectangle"}
        </h2>
        <Styled.ControlInfo>x position</Styled.ControlInfo>
        <Styled.ControlInfo>{x}</Styled.ControlInfo>
        <Styled.ControlInfo>y position</Styled.ControlInfo>
        <Styled.ControlInfo>{y}</Styled.ControlInfo>
        {isCircle && (
          <React.Fragment>
            <Styled.ControlInfo>radius</Styled.ControlInfo>
            <Styled.ControlInfo>
              <input
                type="range"
                id="radius"
                name="radius"
                min="15"
                max="150"
                value={r}
                onChange={(e) => {
                  clearCanvas();
                  draw({ ...shapeLocation, r: parseInt(e.target.value) }, 1);
                  if (otherShapeLocation) {
                    drawOther(otherShapeLocation);
                  }
                }}
              />
            </Styled.ControlInfo>
          </React.Fragment>
        )}
        {!isCircle && (
          <React.Fragment>
            <Styled.ControlInfo>width</Styled.ControlInfo>
            <Styled.ControlInfo>
              <input
                type="range"
                id="width"
                name="width"
                min="30"
                max="300"
                value={w}
                onChange={(e) => {
                  clearCanvas();
                  draw({ ...shapeLocation, w: parseInt(e.target.value) }, 1);
                  if (otherShapeLocation) {
                    drawOther(otherShapeLocation);
                  }
                }}
              />
            </Styled.ControlInfo>
            <Styled.ControlInfo>height</Styled.ControlInfo>
            <Styled.ControlInfo>
              <input
                type="range"
                id="height"
                name="height"
                min="30"
                max="300"
                value={h}
                onChange={(e) => {
                  clearCanvas();
                  draw({ ...shapeLocation, h: parseInt(e.target.value) }, 1);
                  if (otherShapeLocation) {
                    drawOther(otherShapeLocation);
                  }
                }}
              />
            </Styled.ControlInfo>
          </React.Fragment>
        )}
        <Styled.ControlInfo>color</Styled.ControlInfo>
        <Styled.ControlInfo>
          <input
            type="color"
            id="circ-color"
            name="circ-color"
            value={c}
            onChange={(e) => {
              clearCanvas();
              draw({ ...shapeLocation, c: e.target.value }, 1);
              if (otherShapeLocation) {
                drawOther(otherShapeLocation);
              }
            }}
          />
        </Styled.ControlInfo>
      </div>
    </div>
  );
};

export default ShapeControl;
