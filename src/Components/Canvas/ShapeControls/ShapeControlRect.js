import React from "react";
import { css } from "@emotion/css";

const ShapeControlRect = (
  rectLocation,
  clearCanvas,
  drawRectangle,
  drawCircle,
  deleteRect
) => {
  return (
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
  );
};

export default ShapeControlRect;