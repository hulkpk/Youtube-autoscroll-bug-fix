// ==UserScript==
// @name         YouTube Shorts Auto-Scroll Killer (Final Lockdown)
// @namespace    http://tampermonkey.net/
// @version      5.0
// @description  Stops YouTube Shorts from revenge auto-scrolling after adblock detection, by blocking navigation, scroll bursts, autoplay, and URL mutation completely.
// @author       ChatGPT
// @match        https://www.youtube.com/shorts/*
// @grant        none
// ==/UserScript==

(function () {
    'use strict';

    const log = (...args) => console.log('%c[YT-SHIELD]', 'color: red; font-weight: bold;', ...args);

    let lastShortID = location.pathname;
    let lastChange = performance.now();
    let scrollCount = 0;
    let locked = false;

    // Patch pushState to cancel navigation
    const blockPushState = () => {
        const originalPushState = history.pushState;
        history.pushState = function (state, title, url) {
            if (url?.includes("/shorts/")) {
                log("🔒 pushState blocked:", url);
                return;
            }
            return originalPushState.apply(this, arguments);
        };
    };

    // Freeze internal navigation caused by Shorts
    const observeUrl = () => {
        setInterval(() => {
            const currentPath = location.pathname;
            const now = performance.now();

            if (currentPath !== lastShortID) {
                const delta = now - lastChange;
                lastChange = now;

                if (delta < 600) {
                    scrollCount++;
                    log(`⚠️ Fast scroll detected (${scrollCount})`, currentPath);
                } else {
                    scrollCount = 0;
                }

                if (scrollCount >= 3 && !locked) {
                    log("🚨 Revenge scroll detected. Locking URL...");
                    lockUrl();
                }

                lastShortID = currentPath;
            }
        }, 200);
    };

    // Lock the URL by reversing it back forcibly
    const lockUrl = () => {
        const fixed = lastShortID;
        locked = true;

        const loop = setInterval(() => {
            if (location.pathname !== fixed) {
                log("⛔ Restoring original short:", fixed);
                history.replaceState({}, '', fixed);
            }
        }, 100);

        window.addEventListener("yt-navigate-finish", () => {
            history.replaceState({}, '', fixed);
        });
    };

    // Block autoplay + video end
    const freezeVideoAutoplay = () => {
        const tryPatch = setInterval(() => {
            const video = document.querySelector('video');
            if (video) {
                clearInterval(tryPatch);

                video.autoplay = false;
                video.onended = null;

                video.addEventListener('ended', e => {
                    e.stopImmediatePropagation();
                    video.pause();
                    log("🛑 Video end trigger blocked.");
                });

                video.addEventListener('timeupdate', () => {
                    if (video.duration - video.currentTime < 0.3) {
                        video.pause();
                        log("⏸️ Paused before end.");
                    }
                });

                log("🎯 Video patched.");
            }
        }, 300);
    };

    // Unblock console.log if needed
    const unblockConsole = () => {
        try {
            const orig = console.log;
            console.log = function (...args) {
                orig.apply(this, args);
            };
            log("🔓 Console restored.");
        } catch (e) {}
    };

    // Bootstrap
    const start = () => {
        log("🧱 Anti-Revenge Shorts Script Activated.");
        unblockConsole();
        blockPushState();
        observeUrl();
        freezeVideoAutoplay();
    };

    window.addEventListener('yt-navigate-finish', () => {
        if (location.href.includes('/shorts/')) {
            log("🔄 Navigation Detected - Reinitializing");
            start();
        }
    });

    start();
})();
