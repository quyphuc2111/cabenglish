"use client"

import { useSocket } from "@/providers/socket-provider";
import { useEffect, useState } from "react";

const NotificationDebug = () => {
    const socket = useSocket();
    const [lastEvent, setLastEvent] = useState<string>('');
  
    useEffect(() => {
      if (!socket) return;
  
      const handleAnyEvent = (eventName: string, ...args: any[]) => {
        setLastEvent(`${eventName}: ${JSON.stringify(args)}`);
        console.log(`Socket event ${eventName}:`, args);
      };
  
      socket.onAny(handleAnyEvent);
  
      return () => {
        socket.offAny(handleAnyEvent);
      };
    }, [socket]);
  
    return (
      <div style={{ position: 'fixed', top: 10, right: 10, background: "red", padding: 10, color: "white" }}>
        <div>Socket ID: {socket?.id || 'Not connected'}</div>
        <div>Connected: {socket?.connected ? 'Yes' : 'No'}</div>
        <div>Last Event: {lastEvent}</div>
      </div>
    );
  };

  export default NotificationDebug;