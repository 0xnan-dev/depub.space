import { Link, Center, Text, Heading, VStack, View, Button } from 'native-base';
import React, { FC } from 'react';
import { LogoIconText } from '@depub/theme';

const headingFontSize = { base: '6xl', md: '8xl', lg: '9xl' };
const containerStyle = {
  _dark: {
    bg: 'darkBlue.900',
  },
  _light: {
    bg: 'white',
  },
  alignItems: 'center',
  flex: 1,
  justifyContent: 'center',
  pt: 8,
};

export const NotFound: FC = () => (
  <View {...containerStyle}>
    <VStack alignItems="center" space={8}>
      <Text>
        <LogoIconText height={120} width={120} />
      </Text>
      <Center>
        <Heading fontSize={headingFontSize}>404</Heading>
        <Text>Page Not Found</Text>
      </Center>
      {/* eslint-disable-next-line jsx-a11y/anchor-is-valid */}
      <Link href="/">
        <Button variant="outline">Back home</Button>
      </Link>
    </VStack>
  </View>
);
