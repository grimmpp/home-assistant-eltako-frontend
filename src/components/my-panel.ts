import { LitElement, html, css } from 'lit';
import { customElement, property } from 'lit/decorators.js';

// Correct order: Decorator directly before the class and export before the class definition
@customElement('my-panel')
export class MyPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      font-family: Arial, sans-serif;
    }
    h1 {
      color: #4caf50;
    }
  `;

  @property({ type: String }) greeting: string = 'Welcome to My Custom Panel';

  render() {
    return html`
      <h1>${this.greeting}</h1>
    `;
  }
}
