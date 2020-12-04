/**
 * Dependencies
 */

const package = require(`${process.env.PWD}/package.json`);

/**
 * Config
 */

module.exports = {
  'output': '"./src/config/_tokens.scss"',
  'version': `"${package.version}"`,
  'border': {
    'width': '3px',
    'style': 'solid',
    'radius': '16px'
  },
  'color': {
    'white': '#FFF',
    'blue': '#284CCA',
    'red': '#FC5D52',
    'gray': '#E6E8EC'
  },
  'font-family': {
    'system': ['-apple-system', 'BlinkMacSystemFont', '"Segoe UI"', 'Roboto', 'Oxygen-Sans', 'Ubuntu', 'Cantarell', '"Helvetica Neue"', 'sans-serif'],
    'monospace': 'monospace'
  },
  'font': {
    'body': 'system',
    'pre': 'monospace'
  },
  'font-weight': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-style': {
    'body': 'normal',
    'pre': 'normal'
  },
  'font-size': {
    'body': '1em',
    'pre': '0.9em'
  },
  'line-height': {
    'body': '1.2',
    'pre': '1.5'
  },
  'grid': '8px', // 8px grid system
  'typography': {
    'small': '16px',
    'mobile': '18px',
    'tablet': '20px',
    'desktop': '22px'
  }
};
