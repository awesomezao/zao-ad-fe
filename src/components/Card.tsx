import styled from '@emotion/styled'
import {useEffect} from 'react';

const Card = styled.div`
  color: red;
  border: 1px solid red;
`;

const CardWrapper = () => {
  useEffect(() => {
    console.log('a');
  }, [])
  return <Card>card</Card>;
};

export default CardWrapper;
