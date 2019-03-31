/* @flow */

import App from './App';
import React from 'react';
import ReactDOM from 'react-dom';

const todoappRoot = document.getElementById('todoapp');
if (todoappRoot == null) throw new Error('App element #todoapp not found');

ReactDOM.render(<App />, todoappRoot);
