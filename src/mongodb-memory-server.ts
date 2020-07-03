//= [mongodb-memory-server](https://github.com/nodkz/mongodb-memory-server)
import { MongoMemoryServer, } from "mongodb-memory-server";
import readline from "readline-sync";
// import { Server } from 'http';
import Debug from "debug";
const debug = Debug("mongodb-memory-server");

/***
 * Start up mongodb-memory-server .
 * console press any key to shutdown. 
 */
async function MongoUp() {
    //! Create and start mongodb memory Server.
    const mongod = new MongoMemoryServer(
        {
            instance: {
                port: 37017, // by default choose any free port
                // ip?: string, // by default '127.0.0.1', for binding to all IP addresses set it to `::,0.0.0.0`,
                dbName: "wdev", // by default generate random dbName
                // dbPath?: string, // by default create in temp directory
                // storageEngine?: string, // by default `ephemeralForTest`, available engines: [ 'devnull', 'ephemeralForTest', 'mmapv1', 'wiredTiger' ]
                // replSet?: string, // by default no replica set, replica set name
                // auth?: boolean, // by default `mongod` is started with '--noauth', start `mongod` with '--auth'
                // args?: string[], // by default no additional arguments, any additional command line arguments for `mongod` `mongod` (ex. ['--notablescan'])
            },            
            // autoStart?: boolean, // by default true
        }
    );
    const uri = await mongod.getUri();
    // const port = await mongod.getPort();
    const dbPath = await mongod.getDbPath();
    const dbName = await mongod.getDbName();
    //! some code
    //   ... where you may use `uri` for as a connection string for mongodb or mongoose
    
    //! Wait input for shutdown server
    const msg = `mongodb-memory-server Start up.\n dbPath=${dbPath}\ndbName=${dbName}\nuri=${uri}\nAny key to exit.`;
    const input = readline.question(msg);
    debug("input=",input);
    //! you may check instance status, after you got `uri` it must be `true`    
    mongod.getInstanceInfo(); // return Object with instance data
    //! you may stop mongod manually
    await mongod.stop();
    //! when mongod killed, it's running status should be `false`
    mongod.getInstanceInfo();
    // even you forget to stop `mongod` when you exit from script
    // special childProcess killer will shutdown it for you
    
}

MongoUp();

