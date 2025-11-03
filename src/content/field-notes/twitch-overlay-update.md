---
title: "Twitch Overlay Update!"
excerpt: "Welcome to the13thgeek Season 3! I recently decided to update my overlay setup with a fresh new visual experience. We went from a bullet train vibe (Season 2)…"
pubDate: 2024-11-05T14:51:00.000Z
author: "the13thgeek"
categories: ["Tech Blog"]
tags: ["twitch", "graphic design", "animation"]
featuredImage: "/assets/field-notes/twitch-overlay-update-featured.jpg"
sanityId: "ffc688be-7930-42cc-aacd-2fe687b9ac3c"
---

Welcome to the13thgeek Season 3!

I recently decided to update my overlay setup with a fresh new visual experience. We went from a bullet train vibe (Season 2) to airplanes for this new one!

Theming everything has always been one of things I love doing. When I was designing Season 2's setup, everything from the screens, HUD widgets to various audio-visual cues are all made to give off the feel of being in a bullet train, including the alerts and redeems.

In designing these overlays, I primarily used Adobe Photoshop to design the assets, occasionally VS Code for some dynamic HTML content (like the local time display) and Adobe AfterEffects to create the WEBP animations.

Here's a run-through of the changes/updates I've made for the new setup:


![](https://cdn.sanity.io/images/94cv7x6u/production/ca5d0bc21a1d60f3c6f697814119a7016d512316-900x340.jpg)

The intro screen retains most of the elements from the previous design, but I added a corner-pin effect to make it look like the slideshow is displayed from the in-flight entertainment screen. The music player is carried over as well. Another fun touch I added is the fake flight safety video that will play on the "screen" before I officially begin the stream. Early birds should be able to catch it!


![](https://cdn.sanity.io/images/94cv7x6u/production/cd4d0d7c052d242e5979d155d903585dbe3838dc-900x340.jpg)

The next thing that viewers will catch is the new stinger transition. For these things, I am mostly inspired by the shutter transitions used in the game beatmania IIDX. S2's colour scheme was green+white and I used those colours to create a futuristic train door. Same goes for S3, but with the new colours blue+white and a new layered door design.


![](https://cdn.sanity.io/images/94cv7x6u/production/6a9645b3a95388fb93b052abd7db449e72a6a8e7-900x340.jpg)

The MC/Chatting screen got a fresh update as well. Compared to S2, I've added the date as well to go with the local time display. There are now two "consoles" (designed to mimic an airplane seat console) on the top and bottom of the screens to display relevant stream information. The bottom console can also dynamically switch to a scrolling ticker for events such as follows, subscriptions and other alerts.


![](https://cdn.sanity.io/images/94cv7x6u/production/68571c0f53f0ab6fdc18a726a3adaf1590811a18-900x340.jpg)

The main program screen carries over many of the elements from the MC screen, including the consoles. I decided to maintain the general layout of the game screen, chat and webcam because I still find this layout very effective and worth keeping. Initially I thought of making the game screen bigger but I've always been concerned of the chat and webcam widgets blocking some of the game. I've always preferred to keep the chat in the video to provide context for VOD watchers and for accessibility reasons.


![](https://cdn.sanity.io/images/94cv7x6u/production/66867b765309f40ddafa3935a22907194ddfbec4-900x340.jpg)

The Break screen is a clone of the intro screen, with the in-flight entertainment system (IFE) style intact. The only difference is that the IFE now plays viewer-created clips of the stream while music is playing. Part of a future update I'm working on is that I will be adding commands that viewers can use to "switch" channels on the IFE. Channels include the slideshow (as shown in the Intro), clips, music player and possibly a few selected VODs.


![](https://cdn.sanity.io/images/94cv7x6u/production/4a724f7b04d0b532778e2daf15dc15e39e2eecd8-900x340.jpg)

Another screen that got a major update is the screen I use for dance game streams like DDR (Dance Dance Revolution). For this setup I use my secondary overhead camera to capture my entire movement, I'm using a free online service (Streamer Songlist) to let viewers request songs.

I'm still playing around with this layout to see if the new overhead camera would look better on the left of the gameplay instead of on the right where it's lumped together with the chat widget.

In S3, I retained the same chat style as the MC/Game screens and enlarged the overhead camera view. I'm preparing to move away from Streamer Songlist as it only supports one playlist and I tend to play multiple rhythm games, each with their own list, and it has limited customizability.

I've started working on a frontend/backend app to replace the song request functionality and will be featured in a later blog post in detail.

Non-visual changes include a new set of audio cues. The "train-style" announcements from S2 has been changed to airplane-style ones, using a different PA chime.


---

I like my new setup so far and I'm getting good feedback. However, work isn't done and here are the items I am currently working on:

- New song request system (custom-coded)
- Different configurations of the bottom console to adapt to different games/programs
- IFE channel-switching capability during breaks
- Random events that will trigger the fasten seat belt sign
To know more about my Twitch misadventures, click here!