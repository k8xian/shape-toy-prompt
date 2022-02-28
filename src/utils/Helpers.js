export const findRectArea = (shape, leftOffset, topOffset) => {
  if ((shape, leftOffset, topOffset)) {
    const { x, y, h, w } = shape;
    const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
    tempObj.x.min = leftOffset + x;
    tempObj.x.max = tempObj.x.min + w;
    tempObj.y.min = topOffset + y;
    tempObj.y.max = tempObj.y.min + h;
    return tempObj;
  }
};

export const findCircArea = (shape, leftOffset, topOffset) => {
  if ((shape, leftOffset, topOffset)) {
    const { x, y, r } = shape;
    const tempObj = { x: { min: "", max: "" }, y: { min: "", max: "" } };
    tempObj.x.min = leftOffset + x - r;
    tempObj.x.max = tempObj.x.min + r * 2;
    tempObj.y.min = topOffset + y - r;
    tempObj.y.max = tempObj.y.min + r * 2;
    return tempObj;
  }
};

export const checkArea = (location, x, y) => {
  if (
    location.x >= x.min &&
    location.x < x.max &&
    location.y > y.min &&
    location.y < y.max
  ) {
    return true;
  } else {
      return false;
  }
};


export const isInCircle = (shape, mouseX, mouseY) => {
    if ((shape, mouseX, mouseY)) {
        const {x, y, r} = shape;
      const dx = mouseX - x;
      const dy = mouseY - y;
      const dist = Math.sqrt(Math.pow(dx, 2) + Math.pow(dy, 2));
      if (dist <= r) {
        return true;
      } else {
        return false;
      }
    }
  };
  
  export const isInRectangle = (shape, mouseX, mouseY) => {
      const { x, y, h, w } = shape;
      if ((Math.abs(mouseX - x) <= (w/2)) && (Math.abs(mouseY - y) <= (h/2))){
          return true;
      } else {
          return false;
      }
  }
  