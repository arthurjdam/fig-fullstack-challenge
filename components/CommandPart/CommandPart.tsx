import React from 'react';
import { StyledComponent } from 'styled-components';
import { ParsedCommandPart, CommandPartType } from 'data/fig';
import {
  StyledOriginal,
  StyledDescription,
  StyledDescriptionDetails,
  StyledCommandPart,
  StyledSubCommandPart,
  StyledOptionPart,
  StyledArgumentPart,
  StyledUnknownPart,
  StyledNonePart,
} from './CommandPart.styles';

interface CommandPartProps extends ParsedCommandPart {
  index: number;
}

const PartsMap: Record<CommandPartType, StyledComponent<any, any, {}, never>> = {
  command: StyledCommandPart,
  subcommand: StyledSubCommandPart,
  option: StyledOptionPart, 
  argument: StyledArgumentPart,
  unknown: StyledUnknownPart,
  none: StyledNonePart,
};

const CommandPart: React.FC<CommandPartProps> = ({ original, description, definition, type, chain, index }) => {
  const Component = PartsMap[type];
  return (
      <Component>
        <StyledOriginal>{`${original}${chain ? '' : ' '}`}</StyledOriginal>
        { type !== 'none' && (
          <StyledDescription>
            <StyledDescriptionDetails>
            <small>{type}</small>
            <h3>{definition ?? original}</h3>          
            <p>{description}</p>
            </StyledDescriptionDetails>
          </StyledDescription>
        )}
      </Component>
  );
};

export default CommandPart;
