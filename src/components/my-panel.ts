import { html, css, LitElement } from 'lit';

class MyPanel extends LitElement {
  static styles = css`
    :host {
      display: block;
      padding: 16px;
    }
  `;

  render() {
    return html`
      <h1>My Custom Home Assistant Panel</h1>
      <p>This is a custom panel built with TypeScript and Lit.</p>
    `;
  }
}

customElements.define('my-panel', MyPanel);
