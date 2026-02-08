"use client";

import { useState } from "react";

export default function SpotifyAuthPage() {
  const [clientId] = useState("e40037a58f3f4b9f91aa4622a13bdac5");
  const [redirectUri] = useState("http://127.0.0.1:3000/api/callback");

  const scopes = [
    "user-read-currently-playing",
    "user-read-recently-played",
    "user-read-playback-state",
    "user-top-read",
  ];

  const authUrl = `https://accounts.spotify.com/authorize?client_id=${clientId}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri
  )}&scope=${encodeURIComponent(scopes.join(" "))}`;

  return (
    <div style={{
      maxWidth: "800px",
      margin: "50px auto",
      padding: "20px",
      fontFamily: "system-ui, -apple-system, sans-serif",
    }}>
      <h1 style={{ color: "var(--color-primary)" }}>Spotify Authorization Helper</h1>

      <div style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}>
        <h2 style={{ marginTop: 0 }}>Required Setup</h2>
        <p>Before clicking the button below, make sure you've added this redirect URI to your Spotify app settings:</p>
        <ol>
          <li>Go to <a href="https://developer.spotify.com/dashboard" target="_blank" style={{ color: "var(--color-primary)" }}>Spotify Developer Dashboard</a></li>
          <li>Click on your app</li>
          <li>Click "Edit Settings"</li>
          <li>Under "Redirect URIs", add: <code style={{ background: "#333", padding: "2px 8px", borderRadius: "4px" }}>{redirectUri}</code></li>
          <li>Click "Add" then "Save"</li>
        </ol>
      </div>

      <div style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "8px",
        marginBottom: "20px",
      }}>
        <h2 style={{ marginTop: 0 }}>Required Scopes</h2>
        <ul>
          {scopes.map(scope => (
            <li key={scope}><code style={{ color: "var(--color-primary)" }}>{scope}</code></li>
          ))}
        </ul>
      </div>

      <a
        href={authUrl}
        style={{
          display: "inline-block",
          background: "var(--color-primary)",
          color: "white",
          padding: "15px 30px",
          borderRadius: "30px",
          textDecoration: "none",
          fontSize: "16px",
          fontWeight: "bold",
          marginBottom: "20px",
        }}
      >
        Authorize with Spotify
      </a>

      <div style={{
        background: "#1e1e1e",
        padding: "20px",
        borderRadius: "8px",
        marginTop: "20px",
      }}>
        <h2 style={{ marginTop: 0 }}>What happens next?</h2>
        <ol>
          <li>You'll be redirected to Spotify to authorize the app</li>
          <li>After authorization, you'll be redirected back to a page with instructions</li>
          <li>Copy and run the provided curl command in your terminal</li>
          <li>Update your <code style={{ background: "#333", padding: "2px 8px", borderRadius: "4px" }}>.env.local</code> with the new refresh token</li>
          <li>Restart your dev server</li>
        </ol>
      </div>
    </div>
  );
}
