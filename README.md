# VQ (Video Quiz) Player

## Accessibility Updates

This branch integrates crucial accessibility (a11y) features directly into the core `master` codebase without adopting experimental modular architectures. The updates ensure that the video player is navigable via keyboard and properly communicates with screen readers.

### Key Enhancements

1. **Structural Document Roles**
   - The root `<body>` tags in the HTML templates (`vqPlayer/emptyProject/index.php` and `index.html_off`) have been updated to include `role="document"`. This provides essential structural context for screen readers.

2. **Visual Focus Indicators**
   - Implemented a high-visibility, 3px solid blue focus ring for all focusable interactive elements (`button`, `[role="button"]`, `[tabindex="0"]`, and `input`). 
   - This ring exclusively appears during keyboard navigation, greatly aiding sighted users who navigate without a mouse.
   - Added the `.sr-only` CSS utility class to support visually hidden screen-reader text.

3. **Dynamic Keyboard & ARIA Support**
   - Extracted core logic into a `setupAccessibility()` initialization function within `jpinst.js`.
   - **Static Controls:** Automatically injects ARIA roles (`role="button"`), tab indices (`tabindex="0"`), and labels (`aria-label`) into all static player controls (Play, Pause, Skip, CC, Mute, Sliders) on load.
   - **Dynamic Controls:** Intercepts the dynamic generation of Quiz elements (`questionButton`, `answerBox`) to immediately assign them correct ARIA and keyboard attributes as they are created.
   - **Keyboard Navigation:** Attached global `keydown` event listeners to interactive elements so that pressing `Enter` or `Space` natively triggers the `click()` event, allowing users to play/pause the video and answer questions using only their keyboard.
   - **Live Regions:** Score readouts and feedback (`#scoreBubble`, `#expoBox`) have been wrapped in `aria-live="polite"` regions so that screen readers automatically announce score changes to the user without requiring manual focus.

---
*Backported from the `perry` accessibility prototypes natively into the `jpinst.js` monolith.*
