import { StyleFunctionProps, extendTheme } from "@chakra-ui/react";

const breakpoints = {
  base: '0em',
  sm: '30em',
  md: '48em',
  lg: '62em',
  xl: '80em',
  '2xl': '96em',
}

const theme = extendTheme({
  breakpoints,
  fonts: {
    heading: `'Space Mono', monospace`,
    body: `'Space Mono', monospace`,
  },
  styles: {
    global: (props: StyleFunctionProps) => ({
      body: {
        color: 'defaultColor',
        bg: 'default',
      },
    }),
  },
  semanticTokens: {
    colors: {
      text: {
        default: 'gray.600',
        _dark: 'gray.200',
      },
      bg: {
        default: 'gray.50',
        _dark: 'gray.900',
      },
      'cma.red': {
        default: '#E84142',
        _dark: 'white',
      },
      default: {
        default: 'white',
        _dark: 'gray.800'
      },
      defaultColor: {
        default: 'gray.800',
        _dark: 'white'
      }
    }
  }
})
export default theme;