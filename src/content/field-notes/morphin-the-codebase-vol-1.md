---
title: "Morphin' the Codebase (vol. 1)"
excerpt: "It's Morphin' Time! So how did this project came to be? I'm a huge tokusatsu (Japanese live-action superhero TV shows) and I attend an convention called Power…"
pubDate: 2024-09-21T00:40:00.000Z
author: "the13thgeek"
categories: ["Tech Blog"]
tags: ["upskill", "Power Morphicon", "React"]
featuredImage: "/assets/field-notes/morphin-the-codebase-vol-1-featured.jpg"
sanityId: "10819255-429c-4903-8a9b-f7da0673b555"
---

It's Morphin' Time! So how did this project came to be?

I'm a huge *tokusatsu* (Japanese live-action superhero TV shows) and I attend an convention called Power Morphicon, a biannual tokusatsu convention that takes place in California. It's where fans of Power Rangers, Kamen Rider, etc would gather and hang out, make new friends and enjoy sharing their love and interest for tokusatsu and it's one of the conventions that's on my priority list.

This summer, PMC will take place in its usual venue in Pasadena and I would usually check their official website often for guest announcements and panel schedules. While their website has been regularly updated with information, it's not always the most user-friendly and accessible.

Let's start off with the Panels schedule:


![](https://cdn.sanity.io/images/94cv7x6u/production/1e9ea74991a746da0e12e331e2a598a01a1ffbd1-1280x720.png)

Their current implementation uses a vertical list of JPEG files, one for each room and day. While it does the job for the most part, convention attendees with diverse visual activities and are on their mobile devices find it challenging to look through the lists to find the convention panels that might interest them.

On both desktop and mobile, the JPEG images can be clicked and be zoomed in. It is observed as well that not all the table cells in each schedule have a consistent font sizing.

The same applies for the website's Photo Ops schedule:


![](https://cdn.sanity.io/images/94cv7x6u/production/11e33bb74cc1da88a0d264bfd54bc7c9c6be56aa-1280x720.jpg)

In this case, the site uses an embedded PDF viewer. This poses the same usability issues as the Panels, in addition to the possibility of the embedded PDF not rendering at all depending on what device the user views the page on.

I've been organizing a group trip to this convention with a few other attendees from my city and engaging with fellow attendees all over social media and most people have shared the same feedback.

And then I had "that" idea.

Currently I have been taking online courses to upskill while job-hunting, and I have recently learned React. With basic React still fresh on my mind and I've worked with JSON for the last few years, I figured I'd take advantage of this "problem" and come up with something simple - make both pages searchable!

The Monday before the convention weekend, I sat down and coded a basic SPA (single-page application) for this:


![](https://cdn.sanity.io/images/94cv7x6u/production/b0e88ce49748e77e34d91368acd948386c0754eb-1280x720.jpg)

It's a barebones React Vite app that reads off two JSON files, one each for panels and photo-ops. I could only load and loop through the JSON and display them as a basic table, but thanks to a few online tutorials and some friends doing some basic code review I managed to make a client-side search work.

The entire project only took about 4 hours to code and deploy, what took the bulk of the time was the data: I had to manually encode the information from the JPEG and PDF files into a JSON.

I published it on GitHub pages, posted a Tweet about it!


![](https://cdn.sanity.io/images/94cv7x6u/production/235316f3e3ebd28c799eac4e3f38b7365b90b68d-735x197.png)

With tokusatsu being a very niche fandom and myself not having a huge following, this was considered substantial. I've had friends tell me they used mine throughout the convention! I even get a heads-up from some people if they notice updates so I can update mine as well!

I was able to keep the information updated until the day my group and I had to fly out for the convention itself, as I did not have a laptop, but for the most part I've got a decent amount of people to use it despite my minimal reach.




![](https://cdn.sanity.io/images/94cv7x6u/production/4dfcfe6625dc086ffca092d280d05c5ab07a3787-717x469.png)

After the convention, a few people reached out to me and said they liked my implementation and suggested I reach out to the PMC organizers and see if I can help them out. I've tried reaching the main organizer Scott Zilner himself, but I have not received a response.

While the next PMC is not until 2026, it means I have 2 years to build up and hopefully it reaches more people!

This small project is not intended to fully replace Power Morphicon's website - it will always be the official go-to, I designed mine to be more of a complementary service; a chance for me to practice the new skills I've been learning; and help out the convention and the community I care about.

On the next posts, we'll cover how to build up from there. Other ideas involve:

- Backend conversion to move away from JSON
- Design changes/updates
- Adding a searchable guest list
- Adding a searchable exhibitor/booths list
- Planner function, where the users can check off items they are interested in and the page can create a list for them
- Notification, as inspired by other convention/event apps
The list may change depending on my progress, but those are what I have planned so far.

**Helpful links:**

- Project page
- Github repository