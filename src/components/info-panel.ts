import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { Connection } from "home-assistant-js-websocket";
import { HAConnection } from '../services/websocket_connection';

import {map} from 'lit/directives/map.js';
import {EventViewer} from './event-viewer';
import { sharedStyles } from '../global-style';

// Correct order: Decorator directly before the class and export before the class definition
@customElement('info-panel')
export class InfoPanel extends LitElement {
  @property({ type: String }) error: string = 'Loading...';
  @property({ type: String }) headline: string = 'About';
  @property() enoceanEvents: string[] = ['Loading...'];
  @property() gateways: object[] = [];
  @property({ attribute: false }) private data = {};
  @property({ attribute: false }) private ha_config = {};
  @property({ attribute: false }) private usb_ports = [];

  static styles = [
      sharedStyles,
      css`
    .table_name {
      display: block;
      font-family: Arial, sans-serif;
      font-weight: bold;
    }
    .table_value {
    }
    .gw_table {
      text-align: left;
      border-collapse: collapse;
    }
    .gw_table tr td {
        border: 1px solid rgb(70,70,70);
        padding: 4px;
    }  
    h1 {
      color: #4caf50;
    }`];

  protected async firstUpdated(_changedProps) {
    try {
      new EventViewer();

      let conn = HAConnection.getInstance();
      await conn.connect();

    //   (conn.connection as Connection).subscribeEvents((e) => {
    //     if ( e['event_type'].toLowerCase().includes('eltako') ) {
    //         // this.enoceanEvents.push(JSON.stringify(e));
    //         this.enoceanEvents =  [...this.enoceanEvents, JSON.stringify(e)];
    //     }
    // })

      this.ha_config = JSON.stringify((await conn.getHassConfig()), null, 2)
      console.log("ha config: ", this.ha_config)

      // Example WebSocket call
      const data = await conn.getInfo()
      

      // Update the result state with the received data
      this.data = data

      this.usb_ports = await conn.getUsbPorts()

      this.gateways = await conn.getGateways()
      console.log("gw: ", JSON.stringify(this.gateways, null, 2))

      

      this.error = ""

      // this.result = data
    } catch (e) {
      console.error('Error:', e, (e as Error).stack);
      this.error = `Error: ${ (e as Error).message}`;
    }
  }

  pretifyText(o: object) {
    if (o.constructor.name == 'Array') {
      var result = new Array();
      (o as Array<object>).forEach(i => {result.push(this.pretifyText(i))})
      return result.join(', ')
    } else {
      return JSON.stringify(o, null, 2).replaceAll('"', '')
    }
  }

  protected render() {

    return html`
      <!--<h1>${this.headline}</h1>-->
      <pre>${this.error}</pre>

      <h2>Events</h2>
      <event-viewer style="width: 100%"></event-viewer>

      <h2>Gateways</h2>
      <table class="gw_table">
        <tr style><th>Name</th><th>Id</th><th>Type</th><th>HA Config Entry Id</th></tr>
        ${(this.gateways as Array<object>).map(gw => 
          html`<tr>
            <td>${gw['name']}</td>
            <td>${gw['id']}</td>
            <td>${gw['type']}</td>
            <td><pre>${JSON.stringify(gw, null, 2)}</pre></td>
        </tr>`)}
      </table>

      <h2>Eltako Integration Manifest</h2>
      <table>
        ${map(Object.keys(this.data), (i) => html`<tr><td class="table_name">${i}</td><td class="table_value">${this.pretifyText(this.data[i])}<td></tr>`)}
      </table>

      <h2>Potential USB Ports</h2>
      <ul>
        ${(this.usb_ports as Array<String>).map(e => html`<li>${this.pretifyText(e)}</li>`)}
      </ul>

      <h2>Home Assistant Konfiguration</h2>
      <details>
        <summary>Click to open/close.</summary
        <p>
          <pre>${this.ha_config}</pre>
        </p>
      </details>

    `;
  }
}
