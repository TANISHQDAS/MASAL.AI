import { JSDOM } from 'jsdom';
import React from 'react';
import ReactDOMServer from 'react-dom/server';

const dom = new JSDOM('<!doctype html><html><body><div id="root"></div></body></html>', {
  url: 'http://localhost:3000'
});

global.window = dom.window;
global.document = dom.window.document;
global.navigator = dom.window.navigator;
global.localStorage = {
  getItem: () => null,
  setItem: () => {},
  removeItem: () => {},
  clear: () => {}
};

async function test() {
  try {
    const { default: App } = await import('./src/App.jsx');
    const html = ReactDOMServer.renderToString(React.createElement(App));
    console.log('RENDER SUCCESSFUL! HTML Length:', html.length);
    console.log('Snippet:', html.slice(0, 300));
  } catch (err) {
    console.error('RENDER FAILED WITH ERROR:');
    console.error(err);
  }
}

test();
