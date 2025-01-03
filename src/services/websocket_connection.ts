import {
    getAuth,
    createConnection,
    ERR_HASS_HOST_REQUIRED,
    Connection,
    createLongLivedTokenAuth,
    Promise,
    Result,
  } from "home-assistant-js-websocket";

// const HA_LONG_LIVED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MjM3ZTZlYzY3MmY0MGU1YjFmMzk5ZGU2Y2E5NWI4MyIsImlhdCI6MTczNDk5MTk3OCwiZXhwIjoyMDUwMzUxOTc4fQ.JxkZf9yFmODwZgpQNIHF7II48fmtQ1GayVbNLOzukWk"
// const HA_URL = "http://192.168.178.91:8123"

export class HAConnection {
    private static instance: HAConnection; 
    private connection: Connection | undefined;

    private constructor() {
        this.connection = undefined
    }

    async connect() {
        if (this.connection == undefined) {
            let auth;
            const haUrl : string = process.env.HA_URL || "http://localhost:8123"
            const longLivedToken : string = process.env.HA_LONG_LIVED_TOKEN
            if ( longLivedToken ) {
                try{
                    auth = createLongLivedTokenAuth(haUrl, longLivedToken);
                } catch(err) {
                    console.error(err)
                }
            }
            else 
            {
                try {
                    // Try to pick up authentication after user logs in
                    auth = await getAuth();
                } catch (err) {
                    if (err === ERR_HASS_HOST_REQUIRED) {
                        // Redirect user to log in on their instance
                        auth = await getAuth({ hassUrl: haUrl });
                    } else {
                        alert(`Unknown error: ${err}`);
                        return;
                    }
                }
            }
            const connection = await createConnection({ auth });
            this.connection = connection
        }
    }

    public static getInstance(): HAConnection {
        if (!HAConnection.instance) {
            HAConnection.instance = new HAConnection();
        }
        return HAConnection.instance;
    }

    public async getInfo(): Promise<Result> {
        await this.connect()

        const result = this.connection.sendMessagePromise({
            type: 'eltako/info',  // Replace with the correct command type for the extension
        });

        return result
    }

};

