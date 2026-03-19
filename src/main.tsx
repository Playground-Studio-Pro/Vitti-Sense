import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { PortraitKioskWrapper } from './portrait-kiosk';
import './index.css';

/**
 * Portrait Kiosk Mode:
 *   When enabled (see src/portrait-kiosk/config.ts), the
 *   PortraitKioskWrapper rotates the app UI -90° inside the
 *   landscape monitor to produce a portrait kiosk experience
 *   WITHOUT changing the OS display orientation.
 *
 *   When disabled, PortraitKioskWrapper is a transparent passthrough
 *   — the app renders exactly as before with zero side effects.
 *
 *   To toggle: edit PORTRAIT_KIOSK_ENABLED in config.ts,
 *              or use ?portrait=1 / ?portrait=0 in the URL.
 */
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <PortraitKioskWrapper>
      <App />
    </PortraitKioskWrapper>
  </StrictMode>,
);
