import React from 'react';
import { render, screen } from '@testing-library/react';
import { ChakraProvider, defaultSystem } from '@chakra-ui/react';
import App from '../App';

describe('title', () => {
  it('should render title', () => {
    render(
      <ChakraProvider value={defaultSystem}>
        <App />
      </ChakraProvider>
    );
    expect(screen.getByText('学習記録一覧!')).toBeInTheDocument();
  });
});

// import App from '../App';
// import { render, screen } from '@testing-library/react';
// import React from 'react';
// import { ChakraProvider, extendTheme } from '@chakra-ui/react';

// // 必要に応じてテーマをインポート
// const theme = extendTheme({});

// describe('title', () => {
//   it('should render title', () => {
//       render(
//         <ChakraProvider theme={theme}>
//       <App />
//       </ChakraProvider>;
//       );
//     expect(screen.getByText('学習記録一覧!')).toBeInTheDocument();
//   });
// });
