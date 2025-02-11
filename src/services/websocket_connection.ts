import {
    getAuth,
    createConnection,
    ERR_HASS_HOST_REQUIRED,
    Connection,
    createLongLivedTokenAuth,
    subscribeEntities,
    Promise,
    Result,
    SubscriptionUnsubscribe
  } from "home-assistant-js-websocket";
import { connect } from "http2";

// const HA_LONG_LIVED_TOKEN = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiI3MjM3ZTZlYzY3MmY0MGU1YjFmMzk5ZGU2Y2E5NWI4MyIsImlhdCI6MTczNDk5MTk3OCwiZXhwIjoyMDUwMzUxOTc4fQ.JxkZf9yFmODwZgpQNIHF7II48fmtQ1GayVbNLOzukWk"
// const HA_URL = "http://192.168.178.91:8123"

export class HAConnection {
    private static instance: HAConnection; 
    public connection: Connection | undefined = undefined;

    private constructor() {
        this.connection = undefined
    }

    public async connect() {
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
            console.log("Connected to Home Assistant WebSocket");
            // subscribeEntities(connection, (ent) => console.log(ent));
            // connection.subscribeEvents((e) => console.log(e))
            connection.subscribeEvents((e) => {
                if ( e['event_type'].toLowerCase().includes('eltako') ) {
                    console.log(e)
                }
            })
            // connection.subscribeEvents((e) => console.log(e), 'eltako_btn_pressed_fe_db_0a_10')
            // connection.subscribeEvents((e) => console.log(e), 'eltako_global_event_bus_received_msg')
            // connection.subscribeEvents((event) => console.log("Log line received:", event), "system_log_event");
            this.connection = connection
        }
    }

    public static getInstance(): HAConnection {
        if (!HAConnection.instance) {
            HAConnection.instance = new HAConnection();
        }
        return HAConnection.instance;
    }

    public async generic_sendMessagePromise(msg_type: string): Promise<Result> {
        await this.connect().catch(console.error);

        return await this.connection.sendMessagePromise({
            type: msg_type,  // Replace with the correct command type for the extension
        });

    }

    public async getInfo(): Promise<Result> {
        return await this.generic_sendMessagePromise('eltako/info')
    }

    public async getHassConfig(): Promise<Result> {
        return await this.generic_sendMessagePromise('get_config')
    }

    public async getStates(): Promise<Result> {
        return await this.generic_sendMessagePromise('get_states')
    }

    public async getHassThemes(): Promise<Result> {
        return await this.generic_sendMessagePromise('frontend/get_themes')
    }

    public async getUsbPorts(): Promise<Result> {
        return await this.generic_sendMessagePromise('eltako/potential_usb_ports')
    }

    public async getGateways(): Promise<Result> {
        return await this.generic_sendMessagePromise('eltako/configured_gateways')
    }

    public async getDevices(): Promise<Result> {
        return await this.generic_sendMessagePromise('config/device_registry/list')
    }

    public async getEntities(): Promise<Result> {
        return await this.generic_sendMessagePromise('config/entity_registry/list')
    }
};

