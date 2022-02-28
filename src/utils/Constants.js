export const COLORS = {
  TEAL: "#008080",
  ORANGE: "#FFA500",
  SELECT: "rgba(255, 213, 0)",
  HOVER: "rgba(240, 210, 249)",
};

export const OFFSET = {
  SELECT: 7,
  SELECTWIDTH: 3,
  HOVER: 3,
  HOVERWIDTH:6
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
    s: "",
    hv: "",
  },
  CIRC: {
    x: VALUES.STARTB,
    y: VALUES.STARTB,
    r: VALUES.RADI,
    c: COLORS.ORANGE,
    s: "",
    hv: "",
  },
};

export const RESET = {
  s: "",
  hv: "",
};
