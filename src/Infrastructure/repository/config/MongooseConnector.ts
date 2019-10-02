import * as mongoose from "mongoose";
mongoose.set('useNewUrlParser', true);
mongoose.set('useUnifiedTopology', true);
mongoose.set('useCreateIndex', true);
mongoose.set('useFindAndModify', false);

export type DbClient = mongoose.Mongoose;

export async function getDatabaseClient(dbUser: string, dbPassword: string, dbName: string) {
  return new Promise<DbClient>((resolve, reject) => {
    const connString = `mongodb+srv://${dbUser}:${dbPassword}@cluster0-4snc7.mongodb.net/${dbName}?retryWrites=true&w=majority`;
    mongoose.connect(connString);
    const db = mongoose.connection;
    db.on("error", (e: Error) => {
      console.error("Db connexion error:", e);
      reject(e);
    });
    db.once("open", () => {
      console.log("Db connexion success:", connString);
      resolve(mongoose);
    });
  });
}
