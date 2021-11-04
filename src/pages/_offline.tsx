import { Box, ScaleFade, Flex, Text } from '@chakra-ui/react';
import { css } from '@emotion/react';
import Button from '../components/Button';

export const OfflineScreen = () => {
  return (
    <Flex
      flexDir="column"
      alignItems="center"
      justifyContent="center"
      css={css`
        height: 100vh;
        max-height: -webkit-fill-available;
      `}
    >
      <ScaleFade in>
        <Text fontSize="1.6em" opacity={0.6}>
          Oops, seems like an error.
        </Text>
        <Box mt="40px" textAlign="center">
          <Button>Reload</Button>
        </Box>
      </ScaleFade>
    </Flex>
  );
};

export default OfflineScreen;
