---
title: "What's \"Next?\""
excerpt: "That is indeed the question. Now that this site is up and running, I've managed to clean up and optimize some of the code, but there's still a few lingering…"
pubDate: 2024-10-09T01:47:49.099Z
author: "the13thgeek"
categories: ["Tech Blog"]
tags: [""]
featuredImage: "/assets/field-notes/whats-next-featured.jpg"
sanityId: "fbdd40f7-a4e2-4286-9607-d6218f7f7de5"
---

That is indeed the question.

Now that this site is up and running, I've managed to clean up and optimize some of the code, but there's still a few lingering problems:

- A few more repeating elements will have to be compartmentalized/modularized
- Exposed API keys (mostly read-only access, but still)
- Not SEO-friendly despite having the appropriate meta tags, possibly due to client-side rendering
The "next" step is inevitable, which made me think it's now the right time to learn server-side rendering (SSR). For a second there, I thought it was funny because I was coming from a decade's worth of experience in PHP/WordPress, which is pretty much SSR to begin with. But with the primary objective of upskilling myself, the other option couldn't be any more obvious - it's NextJS.

Diving into a lot of tutorials and documentation to start, it was a bit overwhelming. It gave me this odd feeling that by doing this, it feels like I'm unlearning what I just picked up from React and starting over from zero again.

But at the same time, I have this need to make this website SEO-friendly as it's more of an information website than an SPA (like the Power Morphicon Planner project), which means I can move on to NextJS for this one but maintain React for the Planner project.


---

Seeing all the changes that I need to do, I've created a new repository for the NextJS port instead of performing an in-place change.

The other decision I had to make is to pick whether to use Page Routing or App Routing. Page Routing looked simple and straightforward, but based on NextJS' recommendation I had to pick App Routing if I need to make this future-proof. I know the directory structure isn't as friendly as Page Routing, but I've developed a lot of static websites in my early days and each folder (route) having its own `page.tsx` file is almost synonymous with each folders having an `index.html` in the olden days.

I've began the porting process yesterday - I created a new repository, initialized a vanilla NextJS project and I started converting the skeletal parts: the global styles, layout and the global components (Navbar/Footer). Here are my observations so far:

- Still trying to get used to the new directory structure
- CSS modules are interesting - but they operate differently as it doesn't exactly like pure selectors and no hyphens on class names which I used *a whole lot*... which means a lot of the styles will have to be rewritten
- I learned to use `composes` to make modular classes inherit from their parents, but it throws off VSCode and reports it as an error (I'm using SASS as well)
- ...should I eliminate SASS then? But I need the global variables/mixins though. I know CSS supports variables now, but I'm still *very* concerned about cross-browser compatibility
- `Images` work differently as well, but not a big issue
- I like the concept of `layout.tsx` because it reminds me of the Master Pages from ASP.net
- Oh and yeah, I guess I have to learn TypeScript now. Not exactly a bad thing, it's +1 more item to add to the skill set, but it does feel overwhelming
I'm not backing out of this challenge, if making this website load faster and actually become SEO-friendly; it's worth it learning a new language and framework.

***That's what's next!***