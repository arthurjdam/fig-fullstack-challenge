import styled from 'styled-components';
import ExplainCommand from 'components/ExplainCommand/ExplainCommand';

const StyledContainer = styled.div`
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

export default function Home() {
  return (
    <StyledContainer>
      <ExplainCommand prefix="~ $" />
    </StyledContainer>
  );
}
