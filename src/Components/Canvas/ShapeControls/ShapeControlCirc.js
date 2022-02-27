import React from "react";
import { css } from "@emotion/css";

const ShapeControlCirc = (
  circLocation,
  clearCanvas,
  drawCircle,
  drawRectangle,
  deleteCirc
) => {
  return (
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
  );
};

export default ShapeControlCirc;
