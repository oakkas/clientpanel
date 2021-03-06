//Usage is from the below website
//https://github.com/prescottprue/react-redux-firebase

import { createStore, combineReducers, compose } from 'redux';
import firebase from 'firebase';
import 'firebase/firestore';
import { reactReduxFirebase, firebaseReducer } from 'react-redux-firebase';
import { reduxFirestore, firestoreReducer } from 'redux-firestore';

//Custom Reducers

import notifyreducer from './reducers/notifyReducer';
import settingsReducer from './reducers/settingsReducer';

const firebaseConfig = {
  apiKey: 'AIzaSyDbyT1vw8J36XM6BDqJQNuKqR2dqFt9lPs',
  authDomain: 'reactclientpanel-47b9a.firebaseapp.com',
  databaseURL: 'https://reactclientpanel-47b9a.firebaseio.com',
  projectId: 'reactclientpanel-47b9a',
  storageBucket: 'reactclientpanel-47b9a.appspot.com',
  messagingSenderId: '346266215760'
};

//React-redux-firebase config
const rrfConfig = {
  userProfile: 'users',
  useFirestoreForProfile: true // Firestore for Profile instead of Realtime DB
};

//initialize firebase instance
firebase.initializeApp(firebaseConfig);

//init firestore
const firestore = firebase.firestore();
const settings = { timestampsInSnapshots: true };
firestore.settings(settings);

// Add reactReduxFirebase enhancer when making store creator
const createStoreWithFirebase = compose(
  reactReduxFirebase(firebase, rrfConfig), // firebase instance as first argument
  reduxFirestore(firebase) // <- needed if using firestore
)(createStore);

// Add firebase to reducers
const rootReducer = combineReducers({
  firebase: firebaseReducer,
  firestore: firestoreReducer, // <- needed if using firestore
  notify: notifyreducer,
  settings: settingsReducer
});

//check for settings in local storage
if (localStorage.getItem('settings') == null) {
  //Default settings
  const defaultSettings = {
    disableBalanceOnAdd: true,
    disableBalanceOnEdit: false,
    allowRegistration: false
  };

  //Set to local storage
  localStorage.setItem('settings', JSON.stringify(defaultSettings));
}

// Create  initial state
const initialState = { settings: JSON.parse(localStorage.getItem('settings')) };

//Create store
const store = createStoreWithFirebase(
  rootReducer,
  initialState,
  compose(
    reactReduxFirebase(firebase),
    window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__()
  )
);

export default store;
