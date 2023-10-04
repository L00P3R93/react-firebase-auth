import React from 'react';
import ReactDOM from 'react-dom/client';

import './index.css';

import App from './components/App';
import Firebase, { FirebaseContext } from './components/Firebase';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<React.StrictMode>
		<FirebaseContext.Provider value={new Firebase()}>
			<App />
		</FirebaseContext.Provider>
	</React.StrictMode>
);
