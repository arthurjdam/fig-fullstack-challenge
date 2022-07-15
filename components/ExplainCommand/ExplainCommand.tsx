import { ChangeEvent, SyntheticEvent, useEffect, useState } from 'react';
import { split } from 'util/bash';
import useDebounce from 'util/hooks/useDebounce';
import { load, parse } from 'data/fig';
import CommandPart from 'components/CommandPart/CommandPart';
import { 
  StyledContainer, 
  StyledPrefix, 
  StyledInput, 
  StyledSecondInput, 
  StyledCursor 
} from './ExplainCommand.styles';

interface ExplainProps {
  prefix: string;
}

export default function ExplainCommand({ prefix = '' }: ExplainProps) {
  let inputField: HTMLInputElement | null = null;
  const [input, setInput] = useState<string>('');
  const debouncedInput = useDebounce(input, 300);
  const [cursor, setCursor] = useState<[number, number]>([0, 0]);
  const [spec, setSpec] = useState<Fig.Spec | undefined>();
  const [parts, setParts] = useState<ReturnType<typeof parse>>();

  useEffect(() => {
    if (debouncedInput) {
      load(debouncedInput).then((_spec) => {
        //TODO: _spec() expects a version number
        setSpec(_spec instanceof Function ? _spec() : _spec);        
      }).catch(() => {
        setSpec(undefined);
      });
    } else {
      setSpec(undefined);
    }
  }, [debouncedInput]);

  useEffect(() => {
    load(input).then((_spec) => {
      if (_spec) {
        setParts(parse(split(input), spec));
      } else {
        setParts([]);
      }
    }).catch(() => {
      setParts([]);
    });
  }, [input, spec]);

  // Select all in primary InputField when cmd+a is pressed
  function selectAll(e: KeyboardEvent) {
    if (!inputField) return;
    if (e.code === 'KeyA' && e.metaKey) {
      e.preventDefault();
      inputField.focus();
      inputField.setSelectionRange(0, inputField.value.length);
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', selectAll);
    return () => { 
      window.removeEventListener('keydown', selectAll);
    };
  });

  function onCursorChange(e: SyntheticEvent<HTMLInputElement, Event>) {
    const { selectionStart, selectionEnd } = e.target as HTMLInputElement;
    setCursor([selectionStart as number, selectionEnd || selectionStart as number]);
  }
  
  function onInputChange(e: ChangeEvent<HTMLInputElement>) {
    onCursorChange(e);
    setInput(e.target.value);
  }
  
  return (
    <StyledContainer>
      {/* Draw the cursor */}
      {cursor.length == 2 && <StyledCursor prefix={prefix} cursor={cursor} />}

      {/* Draws the cli prefix (curdir + user) */}
      <StyledPrefix>{prefix}</StyledPrefix>

      {/* Un-highlighted text overlay, will be obfuscated be element below after spec loads */}
      <StyledSecondInput prefix={prefix}>
        {input}
      </StyledSecondInput>

      {/* Actual, but invisible, input element */}
      <StyledInput
        autoFocus
        autoCapitalize="off"
        autoComplete="off"
        autoCorrect="off" 
        spellCheck={false}
        type="text"
        onSelect={onCursorChange}
        onKeyPress={onCursorChange}
        onMouseMove={onCursorChange}
        onChange={onInputChange}
        prefix={prefix}
        value={input}
        ref={(el) => { inputField = el; }}
      />

      {/* Show the text overlay */}
      <StyledSecondInput prefix={prefix} onClick={() => { inputField && inputField.focus(); }}>
        {parts?.map((part, index) => (
          <CommandPart key={`${part.original}${index}`} index={index} {...part} />
        ))}
      </StyledSecondInput>
    </StyledContainer>
  );
}
