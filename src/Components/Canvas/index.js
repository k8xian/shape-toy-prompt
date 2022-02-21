import React, {useRef, useState, useEffect} from 'react';
import { css } from '@emotion/css';

//HELPERS
import useMousePosition from '../../Helpers/mousePosition';

const canvasStyle = css`border: 1px solid gray`;



const Canvas = () => {

  const [circLocation, setCircLocation] = useState();
  const [circArea, setCircArea] = useState();
  const [showCirc, setShowCirc] = useState(false);  

  const [rectLocation, setRectLocation] = useState();
  const [rectArea, setRectArea] = useState()
  const [showRect, setShowRect] = useState(false);



  const canvasRef = useRef(null);

  const { mouseX, mouseY } = useMousePosition();


  //clear canvas
 const clearCanvas = () => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
}

//highlight rectangle
const highlightRect = (click) => {
    //getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    const offset = click ? 4 : 5;

    let highlight = { 
        x: rectLocation.x - offset,
        y: rectLocation.y - offset,
        width: rectLocation.width + (offset * 2),
        height: rectLocation.height + (offset * 2),
        color: click ? "chartreuse" : "plum",
    };
    //drawing highlight
    ctx.fillStyle = highlight.color;
    ctx.fillRect(highlight.x, highlight.y, highlight.width, highlight.height);
    drawRectangle(rectLocation);
}

const drawRectangle = (newParam) => {
    //getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let newRect = {};

    if (newParam) {
        newRect = newParam;
    } else {
        newRect = {
            x: 10,
            y: 10,
            height: 100,
            width: 100,
            color: 'teal',
        };
    }
    //drawing rectangle
    ctx.fillStyle = newRect.color;
    ctx.fillRect(newRect.x, newRect.y, newRect.width, newRect.height);

    setRectLocation(newRect);  

};

//finding hot area of rectangle
useEffect(() => {
    if (rectLocation && canvasRef){
     const tempObj={x: {min: "", max: ""}, y: {min: "", max: ""},}
     tempObj.x.min = canvasRef.current.offsetLeft + rectLocation.x;
     tempObj.x.max = tempObj.x.min + rectLocation.width;
     tempObj.y.min = canvasRef.current.offsetTop + rectLocation.y;
     tempObj.y.max = tempObj.y.min + rectLocation.height;
     setRectArea(tempObj);
    }
}, [rectLocation]);

//highlight circle
const highlightCircle = (click) => {
    //getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    
    const offset = click ? 4 : 5;

    let highlight = { 
        x: circLocation.x,
        y: circLocation.y,
        radius: circLocation.radius + offset,
        color: click ? "chartreuse" : "plum",
    };

    //drawing circle
    ctx.beginPath();
    ctx.arc(highlight.x, highlight.y, highlight.radius, 0, 2 * Math.PI);
    ctx.fillStyle = highlight.color;
    ctx.fill();
    drawCircle(circLocation);
}


const drawCircle = (newParam) => {
    //getting canvas ref
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');

    let newCirc = {};

    
    if (newParam) {
        newCirc = newParam;
    } else {
        newCirc = {
            x: 300,
            y: 250,
            radius: 50,
            color: 'orange',
            xArea: {
                min: "",
                max: ""
            },
            yArea: {
                min: "",
                max: ""
            }
        };
    }

    //drawing circle
    ctx.beginPath();
    ctx.arc(newCirc.x, newCirc.y, newCirc.radius, 0, 2 * Math.PI);
    ctx.fillStyle = newCirc.color;
    ctx.fill();
    
    //setting initial location for circle
    setCircLocation(newCirc)
}

//finding hot area of circle
useEffect(() => {
    if (circLocation && canvasRef){
     const tempObj={x: {min: "", max: ""}, y: {min: "", max: ""},}
     tempObj.x.min = canvasRef.current.offsetLeft + circLocation.x - circLocation.radius;
     tempObj.x.max = tempObj.x.min + (circLocation.radius * 2);
     tempObj.y.min = canvasRef.current.offsetTop + circLocation.y - circLocation.radius;
     tempObj.y.max = tempObj.y.min + (circLocation.radius * 2);
     setCircArea(tempObj);
    }
}, [circLocation]);

