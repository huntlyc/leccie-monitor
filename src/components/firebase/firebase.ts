import app from 'firebase/app';
import 'firebase/auth';

class Firebase {
  auth: app.auth.Auth;
  constructor() {
    const fireBaseConfig = {
      apiKey: process.env.REACT_APP_API_KEY,
      authDomain: process.env.REACT_APP_AUTH_DOMAIN,
      databaseURL: process.env.REACT_APP_DATABASE_URL,
      projectId: process.env.REACT_APP_PROJECT_ID,
      storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
      messagingSenderId: process.env.REACT_APP_MESSAGING_SENDER_ID,
      appId: process.env.REACT_APP_FB_APP_ID,
    };
    app.initializeApp(fireBaseConfig);



    this.auth = app.auth();
  }

  doCreateUserWithEmailAndPassword(email:string, password:string){
    return this.auth.createUserWithEmailAndPassword(email, password);
  }

  doSignInWithEmailAndPassword(email:string, password:string){
    return this.auth.signInWithEmailAndPassword(email, password);
  }

  doSignOut(){
    this.auth.signOut();
  }

}


export default Firebase;