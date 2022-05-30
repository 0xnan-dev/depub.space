// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-nocheck
import * as React from 'react';
import Svg, { SvgProps, Path } from 'react-native-svg';

const SvgLogoText = (props: SvgProps) => (
  <Svg
    className=""
    style={{
      enableBackground: 'new 0 0 1024 153.9',
    }}
    viewBox="0 0 1024 153.9"
    xmlns="http://www.w3.org/2000/svg"
    xmlSpace="preserve"
    {...props}
  >
    <Path d="M15.5 57.2c2.3-4.5 5.5-8 9.5-10.4 4-2.4 8.5-3.6 13.4-3.6 3.7 0 7.3.8 10.7 2.4 3.4 1.6 6.1 3.8 8.1 6.5V24.8H72v77H57.3v-8.5c-1.8 2.8-4.3 5.1-7.6 6.9-3.3 1.7-7 2.6-11.3 2.6-4.9 0-9.3-1.3-13.3-3.7-4-2.5-7.2-6-9.5-10.6-2.3-4.5-3.5-9.8-3.5-15.7-.1-5.9 1.1-11.1 3.4-15.6zm39.8 6.6c-1.4-2.5-3.3-4.5-5.6-5.8-2.4-1.4-4.9-2-7.6-2-2.7 0-5.2.7-7.5 2s-4.1 3.2-5.6 5.8c-1.4 2.5-2.1 5.5-2.1 9s.7 6.5 2.1 9.1c1.4 2.6 3.3 4.6 5.6 6 2.3 1.4 4.8 2.1 7.4 2.1 2.7 0 5.2-.7 7.6-2 2.4-1.4 4.2-3.3 5.6-5.8 1.4-2.5 2.1-5.6 2.1-9.1.1-3.7-.6-6.7-2-9.3zM170.7 77.3h-42.1c.3 4.2 1.8 7.4 4.4 9.8 2.6 2.4 5.7 3.5 9.5 3.5 5.4 0 9.3-2.3 11.6-7h15.7c-1.7 5.6-4.9 10.1-9.6 13.7-4.7 3.6-10.5 5.4-17.4 5.4-5.6 0-10.5-1.2-14.9-3.7s-7.8-5.9-10.3-10.5c-2.5-4.5-3.7-9.7-3.7-15.6 0-6 1.2-11.2 3.6-15.7s5.8-8 10.2-10.4c4.4-2.4 9.4-3.6 15.1-3.6 5.5 0 10.4 1.2 14.7 3.5 4.3 2.4 7.7 5.7 10.1 10s3.6 9.3 3.6 14.9c-.1 2.2-.3 4.1-.5 5.7zM156 67.5c-.1-3.7-1.4-6.7-4.1-9-2.6-2.3-5.9-3.4-9.7-3.4-3.6 0-6.6 1.1-9.1 3.3-2.5 2.2-4 5.2-4.5 9.1H156zM235.2 45.8c3.3-1.8 7.1-2.7 11.3-2.7 4.9 0 9.4 1.2 13.4 3.6 4 2.4 7.1 5.9 9.5 10.4 2.3 4.5 3.5 9.7 3.5 15.6s-1.2 11.1-3.5 15.7-5.5 8.1-9.5 10.6-8.4 3.7-13.4 3.7c-4.2 0-8-.9-11.2-2.6-3.2-1.7-5.8-3.9-7.9-6.6v35.7h-14.6V44.1h14.6v8.3c2-2.6 4.5-4.8 7.8-6.6zm20.6 17.9c-1.4-2.5-3.3-4.5-5.6-5.8-2.3-1.3-4.8-2-7.5-2-2.6 0-5.1.7-7.4 2-2.3 1.4-4.2 3.3-5.6 5.9-1.4 2.6-2.1 5.6-2.1 9.1s.7 6.5 2.1 9c1.4 2.6 3.3 4.5 5.6 5.9 2.3 1.4 4.8 2 7.4 2 2.7 0 5.2-.7 7.5-2.1 2.3-1.4 4.2-3.4 5.6-5.9 1.4-2.6 2.1-5.6 2.1-9.2.1-3.3-.6-6.3-2.1-8.9zM369.1 44.1v57.6h-14.7v-7.3c-1.9 2.5-4.3 4.5-7.3 5.9-3 1.4-6.3 2.1-9.8 2.1-4.5 0-8.5-1-12-2.9s-6.2-4.7-8.2-8.4c-2-3.7-3-8.1-3-13.3V44.1h14.6v31.7c0 4.6 1.1 8.1 3.4 10.6s5.4 3.7 9.4 3.7 7.2-1.2 9.5-3.7 3.4-6 3.4-10.6V44.1h14.7zM437 45.8c3.3-1.7 7.1-2.6 11.3-2.6 4.9 0 9.4 1.2 13.4 3.6 4 2.4 7.1 5.9 9.5 10.4 2.3 4.5 3.5 9.7 3.5 15.6s-1.2 11.1-3.5 15.7c-2.3 4.5-5.5 8.1-9.5 10.6s-8.4 3.7-13.4 3.7c-4.3 0-8.1-.8-11.3-2.5-3.2-1.7-5.8-3.9-7.8-6.6v8.2h-14.6v-77h14.6v27.8c1.9-2.9 4.5-5.2 7.8-6.9zm20.6 17.9c-1.4-2.5-3.3-4.5-5.6-5.8-2.3-1.3-4.8-2-7.5-2-2.6 0-5.1.7-7.4 2-2.3 1.4-4.2 3.3-5.6 5.9s-2.1 5.6-2.1 9.1.7 6.5 2.1 9 3.3 4.5 5.6 5.9c2.3 1.4 4.8 2 7.4 2 2.7 0 5.2-.7 7.5-2.1 2.3-1.4 4.2-3.4 5.6-5.9s2.1-5.6 2.1-9.2c0-3.3-.7-6.3-2.1-8.9zM516.4 100.1c-1.7-1.6-2.5-3.7-2.5-6.1 0-2.4.8-4.5 2.5-6.1 1.7-1.6 3.9-2.4 6.5-2.4s4.7.8 6.3 2.4c1.7 1.6 2.5 3.7 2.5 6.1 0 2.4-.8 4.5-2.5 6.1-1.7 1.6-3.8 2.4-6.3 2.4-2.7 0-4.8-.8-6.5-2.4z" />
    <Path
      d="M582.6 100.2c-3.7-1.7-6.7-4-8.9-6.9-2.2-2.9-3.4-6.1-3.6-9.7h14.7c.3 2.2 1.4 4.1 3.3 5.5 1.9 1.5 4.3 2.2 7.1 2.2s4.9-.6 6.5-1.7c1.6-1.1 2.3-2.5 2.3-4.3 0-1.9-.9-3.3-2.9-4.2-1.9-.9-4.9-2-9.1-3.1-4.3-1-7.8-2.1-10.6-3.2-2.7-1.1-5.1-2.8-7.1-5.1s-3-5.4-3-9.3c0-3.2.9-6.1 2.8-8.7 1.8-2.6 4.5-4.7 7.9-6.2 3.4-1.5 7.5-2.3 12.1-2.3 6.9 0 12.3 1.7 16.4 5.2 4.1 3.4 6.4 8.1 6.8 13.9h-13.9c-.2-2.3-1.2-4.1-2.9-5.5-1.7-1.4-4-2-6.8-2-2.6 0-4.7.5-6.1 1.5s-2.1 2.3-2.1 4.1c0 1.9 1 3.4 2.9 4.4 1.9 1 5 2 9 3.1 4.2 1 7.6 2.1 10.3 3.2 2.7 1.1 5 2.8 7 5.2 2 2.3 3 5.4 3.1 9.2 0 3.3-.9 6.3-2.8 8.9-1.8 2.6-4.5 4.7-7.9 6.2-3.4 1.5-7.4 2.2-12 2.2-4.5-.1-8.8-.9-12.5-2.6zM683.5 45.8c3.3-1.8 7.1-2.7 11.3-2.7 4.9 0 9.4 1.2 13.4 3.6 4 2.4 7.1 5.9 9.5 10.4 2.3 4.5 3.5 9.7 3.5 15.6s-1.2 11.1-3.5 15.7c-2.3 4.5-5.5 8.1-9.5 10.6s-8.4 3.7-13.4 3.7c-4.2 0-8-.9-11.2-2.6-3.2-1.7-5.8-3.9-7.9-6.6v35.7h-14.6V44.1h14.6v8.3c1.9-2.6 4.5-4.8 7.8-6.6zm20.6 17.9c-1.4-2.5-3.3-4.5-5.6-5.8-2.3-1.3-4.8-2-7.5-2-2.6 0-5.1.7-7.4 2-2.3 1.4-4.2 3.3-5.6 5.9s-2.1 5.6-2.1 9.1.7 6.5 2.1 9 3.3 4.5 5.6 5.9c2.3 1.4 4.8 2 7.4 2 2.7 0 5.2-.7 7.5-2.1 2.3-1.4 4.2-3.4 5.6-5.9 1.4-2.6 2.1-5.6 2.1-9.2 0-3.3-.7-6.3-2.1-8.9zM762.6 57.2c2.3-4.5 5.5-8 9.5-10.4 4-2.4 8.4-3.6 13.4-3.6 4.3 0 8.1.9 11.3 2.6 3.2 1.7 5.8 3.9 7.8 6.6v-8.2h14.7v57.6h-14.7v-8.4c-1.9 2.7-4.5 4.9-7.8 6.7s-7.1 2.7-11.4 2.7c-4.9 0-9.3-1.3-13.3-3.7s-7.1-6-9.5-10.6c-2.3-4.5-3.5-9.8-3.5-15.7.1-5.9 1.2-11.1 3.5-15.6zm39.8 6.6c-1.4-2.5-3.3-4.5-5.6-5.8-2.4-1.4-4.9-2-7.6-2s-5.2.7-7.5 2-4.2 3.2-5.6 5.8c-1.4 2.5-2.1 5.5-2.1 9s.7 6.5 2.1 9.1c1.4 2.6 3.3 4.6 5.6 6 2.3 1.4 4.8 2.1 7.4 2.1 2.7 0 5.2-.7 7.6-2 2.4-1.4 4.2-3.3 5.6-5.8 1.4-2.5 2.1-5.6 2.1-9.1.1-3.7-.6-6.7-2-9.3zM864.6 57.3c2.4-4.5 5.8-7.9 10.1-10.4s9.2-3.7 14.8-3.7c7.1 0 13.1 1.8 17.7 5.4 4.7 3.6 7.8 8.6 9.4 15h-15.7c-.8-2.5-2.2-4.5-4.2-5.9-2-1.4-4.4-2.1-7.3-2.1-4.2 0-7.5 1.5-9.9 4.5-2.4 3-3.6 7.3-3.6 12.9 0 5.5 1.2 9.7 3.6 12.7 2.4 3 5.7 4.5 9.9 4.5 5.9 0 9.7-2.6 11.6-7.9h15.7c-1.6 6.2-4.8 11.2-9.5 14.9-4.7 3.7-10.6 5.5-17.7 5.5-5.6 0-10.5-1.2-14.8-3.7-4.3-2.5-7.7-5.9-10.1-10.4-2.4-4.5-3.6-9.7-3.6-15.7-.1-5.9 1.1-11.1 3.6-15.6zM1011.7 77.3h-42.1c.3 4.2 1.8 7.4 4.4 9.8 2.6 2.4 5.7 3.5 9.5 3.5 5.4 0 9.3-2.3 11.6-7h15.7c-1.7 5.6-4.9 10.1-9.6 13.7-4.7 3.6-10.5 5.4-17.4 5.4-5.6 0-10.5-1.2-14.9-3.7s-7.8-5.9-10.3-10.5c-2.5-4.5-3.7-9.7-3.7-15.6 0-6 1.2-11.2 3.6-15.7s5.8-8 10.2-10.4c4.4-2.4 9.4-3.6 15.1-3.6 5.5 0 10.4 1.2 14.7 3.5 4.3 2.4 7.7 5.7 10.1 10s3.6 9.3 3.6 14.9c-.1 2.2-.2 4.1-.5 5.7zM997 67.5c-.1-3.7-1.4-6.7-4.1-9-2.6-2.3-5.9-3.4-9.7-3.4-3.6 0-6.6 1.1-9.1 3.3-2.5 2.2-4 5.2-4.5 9.1H997z"
      style={{
        fill: '#07d6a0',
      }}
    />
  </Svg>
);

export default SvgLogoText;
