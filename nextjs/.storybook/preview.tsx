import React from 'react';
import { Preview } from '@storybook/react';

const preview: Preview = {
  decorators: [
    (Story) => (
      <>
        <link
          href="https://fonts.googleapis.com/icon?family=Material+Symbols+Outlined"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL@20..48,100..700,0..1"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Rounded:opsz,wght,FILL@20..48,100..700,0..1"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Sharp:opsz,wght,FILL@20..48,100..700,0..1"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Cairo:wght@200..1000&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Source+Code+Pro:ital,wght@0,200..900;1,200..900&display=swap"
          rel="stylesheet"
        />
        <link
          href="https://fonts.googleapis.com/css2?family=Inter:wght@400;600&display=swap"
          rel="stylesheet"
        />
        <Story />
      </>
    ),
  ],
};

export default preview;