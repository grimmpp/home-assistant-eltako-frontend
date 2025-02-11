import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Connection } from "home-assistant-js-websocket";
import { HAConnection } from '../services/websocket_connection'

import {map} from 'lit/directives/map.js';
import { sharedStyles } from '../global-style';

// Correct order: Decorator directly before the class and export before the class definition
@customElement('device-table')
export class DeviceTable extends LitElement {
    @property() devices: object[] = [];
    @property() entities: object[] = [];
    @property() error: string | undefined = undefined;

    static styles = [
        sharedStyles,
        css`
        .event-viewer-table {
            color: green;
            background:rgb(5, 5, 5);
            border-collapse: collapse;
        }
        .event-viewer-table tr td {
            border: 1px solid rgb(70,70,70);
            padding: 4px;
            vertical-align: top;
            font-family: Roboto, Noto, sans-serif;
            font-color: lightgreen;
        }  
        .no_line_break td {
            white-space: nowrap;
        }
        .scrollable {
            overflow: auto;
            height: 100%;
            display: flex;
            flex-direction: column-reverse;
            height:400px;
            /* width: 100%; */
            border: 2px solid rgb(70,70,70);
            background:rgb(5, 5, 5);
            vertical-align: top;
        }
        `];

    protected async firstUpdated(_changedProps) {
        try {
            let conn = HAConnection.getInstance();
            await conn.connect();
            this.entities = await conn.getEntities();
            this.devices = await conn.getDevices();
            
            this.markEltakoDevices(this.devices, this.entities);

            console.log('entities: ', this.entities);
            console.log('devices: ', this.devices);

            (conn.connection as Connection).subscribeEvents((e: object) => {
                
            });


        } catch (e) {
            console.error('Error:', e);
            this.error = `Error: ${ (e as Error).message}`;
        }
    }


    protected markEltakoDevices(devices: Object[], entities: Object[]) {
        for (const d of devices) {
            d['domain'] = null;
            for (const e of entities) {
                if (d['id'] == e['device_id'] && e['entity_id'].toLowerCase().includes('eltako') ) {
                    d['domain'] = 'eltako';
                    break;
                }
            }
        }
    }

    
    protected renderRow(device: Object) {
        
        if (device['domain'] == 'eltako') {

            return html`<tr>
                            <td>${device['name']}</td>
                            <td>${device['model']}</td>
                            
                        </tr>`
        }

        return ''
        // return html`${JSON.stringify(data,null,2)}`
    }

    static columns: TableProps<Object>['columns'] = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        }]

    protected render() {
        if ( this.error ) {
            return html`${this.error}`
        }


        return html`
            <h2>Device Overview</h2>
            <div style="margin: 8px;">
                <div class="scrollable">
                    <table class="event-viewer-table">
                        ${this.devices.map(e => this.renderRow(e))}
                    <table>
                </div>
            </div>
        `
    }

}