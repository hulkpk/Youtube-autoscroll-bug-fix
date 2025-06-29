# 🛡️ YouTube Shorts Anti-AutoScroll Firewall

> ✋ Stops YouTube from "revenge scrolling" after adblock detection on Shorts.  
> ✅ Blocks auto-scroll, pushState hijack, video end jumps, and URL mutation.

---

## 🔍 Why?

YouTube Shorts often retaliate against adblockers by **forcefully and rapidly scrolling through videos**.  
This script restores control and **prevents aggressive behavior** by patching internal triggers.

---

## ⚙️ Features

✅ Detects "revenge scroll" pattern (3+ Shorts in under 2 seconds)  
✅ Freezes navigation to prevent skipping  
✅ Blocks `history.pushState()` on Shorts URLs  
✅ Prevents video-end from jumping to next Short  
✅ Bypasses internal YouTube URL rewrites  
✅ Restores `console.log` for debugging  
✅ Lightweight & privacy-safe

---

## 🛠 Installation

> You’ll need [Tampermonkey](https://www.tampermonkey.net/) or [Violentmonkey](https://violentmonkey.github.io/) installed in your browser.

1. Open your Tampermonkey dashboard
2. Click **Create New Script**
3. Paste in the [latest script code](./YouTube-Shorts-Revenge-AutoScroll-Firewall.user.js)
4. Save ✅

Make sure it’s enabled and matches the URL pattern:  
`https://www.youtube.com/shorts/*`

---

## 🔧 Recommended uBlock Origin Filters

To further reduce YouTube's ability to detect adblockers and trigger auto-scrolling, add the following custom filters in **uBlock Origin**:

1. Open uBlock Origin → Dashboard → **My Filters**
2. Paste the following rules:

```ini
||doubleclick.net^$third-party
||youtube.com/pagead/*$xmlhttprequest
||youtube.com/pagead/lvz?$xhr
youtube.com##+js(nano-stb, resolve)
youtube.com##+js(nano-sib)
youtube.com##.ytp-ad-module
youtube.com###player-ads
```


🧠 How It Works
The script uses:

🔄 setInterval to monitor Shorts URLs
🧱 Real-time URL patching via history.replaceState
🎬 Event listeners on <video> to pause before end
🔒 Locks to prevent future mutation once attack is detected


