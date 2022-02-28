import styled from "@emotion/styled";

export const Title = styled.h1`
  background-color: rgba(0, 0, 0, 0.15);
  color: rgba(0, 0, 0, 0.54);
  text-align: left;
  padding-left: 28px;
  height: 3rem;
  margin: 0 0 2rem;
`;

export const CanvasStyle = styled.canvas`
  border: 1px solid gray;
`;

export const ButtonPane = styled.div`
  width: 160px;
  float: left;
  text-align: right;
  display: flex;
  flex-direction: column;
`;

export const ControlButtons = styled.button`
  line-height: 2rem;
  border-radius: 0;
  background: white;
  min-width: 132px;
  margin-left: auto;
`;

export const ControlWrapper = styled.div``;

export const ControlInfo = styled.div`
  width: 50%;
  text-align: center;
  height: 2rem;
  line-height: 2rem;
  font-weight: 600;
`;
