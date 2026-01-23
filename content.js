/**
 * GitHub Friday Merge Blocker
 * Blocks merge buttons on GitHub pull request pages on Fridays.
 */
;(function () {
  // Day of week constants (0 = Sunday, 6 = Saturday)
  const DAY_SUNDAY = 0
  const DAY_FRIDAY = 5
  const DAY_SATURDAY = 6

  const MIN_DAY = DAY_SUNDAY
  const MAX_DAY = DAY_SATURDAY

  // Polling interval for checking merge buttons (milliseconds)
  const POLLING_INTERVAL_MS = 2000

  // Check if today is Friday
  function isFriday() {
    // Test mode: allow simulating any day of the week via localStorage
    const testDay = localStorage.getItem('github-friday-blocker-test-day')

    if (testDay !== null) {
      if (testDay === 'true') {
        return true // Backward compatibility
      }
      const dayNum = parseInt(testDay, 10)
      if (!Number.isNaN(dayNum) && dayNum >= MIN_DAY && dayNum <= MAX_DAY) {
        return dayNum === DAY_FRIDAY
      }
    }

    const today = new Date()
    return today.getDay() === DAY_FRIDAY
  }

  function getButtonText(button) {
    return button.textContent.trim().toLowerCase()
  }

  function isMergeButton(button) {
    const text = getButtonText(button)
    const mergePatterns = [
      /^merge$/,
      /^squash and merge$/,
      /^rebase and merge$/,
      /^confirm merge$/,
      /^confirm squash$/,
      /^confirm rebase$/,
      /^merge pull request$/i,
      /^enable auto-merge$/i
    ]

    return mergePatterns.some((pattern) => pattern.test(text))
  }

  function getRandomFridayMessage() {
    const messages = [
      "🔥 It's Friday my dudes. 🔥",
      '🚫 No merges on Friday!',
      '⏸️ Friday freeze activated.',
      "🛑 Stop! It's Friday. No deployments before the weekend.",
      '📅 Friday = No merge day. Protect your weekend!',
      '⚠️ Friday merge detected. Abort mission!',
      '🔒 Friday lock engaged. Try again Monday.',
      "🎉 It's Friday! Time to relax, not deploy.",
      '💤 Friday = No code in production. Sleep well!',
      '🚨 Friday alert: Merges are disabled. Enjoy your weekend!'
    ]
    return messages[Math.floor(Math.random() * messages.length)]
  }

  function preventMergeAction(element, eventName) {
    element.addEventListener(
      eventName,
      (e) => {
        e.preventDefault()
        e.stopPropagation()
        e.stopImmediatePropagation()
        return false
      },
      true
    )
  }

  function blockMergeButtons() {
    if (!isFriday()) {
      return // It is not Friday my dudes
    }

    const allButtons = document.querySelectorAll('button')

    allButtons.forEach((button) => {
      if (button.hasAttribute('data-friday-blocked')) {
        return
      }

      if (isMergeButton(button)) {
        // eslint-disable-next-line no-param-reassign
        button.disabled = true
        button.setAttribute('aria-disabled', 'true')
        button.setAttribute('data-friday-blocked', 'true')
        button.setAttribute('data-friday-message', getRandomFridayMessage())

        // Add visual indicator
        button.classList.add('friday-blocked')

        // Prevent click events
        preventMergeAction(button, 'click')
      }
    })

    // Also check for merge forms and disable them
    const mergeForms = document.querySelectorAll('form[action*="/merge"]')
    mergeForms.forEach((form) => {
      const submitButton = form.querySelector('button[type="submit"]')
      if (submitButton && !submitButton.hasAttribute('data-friday-blocked')) {
        if (isMergeButton(submitButton)) {
          submitButton.disabled = true
          submitButton.setAttribute('data-friday-blocked', 'true')
          submitButton.setAttribute(
            'data-friday-message',
            getRandomFridayMessage()
          )
          submitButton.classList.add('friday-blocked')

          preventMergeAction(form, 'submit')
        }
      }
    })
  }

  // Initial blocking
  blockMergeButtons()

  // Handle dynamically loaded content
  const observer = new MutationObserver((_mutations) => {
    blockMergeButtons()
  })

  // Start observing when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
      observer.observe(document.body, {
        childList: true,
        subtree: true
      })
    })
  } else {
    observer.observe(document.body, {
      childList: true,
      subtree: true
    })
  }

  // Re-check periodically
  setInterval(blockMergeButtons, POLLING_INTERVAL_MS)
})()
