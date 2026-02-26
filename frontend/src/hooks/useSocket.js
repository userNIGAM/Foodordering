import { useEffect, useRef, useCallback, useState } from "react";
import io from "socket.io-client";

/**
 * Custom hook for Socket.io connection with JWT authentication
 * Handles connection, disconnection, and event listening
 */
export const useSocket = () => {
  const socketRef = useRef(null);
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState(null);

  // Initialize socket connection
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      console.warn("No token found for socket connection");
      return;
    }

    // Get backend URL from environment or use default
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5173";

    socketRef.current = io(backendUrl, {
      auth: {
        token: token,
      },
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionDelayMax: 5000,
      reconnectionAttempts: 5,
      transports: ["websocket", "polling"],
    });

    // Connection event handlers
    socketRef.current.on("connect", () => {
      console.log("✅ Connected to Socket.io server");
      setIsConnected(true);
      setError(null);
    });

    socketRef.current.on("connect_error", (err) => {
      console.error("❌ Socket connection error:", err);
      setError(err.message);
      setIsConnected(false);
    });

    socketRef.current.on("disconnect", (reason) => {
      console.log("🔌 Disconnected from server:", reason);
      setIsConnected(false);
    });

    // Cleanup on unmount
    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, []);

  // Function to listen to socket events
  const on = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.on(event, callback);
      // Return cleanup function
      return () => {
        if (socketRef.current) {
          socketRef.current.off(event, callback);
        }
      };
    }
  }, []);

  // Function to emit events to server
  const emit = useCallback((event, data) => {
    if (socketRef.current && isConnected) {
      socketRef.current.emit(event, data);
    } else {
      console.warn("Socket not connected, cannot emit event:", event);
    }
  }, [isConnected]);

  // Function to listen to event only once
  const once = useCallback((event, callback) => {
    if (socketRef.current) {
      socketRef.current.once(event, callback);
    }
  }, []);

  return {
    socket: socketRef.current,
    isConnected,
    error,
    on,
    emit,
    once,
  };
};

export default useSocket;
