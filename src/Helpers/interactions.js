const resetCanvas = (showRect, rectLocation, showCirc, circLocation) => {
    clearCanvas();
    if (showRect && rectLocation){
      drawRectangle(rectLocation, 1);
    } else if (rectLocation) {
      drawRectangle(rectLocation, false);
    }

    if (showCirc && circLocation){
      drawCircle(circLocation, 1);
    } else if (circLocation){
      drawCircle(circLocation, false);
    }
  }