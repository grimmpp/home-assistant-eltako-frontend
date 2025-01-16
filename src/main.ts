import { css, html, LitElement } from "lit";
import { customElement, property } from "lit/decorators.js";

// import { applyThemesOnElement } from "@ha/common/dom/apply_themes_on_element";
// import { navigate } from "@ha/common/navigate";
// import { ProvideHassLitMixin } from "@ha/mixins/provide-hass-lit-mixin";
// import type { HomeAssistant, Route } from "@ha/types";
// import { computeRTL, computeDirectionStyles } from "@ha/common/util/compute_rtl";
// import { fireEvent } from "@ha/common/dom/fire_event";
// import { mainWindow } from "@ha/common/dom/get_main_window";
// import { listenMediaQuery } from "@ha/common/dom/media_query";
// import { makeDialogManager } from "@ha/dialogs/make-dialog-manager";
// import "@ha/resources/ha-style";

import type { LocationChangedEvent } from "./types/navigation";

import { HAConnection } from './services/websocket_connection'

import './services/websocket_connection'
import { InfoPanel } from "./components/info-panel";
import { Banner } from "./components/banner"
// import "./components/my-panel";


declare global {
  // for fire event
  interface HASSDomEvents {
    "eltako-reload": undefined;
  }
}

@customElement("eltako-frontend")
class EltakoFrontend extends LitElement {
  @property({ attribute: false }) private infoPanel: InfoPanel;

  protected async firstUpdated(_changedProps) {
    this.removeOriginalHeader()
    
    let conn = HAConnection.getInstance();
    const data = await conn.getInfo();
    // console.log('data: ', data)
    const config = await conn.getHassConfig();
    // console.log('config: ', config)
    const themes = await conn.getHassThemes();
    // console.log('themes: ', themes)
    
    // this.hass = {
    //   connection: conn.connection,
    //   states: {},
    //   config: config,
    //   themes: themes,
    // }

    // this.addEventListener("eltako-location-changed", (e) => this._setRoute(e as LocationChangedEvent));

    this.infoPanel = new InfoPanel()
    const banner = new Banner()

    this.addEventListener("eltako-reload", async (_) => {
      console.log("Reloading object");

      // Create websocket connection
      
    });

    document.body.addEventListener("keydown", (ev: KeyboardEvent) => {
      if (ev.ctrlKey || ev.shiftKey || ev.metaKey || ev.altKey) {
        // Ignore if modifier keys are pressed
        return;
      }
      if (["c", "e"].includes(ev.key)) {
        // @ts-ignore
        fireEvent(mainWindow, "hass-quick-bar-trigger", ev, {
          bubbles: false,
        });
      }
    });

  }

  protected removeOriginalHeader() {
    console.log("Remove original header")
    // const header = document.querySelector(".toolbar");

    // if (header instanceof HTMLElement) {
    //   header.style.display = "none"; // Hide the header
    // } else {
    //   console.error("Header element not found or is not an HTMLElement.");
    // }

    let toolbarElements: HTMLCollectionOf<Element> = document.getElementsByClassName(".toolbar");
    
    for (let element of toolbarElements) {
      console.log("Found toolbar element:", element);
      // Example: Change background color
    }
  }

  protected render() {
    return html`
      <eltako-banner></eltako-banner>
      <info-panel></info-panel>
    `;
  }

  static get styles() {
    // apply "Settings" style toolbar color for `hass-subpage`
    return css`
      html * 
      {
        color: rgb(33, 33, 33);
        font-family: Roboto, Noto, sans-serif;
        font-feature-settings: normal;
        font-kerning: auto;
        font-optical-sizing: auto;
        font-size: 14px;
        font-size-adjust: none;
        font-stretch: 100%;
        font-style: normal;
        font-variant-alternates: normal;
        font-variant-caps: normal;
        font-variant-east-asian: normal;
        font-variant-emoji: normal;
        font-variant-ligatures: normal;
        font-variant-numeric: normal;
        font-variant-position: normal;
        font-variation-settings: normal;
      }
      h2 {
        font-family: Roboto, Noto, sans-serif;
      }
      body {
        margin: 0px;
      }
    `;
  }

  private _applyTheme() {
    // this.style.backgroundColor = "var(--primary-background-color)";
    // this.style.color = "var(--primary-text-color)";
  }
}


declare global {
  interface HTMLElementTagNameMap {
    "eltako-frontend": EltakoFrontend;
  }
}