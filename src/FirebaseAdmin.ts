import admin from 'firebase-admin';
const fbAdminConfig = require('./firebaseAdminConfig.json')

class FireBaseAdmin{
    admin: admin.app.App;


    constructor(){
        this.admin = admin.initializeApp({
            credential: admin.credential.cert(fbAdminConfig),
            databaseURL: process.env.REACT_APP_DATABASE_URL,
        });
    }


    async createUser(email: string, password: string){
        try{
            const oldUser = await this.admin.auth().getUserByEmail(email);
            if(oldUser){
                await this.admin.auth().deleteUser(oldUser.uid);
            }
        }catch{
            /** User doesn't exist, carry on */
        }

        return this.admin.auth().createUser({
            email: email,
            password: password
        });
    }


    deleteUser(uid: string){
        return this.admin.auth().deleteUser(uid)
    }
}


const fbAdmin = new FireBaseAdmin();


export default fbAdmin as FireBaseAdmin;