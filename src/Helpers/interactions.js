// const resetCanvas = (showRect, rectLocation, showCirc, circLocation) => {
//     clearCanvas();
//     if (showRect && rectLocation){
//       drawRectangle(rectLocation, 1);
//     } else if (rectLocation) {
//       drawRectangle(rectLocation, false);
//     }

//     if (showCirc && circLocation){
//       drawCircle(circLocation, 1);
//     } else if (circLocation){
//       drawCircle(circLocation, false);
//     }
//   }

//   const getCircArea = (circLocation, canvasRef, setCircArea) => {
//     if (circLocation && canvasRef) {
//       const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
//       tempObj.x.min =
//         canvasRef.current.offsetLeft + circLocation.x - circLocation.r;
//       tempObj.x.max = tempObj.x.min + circLocation.r * 2;
//       tempObj.y.min =
//         canvasRef.current.offsetTop + circLocation.y - circLocation.r;
//       tempObj.y.max = tempObj.y.min + circLocation.r * 2;
//       setCircArea(tempObj);
//       //explicit return in case state change subject to rerender
//       return tempObj;
//     }
//   };
