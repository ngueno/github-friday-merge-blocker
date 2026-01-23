# GitHub Friday Merge Blocker

A Chrome extension that blocks GitHub merge buttons on Fridays to prevent weekend deployments.

## Features

- 🚫 Automatically disables merge buttons on GitHub pull request pages on Fridays
- 💬 Shows random developer-friendly messages on hover (10 different phrases)
- 🔄 Works with GitHub's dynamic content loading
- 🎨 Visual indicators on blocked buttons

## Installation

### From Source

1. Clone or download this repository
2. Open Chrome and navigate to `chrome://extensions/`
3. Enable "Developer mode" (toggle in the top right)
4. Click "Load unpacked"
5. Select the `github-friday-blocker` directory
6. The extension is now installed and active!

## How It Works

- The extension checks if today is Friday (day 5 of the week)
- On Fridays, it:
  - Disables all merge-related buttons (Merge, Squash and merge, Rebase and merge)
  - Adds visual styling to indicate the button is blocked
  - Shows a random tooltip message on hover (one of 10 developer-friendly phrases)
  - Prevents click events from executing

- On other days (Monday-Thursday), merge buttons work normally

## Technical Details

- **Manifest Version**: 3 (latest Chrome extension standard)
- **Content Script**: Runs on all GitHub pages (`https://github.com/*`)
- **Detection**: Uses multiple selectors to find merge buttons and forms
- **Dynamic Content**: Uses MutationObserver to handle GitHub's SPA navigation

## Customization

You can modify the behavior by editing `content.js`:

- Change the day check in `isFriday()` function (0 = Sunday, 6 = Saturday)
- Add or modify messages in the `getRandomFridayMessage()` function
- Modify button selectors if GitHub changes their UI

## Testing

To test the extension, you can simulate any day of the week via browser console:

**Simulate a specific day** (0 = Sunday, 1 = Monday, ..., 5 = Friday, 6 = Saturday):

```javascript
// Simulate Friday (blocks merges)
localStorage.setItem('github-friday-blocker-test-day', '5');
location.reload();

// Simulate Monday (allows merges)
localStorage.setItem('github-friday-blocker-test-day', '1');
location.reload();
```

**Disable test mode** (use actual day):

```javascript
localStorage.removeItem('github-friday-blocker-test-day');
location.reload();
```

## Browser Compatibility

- Chrome (Manifest V3)
- Edge (Chromium-based)
- Other Chromium-based browsers

## License

MIT

## Contributing

Feel free to submit issues or pull requests!
