import { Container } from '@chakra-ui/react';
import { memo } from 'react';

const AboutPage = () => {
  return (
    <Container centerContent maxW="400px" py={6}>
      <h1>About</h1>
      <ul>
        <li>motivation</li>
        <li>phases</li>
        <li>settings</li>
        <li>tracking</li>
      </ul>
    </Container>
  );
};

export default memo(AboutPage);
