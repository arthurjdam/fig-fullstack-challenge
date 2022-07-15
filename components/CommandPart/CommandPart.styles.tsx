import styled from 'styled-components';

export const StyledOriginal = styled.span`
  position: relative;
`;

export const StyledDescriptionDetails = styled.div`
  min-width: 380px;

  font-size: 1rem;
  height: 1.5rem;

  transition: all 0.25s var(--ease-out);
  pointer-events: none;

  h3 {
    font-size: 1.2em;
    font-weight: 700;
    margin: 0.125em 0 0.25em;
    color: #fff;
    opacity: 0;
    transition: all 0.25s var(--ease-out);
    transform: translate(0, -20px);
  }

  small {
    font-size: 0.75em;
  }

  p {
    font-size: 0.8em;
    margin: 0;
    color: #939aab;
    opacity: 0;
    transition: all 0.25s var(--ease-out) 0.1s;
    transform: translate(0, -20px);
  }
`;

export const StyledDescription = styled.div`
  position: absolute;
  left: 0;
  right: 1ch;
  bottom: -68px;

  min-width: calc(1ch - 4px);
  white-space: break-spaces;  

  &:before {
    content: '';

    position: absolute;
    top: -18px;
    left: 0;
    width: 100%;
    height: 12px;

    border-radius: 2px;
    border: currentColor 1px solid;
    border-top: transparent;    
  }

  &:hover {
    z-index: 100;
  }
`;

export const StyledPart = styled.span`
  position: relative;  

  &:hover {
    ${StyledDescriptionDetails} {
      h3, p, small {
        opacity: 1;
        transform: translate(0, 0);
      }
    }
  }
`;

export const StyledCommandPart = styled(StyledPart)`
  color: #a6b2fd;
`;
export const StyledSubCommandPart = styled(StyledPart)`
  color: #62a2f9;
`;
export const StyledOptionPart = styled(StyledPart)`
  color: #3fd699;
`;
export const StyledArgumentPart = styled(StyledPart)`
  color: #f269b6;
`;
export const StyledUnknownPart = styled(StyledPart)`
  color: #f00;
`;
export const StyledNonePart = styled(StyledPart)`
  display: #fff;
`;