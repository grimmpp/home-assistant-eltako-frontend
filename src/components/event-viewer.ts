import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Connection } from "home-assistant-js-websocket";
import { HAConnection } from '../services/websocket_connection'

import {map} from 'lit/directives/map.js';

// Correct order: Decorator directly before the class and export before the class definition
@customElement('event-viewer')
export class EventViewer extends LitElement {
    @property() enoceanEvents: object[] = [];
    @property() error: string | undefined = undefined;

    static styles = css`
        .event-viewer-table {
            color: green;
            font-family: Roboto, Noto, sans-serif;
            background:rgb(5, 5, 5);
            border-collapse: collapse;
        }
        .event-viewer-table tr td {
            border: 1px solid rgb(70,70,70);
            padding: 4px;
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
        `;

    protected async firstUpdated(_changedProps) {
        try {
            let conn = HAConnection.getInstance();
            await conn.connect();

            (conn.connection as Connection).subscribeEvents((e: object) => {
                if (e['event_type'] && e['event_type'].toLowerCase().includes('eltako') ) {
                    this.enoceanEvents =  [...this.enoceanEvents, e]
                    console.log('event-viewer: ', JSON.stringify(e))
                }
            });
        } catch (e) {
            console.error('Error:', e);
            this.error = `Error: ${ (e as Error).message}`;
        }
    }

    public static convertEvent(e: Object) {
        if (e['event_type'] == 'eltako_global_event_bus') {
            return html`<tr>
                <td>${e['time_fired']}</td>
                <td>${e['event_type']}</td>
                <td>GW_${e['data']['gateway']['id']}</td>
                <td colspan="100"><pre>${JSON.stringify(e['data']['msg'], null, 2)}<pre></td>
            </tr>`
        }
        else if (e['event_type'].startsWith('eltako_btn_pressed') ) {
            return html`<tr>
                <td>${e['time_fired']}</td>
                <td>${e['event_type']}</td>
                <td>GW_${e['data']['gateway']['id']}</td>
                <td colspan="100"><pre>${JSON.stringify(e['data'], null, 2)}</pre></td>
            </tr>`
        } 
        // unknown event
        else {
            return html`<tr>
                <td>${e['time_fired']}</td>
                <td>${e['event_type']}</td>
                <td colspan="100"><pre>${JSON.stringify(e['data'], null, 2)}</pre></td>
            </tr>`
        }
    }

    protected render() {
        if ( this.error ) {
            return html`${this.error}`
        }

        if ( this.enoceanEvents.length == 0) {
            return html`<table><tr><td colspan="12">Waiting for data ... </td></tr></table>`
        }

        return html`
            <div style="margin: 8px;">
                <div class="scrollable">
                    <table class="event-viewer-table">
                        ${this.enoceanEvents.map(e => EventViewer.convertEvent(e))}
                    </table>
                </div>
            </div>
        `
    }

}