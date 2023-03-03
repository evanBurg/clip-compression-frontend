import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { ChakraProvider } from '@chakra-ui/react';
import { extendTheme } from '@chakra-ui/react';

const Input = {
  baseStyle: {
    borderRadius: '0',
    field: {
      borderRadius: '0',
      background: 'red.400',
      color: 'orange.500',
      _placeholder: {
        color: 'orange.500',
      },
      _hover: {
        color: 'orange.600',
        borderColor: '#0070f3',
      },
    },
    addon: {
      borderRadius: '0',
    },
  },
  sizes: {
    lg: { borderRadius: 0, field: { borderRadius: 0 } },
    md: { borderRadius: 0, field: { borderRadius: 0 } },
    sm: { borderRadius: 0, field: { borderRadius: 0 } },
    xs: { borderRadius: 0, field: { borderRadius: 0 } },
  },
  defaultProps: {
    focusBorderColor: 'orange.700',
    borderRadius: '0',
  },
};

const Button = {
  baseStyle: {
    borderRadius: 0,
    color: 'orange.500',
    borderColor: 'orange.500',
    _hover: {
      bg: '#222',
    },
    _active: {
      bg: '#222',
    },
  },
  variants: {
    outline: {
      borderColor: 'orange.500',
      color: 'orange.500',
      _hover: {
        bg: '#222',
      },
      _active: {
        bg: '#222',
      },
    },
  },
  defaultProps: {
    _hover: {
      bg: '#222',
    },
    _active: {
      bg: '#222',
    },
  },
};

const theme = extendTheme({
  colors: {
    orange: {
      500: '#9a8866',
      600: 'rgb(139, 111, 57)',
      700: 'rgb(126, 94, 34)',
    },
    red: {
      400: 'hsla(0,0%,100%,.05)',
      500: '#441614',
    },
  },
  styles: {
    global: {
      body: {
        bg: 'black',
        color: 'orange.500',
      },
    },
  },
  components: {
    Input,
    Textarea: Input,
    Button,
  },
});

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <ChakraProvider theme={theme}>
    <App />
  </ChakraProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
