import { initializeApp } from 'firebase/app';
import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signInWithEmailAndPassword, 
    sendPasswordResetEmail, 
    signInWithPopup,
    signOut, 
    updatePassword,
    GoogleAuthProvider,
    FacebookAuthProvider,
    TwitterAuthProvider,
    EmailAuthProvider,
    fetchSignInMethodsForEmail,
    linkWithPopup,
    unlink,
    linkWithCredential
} from 'firebase/auth'
import { 
    getDatabase,
    ref,
    set,
    onValue,
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

        this.emailAuthProvider = EmailAuthProvider;

        this.googleProvider = new GoogleAuthProvider();
        this.facebookProvider = new FacebookAuthProvider();
        this.twitterProvider = new TwitterAuthProvider();

    }
    /** Auth API */
    
    getAuthCredential = (email, password) => 
        this.emailAuthProvider.credential(email, password)

    doCreateUserWithEmailAndPassword = (email, password) => 
        createUserWithEmailAndPassword(this.auth, email, password)

    doSignInWithEmailAndPassword = (email, password) => 
        signInWithEmailAndPassword(this.auth, email, password)

    doSignInWithGoogle = () => 
        signInWithPopup(this.auth, this.googleProvider)
    
    doSignInWithFacebook = () => 
        signInWithPopup(this.auth, this.facebookProvider)

    doSignInWithTwitter = () => 
        signInWithPopup(this.auth, this.twitterProvider)    

    doFetchSignInMethodsForEmail = email => 
        fetchSignInMethodsForEmail(this.auth, email)
    
    doLinkWithPopup = (provider) => 
        linkWithPopup(this.auth.currentUser, provider)

    doUnlink = providerId => 
        unlink(this.auth.currentUser, providerId);

    doLinkWithCredential = credential => 
        linkWithCredential(this.auth.currentUser, credential);

    doSignOut = () => signOut(this.auth);

    doPasswordReset = email => sendPasswordResetEmail(this.auth, email);

    doPasswordUpdate = password => updatePassword(this.auth, password);

    /** User API */

    user = uid => ref(this.db, `users/${uid}`)

    users = () => ref(this.db, 'users');

    writeUserData = (uid, username, email, roles) => {
        set(this.user(uid), {
            username,
            email,
            roles
        })
    }

    readUsers = () => {
        return new Promise((resolve, reject) => {
            onValue(this.users(), snapshot => {
                const data = snapshot.val();
                if(data){
                    resolve(
                        Object.keys(data).map(key => ({
                            ...data[key],
                            uid: key,
                        }))
                    )
                }else{
                    reject(new Error('No users found'))
                }
            }, error => {
                reject(error)
            })
        })
    }

    readUserData = uid => {
        return new Promise((resolve, reject) => {
            onValue(this.user(uid), snapshot => {
                const data = snapshot.val();
                if(data){
                    resolve({
                        ...data,
                        uid
                    })
                }else{
                    reject(new Error('No user found'))
                }
            }, error => {
                reject(error)
            })
        })
    }

    onAuthUserListener = (next, fallback) => 
        this.auth.onAuthStateChanged(authUser => {
            if(authUser) {
                this.readUserData(authUser.uid).then(dbUser => {
                    if(!dbUser.roles) {
                        dbUser.roles = {};
                    }
                    
                    authUser = {
                        uid: authUser.uid,
                        email: authUser.email,
                        ...dbUser
                    };

                    next(authUser)
                }).catch(error => {
                    new Error(error);
                })
            }else {
                fallback()
            }
        });
}

export default Firebase;