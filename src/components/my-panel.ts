import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';
import { HAConnection } from '../services/websocket_connection'

// Correct order: Decorator directly before the class and export before the class definition
@customElement('info-panel')
export class MyPanel extends LitElement {
  @property({ type: String }) result: string = 'Loading...';

  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #4caf50;
    }
  `;

  @property({ type: String }) headline: string = 'About';

  constructor() {
    super();
    this.init();
  }

  async init() {
    try {
      let conn = HAConnection.getInstance()
      // Example WebSocket call
      const data = await conn.getInfo()
      

      // Update the result state with the received data
      this.result = JSON.stringify(data, null, 2);
      console.log('Received data:', this.result);

      // this.result = data
    } catch (error) {
      console.error('Error:', error);
      this.result = `Error: ${error.message}`;
    }
  }

  render() {
    return html`
      <h1>${this.headline}</h1>
      <pre>${this.result}</pre>
    `;
  }
}
