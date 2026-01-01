"use client";

import { useSession } from "next-auth/react";

export default function DebugSession() {
  const { data: session, status } = useSession();
  console.log("SESSION:", session);
  console.log("STATUS:", status);
  
  return (
    <div style={{ padding: "20px", background: "#1a1a1a", color: "#fff", borderRadius: "8px", margin: "20px" }}>
      <h3>Debug Session</h3>
      <p><strong>Status:</strong> {status}</p>
      {session ? (
        <div>
          <p><strong>Email:</strong> {session.user?.email}</p>
          <p><strong>Name:</strong> {session.user?.name}</p>
          <p><strong>Image:</strong> {session.user?.image}</p>
        </div>
      ) : (
        <p>No session</p>
      )}
    </div>
  );
}
