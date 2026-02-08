# Spotify Web Player SDK Integration

## What's Implemented

✅ **Hybrid Playback System:**

- Real-time updates when playing in web app (no polling!)
- Fallback polling for external players (desktop/mobile)
- Automatic detection and switching

## How It Works

1. **Web Player SDK** initializes automatically when user visits the site
2. **Real-time state updates** when playing through web player
3. **Polling continues** as fallback to track external playback
4. **Seamless switching** between web and external players

## Usage

### 1. Add Web Player Controls to Your UI

Add the player controls component anywhere in your app:

```tsx
import WebPlayerControls from "@/components/WebPlayerControls";

export default function YourPage() {
  return (
    <div>
      <WebPlayerControls />
      {/* Your other components */}
    </div>
  );
}
```

### 2. Access Web Player from Context

```tsx
import { useAppContext } from "@/contexts/AppContext";

function YourComponent() {
  const { webPlayer } = useAppContext();

  const playTrack = async () => {
    if (webPlayer) {
      await webPlayer.play("spotify:track:TRACK_ID");
    }
  };

  return (
    <button onClick={playTrack} disabled={!webPlayer?.isReady}>
      Play in Web Player
    </button>
  );
}
```

### 3. Available Controls

```tsx
const { webPlayer } = useAppContext();

// Check if ready
if (webPlayer?.isReady) {
  // Play a specific track
  await webPlayer.play("spotify:track:TRACK_ID");

  // Play current track
  await webPlayer.play();

  // Pause
  webPlayer.pause();

  // Resume
  webPlayer.resume();

  // Toggle play/pause
  webPlayer.togglePlay();

  // Skip tracks
  webPlayer.skipToNext();
  webPlayer.skipToPrevious();
}
```

## Requirements

⚠️ **Spotify Premium Required**

- Web Playback SDK only works with Premium accounts
- Free users will see an error and fall back to polling mode

## Benefits

✅ **Real-time Updates** - No more 5-second delays  
✅ **Lower API Usage** - SDK provides events, no polling needed  
✅ **Better UX** - Instant feedback on play/pause  
✅ **Full Control** - Play, pause, skip directly from your app

## Limitations

❌ Only tracks playback in YOUR web app  
❌ Won't show desktop/mobile playback (use polling for that)  
❌ Requires Premium

## Testing

1. Open your app
2. Look for "Web Player Active" badge when ready
3. Use the player controls to play music
4. Check console for any errors

## Troubleshooting

**"Spotify Premium is required"**

- User needs Premium subscription
- App will fall back to polling mode automatically

**Player not initializing**

- Check browser console for errors
- Verify access token has correct scopes
- Ensure Spotify SDK script loads successfully

**No sound**

- Check browser permissions for audio
- Verify Spotify Premium status
- Try refreshing the page
