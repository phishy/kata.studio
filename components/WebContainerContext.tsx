import { createContext } from 'react';

interface WebContainerContextProps {
  webContainer: any; // Replace `any` with the type of your web container
  webContainerReady: boolean;
}

const WebContainerContext = createContext<WebContainerContextProps | null>(null);

export default WebContainerContext;
