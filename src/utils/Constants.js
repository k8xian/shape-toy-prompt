export const COLORS = {
  TEAL: "#008080",
  ORANGE: "#FFA500",
  SELECT: "#DFFF00",
  HOVER: "#8E4585",
};

export const OFFSET = {
  SELECT: 4,
  HOVER: 5,
};

export const VALUES = {
  STARTA: 10,
  STARTB: 300,
  SIZE: 100,
  RADI: 50,
};

export const DRAW = {
  RECT: {
    x: VALUES.STARTA,
    y: VALUES.STARTA,
    w: VALUES.SIZE,
    h: VALUES.SIZE,
    c: COLORS.TEAL,
  },
  CIRC: {
    x: VALUES.STARTB,
    y: VALUES.STARTB,
    r: VALUES.RADI,
    c: COLORS.ORANGE,
  },
};
