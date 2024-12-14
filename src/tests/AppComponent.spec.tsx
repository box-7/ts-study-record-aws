import App from '../App';
import { render, screen } from '@testing-library/react';
import React from 'react';
import { ChakraProvider } from '@chakra-ui/react';

describe('title', () => {
  it('should render title', () => {
      render(
        <ChakraProvider>
      <App />
      </ChakraProvider>;
      );
    expect(screen.getByText('学習記録一覧!')).toBeInTheDocument();
  });
});
