import styled from 'styled-components';

export const StyledContainer = styled.div`
  position: relative;
  width: 80vw;
  height: calc(32px + 24px + 8px * 2); // font-size + (padding * 2)
  font-size: 32px;
  background-color: #282c35;
  padding: 12px;
`;

export const StyledPrefix = styled.span`
  position: relative;
  dislay: inline-block;
  top: 0;
  left: 0;
  right: 0;
  padding: 12px;
`;

export const StyledInput = styled.input<{ prefix: string }>`
  font-size: 32px;
  border: none;
  appearance: none;
  outline: none;
  padding: 12px;

  background: transparent;
  color: transparent;

  position: absolute;
  top: 0;
  left: ${({ prefix }) => prefix.length + 1}ch;
  right: 0;

  width: calc(100% - 4ch);

  &::selection {
    background-color: transparent;
  }
`;

export const StyledSecondInput = styled.pre<{ prefix: string }>`
  font-size: 32px;
  padding: 12px;
  margin: 0;

  // pointer-events: none;

  position: absolute;
  top: 0;
  left: ${({ prefix }) => prefix.length + 1}ch;
  right: 0;
`;

export const StyledCursor = styled.span<{ prefix: string; cursor: [number, number] }>`
  position: absolute;
  top: 14px;
  left: calc(14px + ${({ prefix }) => prefix.length + 1}ch);
  width: 1ch;
  height: 1.2em;
  display: inline-block;
  background-color: #fff;
  transform-origin: 0 0;
  transform: translate(${({ cursor }) => cursor[0]}ch, 0) scale(${({ cursor }) => Math.max(1, cursor[1] - cursor[0])}, 1);

  // mix-blend-mode: exclusion;
`;