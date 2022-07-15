import { createGlobalStyle } from 'styled-components';

const GlobalStyles = createGlobalStyle`
  body {
    font-family: 'Source Code Pro', monospace;
    font-weight: 500;
    background-color: #141414;
    color: #fff;

    --ease-in: cubic-bezier(0.895, 0.03, 0.685, 0.22);
    --ease-out: cubic-bezier(0.165, 0.84, 0.44, 1);
    --ease-in-out: cubic-bezier(0.77, 0, 0.175, 1);
  }

  * {
    font-family: 'Source Code Pro', monospace;
    font-weight: 500;
    box-sizing: border-box;
  }
`;

export default GlobalStyles;