//check location against rectangle location
const checkMouseRect = location => {

    console.log(location);
    console.log(canvasRef.current.offsetLeft);
    if (rectLocation && location.x > rectArea.x.min && location.x < rectArea.x.max && location.y > rectArea.y.min && location.y < rectArea.y.max){
        setShowRect(true);
    } else if (!location.shift)  {
        setShowRect(false);
    }
 }

 //check location against circle location
 //this does not currently account for area
 const checkMouseCirc = location => {
    if (circLocation && location.x > circArea.x.min && location.x < circArea.x.max  && location.y > circArea.y.min  && location.y < circArea.y.max){
        setShowCirc(true);
    } else if (!location.shift) {
        setShowCirc(false);
    }
 } 

 //if circle or rectangle are selected, highlight them
 useEffect(() => {
     //resetting highlight 
     clearCanvas();
     if (showCirc){
        highlightCircle(true);
     }
     if (showRect){
        highlightRect(true);
     }
     if (!showRect && rectLocation){
        drawRectangle(rectLocation);
     }
     if(!showCirc && circLocation){
         drawCircle(circLocation);
     }

 }, [showCirc, showRect, circLocation, rectLocation])

 //using custom hook to watch for changes to mouse position
//  useEffect(() => {
//     if (rectLocation?.x && rectArea && canvasRef?.current && mouseX > rectArea.x.min &&  mouseX < rectArea.x.max  && mouseY > rectArea.y.min && mouseY < rectArea.y.max){
//         highlightRect(false);
//     } else{
//         clearCanvas();
//         //redraw
//         drawRectangle(rectLocation);
//         if (circLocation?.x){
//             drawCircle(circLocation);
//         }
//     }

//     if (circLocation?.x && circArea && canvasRef?.current && mouseX > circArea.y.min && mouseX < circArea.y.max  && mouseY > circArea.y.min  && mouseY < circArea.y.max){
//         highlightCircle(false);
//     } else {
//         drawCircle(circLocation);
//         if (rectLocation?.x){
//             drawRectangle(rectLocation);
//         }
//     }
     
//  }, [mouseX, mouseY]);

 const onCanvasClick = event => {
     console.log(event);
    const click = { x: event.clientX, y: event.clientY, shift: event.shiftKey };
    checkMouseRect(click);
    checkMouseCirc(click);

    //if shift key, do both and don't undo the other
}

//delete rectangle component
const deleteRect = () => {
    setShowRect(false);
    setRectLocation();
    setRectArea();
    clearCanvas();
    //redraw circ
}

//delete circle component
const deleteCirc = () => {
    setShowCirc(false);
    setCircLocation();
    setCircArea();
    clearCanvas();
    //redraw rect
}


  return (
    <div>
    <div data-testid="button-wrapper" className={css`display: flex; flex-direction: column; width: 200px; margin: auto; height: 100px; justify-content: space-between; margin-bottom: 2rem;`}>    
        <button type="button" data-testid="rectangle-button" onClick={() => drawRectangle()}>add rectangle</button>
        <button type="button" data-testid="circle-button" onClick={() => drawCircle()}>add circle</button>
        <button type="button" data-testid="clear-button" onClick={() => {clearCanvas(); deleteCirc(); deleteRect();}}>clear</button>
    </div>
    
    <canvas
      className={canvasStyle}
      ref={canvasRef}
      width={500}
      height={500}
      onClick={(e) => {
        onCanvasClick(e);
      }}
    />
      {showRect && (
          <div>
                <h2>Rectangle location</h2>
                <label htmlFor="rect-x">   
                    x location             
                    <input type="number" id="rect-x" value={rectLocation.x}/>
                </label>
                <label htmlFor="rect-y">   
                    y location             
                    <input type="number" id="rect-y" value={rectLocation.y}/>
                </label>
                <button type="button" data-testid="clear-rect" onClick={deleteRect}>delete</button>
            </div>
      )}
      {showCirc && (
        <div>
              <h2>Circle location</h2>
              <label htmlFor="rect-x">   
                  x location             
                  <input type="number" id="rect-x" value={circLocation.x}/>
              </label>
              <label htmlFor="rect-y">   
                  y location             
                  <input type="number" id="rect-y" value={circLocation.y}/>
              </label>
              <button type="button" data-testid="clear-circ" onClick={deleteCirc}>delete</button>
          </div>
    )}
    </div>
  );
}

export default Canvas;

//todo
//drag to move
//
//fix highlight on hover
//local storage
//undo

//make it pretty

//refactor
//component for displaying content
//helper functions

//things to add later
//validations
