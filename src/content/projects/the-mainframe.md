---
title: "theMainframe™"
description: "The Mainframe is a Twitch-integrated website where viewers can log in with their Twitch accounts to track their stats, levels (EXP), and leaderboards while engaging in interactive features. The platform enhances Twitch interactivity by rewarding participation and fostering a fun, gamified community experience."
type: "wip"
featured: true
order: 1
image: "/assets/projects/thumb-the-mainframe.jpg"
url: "https://mainframe.the13thgeek.com"
tech: ["NodeJS", "MySQL", "HTML", "Twitch API", "React"]
notes: ""
---

## Overview

**theMainframe** is my current Twitch-integrated web community. It's a centralized hub where my regulars  (viewers) can log in with their Twitch account and explore a fully-gamified community ecosystem. It blends user progression, collectible card designs, leaderboards and other live stream functions and interactivities into a single platform.
This project initially started as a custom small live-stream request service. This enabled viewers to request songs to play while I stream Dance Dance Revolution on weekends. I was initially using the Streamer Songlist service but after struggling on maintaining a single songlist for multiple games, I figured I had to write my own and expand the functionality I wanted that wasn't present on Streamer Songlist; including full customizability of the overlays and multiple song lists depending on the game.

## Technical Approach

- **Frontend:** The site is built using React with component-driven architecture, responsive layouts and Twitch integration.
- **Backend:** Node.js Express services handles user profiles, levelling, achievements and card inventory.
- **Data:** Using MySQL to store user profile information and related data.
- **Authentication:** Twitch OAuth for secure login, pulling essential profile data and using MySQL to store custom account metadata.
- **Deployment:** Site is currently hosted as a React application on Github Pages and the backend is deployed to Fly.io.

## Key Features
- **Twitch Login:** Users authenticate using their existing Twitch account to access their Mainframe profile with avatar and custom stats.
- **EXP + Level Progression:** theMainframe has a built-in levelling system where users gain EXP by watching my live streams. It tracks all in-stream interactions and viewer activity and awards experience points.
- **Collectible Card Designs:** Viewers check-in to the stream and it shows their personal "membership card" on stream which acts similar to a nameplate. They can collect multiple designs using a gacha mechanic on the live stream and collect various designs - some common, some rare and some are event or season-exclusive.
- **Live Stream Information:** Shows upcoming stream schedules, live stream information and available card designs on the current stream.
- **Leaderboards:** The site displays a ranking of the most active and most decorated viewers.
- **Profile Dashboard:** The site provides a dedicated space for users to view and manage their card collections, stats and achievements.
- **Modular Add-ons:** The system is designed so new mechanics and gimmicks can be layered without breaking existing functionality.
- **Song Request System:** The site provides a user-friendly searchable song database for viewers to search for playable songs during a rhythm game stream. It uses WebSocket to send requests directly from the site to the live stream.

## Challenges & Solutions

1. **Managing Authentication**

   Because of personalization, I needed a way for the system to "remember" users and their profile information without forcing them to create an account.

   **Solution:** I registered theMainframe as a Twitch application to be able to use its secure login and authentication that combines Twitch data (username & avatar) with my own custom database layer (EXP, cards, achivements).

2. **Card Spawn Logic**

   Designing spawn rules that adapt to streams, collaborators or events without hardcoding anything.

   **Solution:** Created a weighted spawn system where the system grabs all the available cards, their "weight" and employing an RNG algorithm that takes all of these into consideration.

```
{
  "firstName": "John",
  "lastName": "Smith",
  "age": 25
}
```

I need to highlight these ==very important words==.

- [x] Write the press release
- [ ] Update the website
- [ ] Contact the media

[^1]: First paragraph