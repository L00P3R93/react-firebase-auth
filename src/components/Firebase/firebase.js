import { toHaveStyle } from '@testing-library/jest-dom/matchers';
import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signOut, 
    updatePassword 
} from 'firebase/auth'
import { 
    getDatabase,
    ref
} from 'firebase/database'

const config = {
    apiKey: process.env.REACT_APP_API_KEY,
    authDomain: process.env.REACT_APP_AUTH_DOMAIN,
    databaseURL: process.env.REACT_APP_DATABASE_URL,
    projectId: process.env.REACT_APP_PROJECT_ID,
    storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
    messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
    appId: process.env.REACT_APP_APP_ID,
};

class Firebase {
    constructor() {
        this.app = initializeApp(config);
        this.auth = getAuth(this.app);
        this.db = getDatabase(this.app);
    }

    /** Auth API */

    doCreateUserWithEmailAndPassword = (email, password) => 
        createUserWithEmailAndPassword(this.auth, email, password)

    doSignInWithEmailAndPassword = (email, password) => 
        signInWithEmailAndPassword(this.auth, email, password)

    doSignOut = () => signOut(this.auth);

    doPasswordReset = email => sendPasswordResetEmail(this.auth, email);

    doPasswordUpdate = password => updatePassword(this.auth, password);

    /** User API */

    user = uid => ref(this.db, `users/${uid}`)

    users = () => ref(this.db, 'users');
}

export default Firebase;