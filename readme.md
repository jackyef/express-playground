Web security 101/Common security implications of 3rd party resources

Common attack vectors:
0. Anchor with missing:
   - noopener (Page B gain access to Page A via window.opener. No longer an issue on modern browser as noopener is the default)
   - noreferer
   - Also applies to opening 3rd party site with window.open()
1. Embedding 3rd party img
2. Running 3rd party script 
3. Cross-site scripting


Embedding 3rd party img:
- Cookies can be stolen (WRONG! Only cookies from the 3rd party origin are sent, that is if crossorigin is set to 'use-credentials' on the img)
- Timestamp can be observed (This is email marketer detect when you opened their emails)
- Referer can be tracked
- the Image URL (could be an unique hash), combined with the `referer` header can be used by the 3rd party to track user browsing history.

Running 3rd party script:
- Everything from img
- Attacker can embed script to your site, stealing even more data (localstorage, indexedDB, doing fetch(), etc)

Cross-site scripting
- Basically like running 3rd party script, but the origin is detected as first-party.

Problems:
- Stolen data
- Tracking

Solutions for the attack vector:
- Use noopener when using window.open() for untrusted sites.
- Prevent cookie from being stolen:
  - SameSite cookie
  - HttpOnly cookie
  - Secure cookie
- Content-security policy
  - Allow specific resources only (img, script, media, etc)
  - Used with nonce, can also prevent inline script (https://developer.mozilla.org/en-US/docs/Web/HTTP/Headers/Content-Security-Policy/script-src)

There is no solution for malicious code that you host on your own. These might come from malicious package and we 
just bundle it unknowingly.

This is how service providers track their users. For instance, Google would be able to track you to a certain extent from sites that:
- embeds Google Analytics
- uses google sign in
- renders an image of your Google Account avatar
- etc.

- Prevent your site users from being tracked:
  - Fetch using mode: 'no-cors' whenever possible so the browser doesn't share resources.
  - Insert img without `crossorigin` whenever possible
    - fetch with mode: 'no-cors' won't send cookie, but it can't send JSON body as well, so it might not be very useful in real-world cases when dealing with 3rd party APIs.