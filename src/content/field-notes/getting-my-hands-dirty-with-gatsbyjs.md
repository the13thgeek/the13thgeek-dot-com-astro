---
title: "Getting my hands dirty with GatsbyJS"
excerpt: "All my developer life I've mostly concentrated on developing either static client-side HTML-only websites or dynamic PHP web applications, so when I was…"
pubDate: 2019-09-13T03:54:22.000Z
author: "the13thgeek"
categories: ["events", "journal"]
tags: ["event", "gatsbyjs", "programming", "toronto", "travel", "web-dev", "web-unleashed-2019"]
featuredImage: "/images/field-notes/workshop-0.jpg"
wpId: 403
wpSlug: "getting-my-hands-dirty-with-gatsbyjs"
---

All my developer life I've mostly concentrated on developing either static client-side HTML-only websites or dynamic PHP web applications, so when I was introduced to the GatsbyJS, I couldn't exactly pick up the concept on how it works. _Client-side static site generator? It sounds like something I could do with PHP already? What am I missing?_

My employer is awesome enough to let me attend a Web Developer-focused conference once a year, so this year I signed up for Web Unleashed and registered for a workshop on GatsbyJS. I know I could learn Gatsby watching YouTube tutorials, but I think I'd be better off taking an interactive workshop where I get to learn it with fellow newbies and the fact that the instructor will be around and is always ready to assist.

Our workshop for today is led by [Wes Bos](https://wesbos.com/), and based off my acquaintances he's a good instructor so I did not pass up the opportunity.

![](/images/field-notes/workshop-0.jpg)

'This includes you, WordPress devs!" Hey, that's me! :D

![](/images/field-notes/workshop-1.jpg)

Setting up my dev environment

Wes has provided clear instructions on how to set up our workshop dev environment but I had a very rocky start as I was unable to get my Gatsby environment completely set up. Every time I try to run the `npm install` command it throws me an error about the missing `pngquant` library.

![](/images/field-notes/workshop-2.jpg)

This error threw me off tracks for a good half an hour!

Wes tried his best to assist and based off the answers we saw on StackOverflow, the error is mostly fixed by installing the latest version of Microsoft's _Visual Studio Community Edition_ so I jumped right away to the Microsoft site and was bewildered that the whole thing requires a download of a couple of gigabytes!

![](/images/field-notes/workshop-3.jpg)

Figured that this is probably my last hope in getting this thing sorted, I took the gamble and downloaded the whole thing while Wes began his lecture introduction. The idea of being left behind in a coding workshop, specifically on something I have little knowledge of terrifies me, so I had my fingers crossed the whole time while Visual Studio installs itself on my laptop.

I restarted my laptop as soon as VS has finished installing - boom! That worked like a charm.

I was able to follow along just fine, but it took me a good hour to two to completely wrap my head on the JAMStack concept and how it works. I guess years of being a front-end developer on a server-side setting made it a slightly steep learning curve in learning new things.

First impressions with Gatsby:

*   Looks like NodeJS creates a _virtual local server_ where Gatsby runs the code, which is mostly comprised of JavaScript and JSX.
*   The concept is similar to developing a Windows application - work on a bunch of source codes, libraries (dependencies), and compile into a portable and ready-to-deploy website composed of HTML, CSS and JavaScript. Everything is processed at build time, not on load time.
*   Because everything is built to be a static HTML site, all data collected from different sources are exported to static HTML as well. If back-end data gets updated or modified, the developer has to rebuild/recompile to update the site.
*   Hot-refresh is awesome!! I lost count on how much I spammed the F5 button every time I make changes to my code. I think it already became muscle memory at this point. It makes development so much easier!
*   The usage of single quotes and backquotes confuse me to no end, but it's probably more of a preference.
*   I like the modular approach to things - reminds me of my old projects when I was still learning Visual Basic back in university.
*   Converting `<a href>` to `<Link to>` reminds me of .NET when converting a Page Control into a Server Control `runat="server"`; and I like that it supports an `activeClassName`. I had to do some witchcraft in PHP to make that work!

![](/images/field-notes/workshop-4.jpg)

Lunch!

Just right after lunch time I was surprised at how quick we were able to build a functional 4-page website that loads lightning-fast. It gives me the impression that all the pages are coded in a single HTML file and it's just using some JavaScript wizardry to render content on the page.

The more functional parts were taught in the afternoon - converting several markdown (MDX) files into blog entries. It was tricky as it was handled in a way I've never seen before - Gatsby has hooks/events somewhat similar to WordPress but it had to call some other functions to be able to treat an entire folder of markdown files into a blog entry database.

We came up with this function in `gatsby-node.js` that does exactly that:

async function turnMDXIntoPages({ graphql, actions }) {
  // 1 query all tips
  const { data } = await graphql(\`
  query {
      allMdx(filter: { frontmatter: { type: { eq: "tip" } } }) {
        nodes {
          id
          frontmatter {
            slug
          }
        }
      }
    }
  \`);
  // 2 loop each tip
  const tips = data.allMdx.nodes;
  tips.forEach( tip=> {
      actions.createPage({
          // url
          path: \`/tip/${tip.frontmatter.slug}\`,
          // what React component should render
          component: path.resolve(\`./src/components/templates/Tip.js\`),
          context: {
              id: tip.id,
          }
      });
  } )
};

Then we began to import an external JSON file and treat it like a database like with the MDX files, but this time only the importing part was taught - Wes challenged us to generate an index page (list) of the items in the imported JSON and their respective "single" pages.

Suddenly I had this flashback in university when our programming instructor would teach us a basic code construct (e.g. a for-loop) and challenge us to "expand" it (e.g. "do a Fibonacci sequence) and the first person to solve it gets extra points. No extra points this time, but I rose up to the challenge. I had to be creative on this one as I'm completely new to Gatsby but what I did was I cloned the turnMDXIntoPages function into a new one and began to tinker with the code since in theory, the logic pretty much remains the same. It took me at least half an hour or so, but with great effort I came up with:

async function turnUsersIntoPages({ graphql, actions }) {
  // 1 query all users
  const {data} = await graphql(\`
  query {
      allUser {
        nodes {
          name
          phone
          website
          username
        }
      }
    }
  \`);
  //console.log(data.allUser);
  // 2 loop each user
  const users = data.allUser.nodes;
  users.forEach( user=> {
      actions.createPage({
          // url
          path: \`/user/${user.username}\`,
          // what React component should render
          component: path.resolve(\`./src/components/templates/User.js\`),
          context: {
              username: user.username,
          }
      });
  } )
};

I think I spent the most time changing the GraphQL code. To be honest I'm still very intimidated by it despite its simple syntax. I've spent too much time in SQL that I had to resist the temptation not to look up an SQL-to-GraphQL converter online for this. Despite that, I'm glad that Node has included the GraphiQL UI, it helped a lot in testing and assembling queries in a sea of unknown objects. In the end it worked, thanks to Wes being responsive to me raising my hands every 5 minutes because I encounter a compilation error that I do not understand, lol! Thanks, Wes!

He distributed some of his trademark stickers and pencils to everyone at the workshop. It makes a good set of souvenirs!

*   ![](/images/field-notes/wesbos-pencil.jpg)
    
    "Never stop making things" - from your friend Wes Bos
    
*   ![](/images/field-notes/wesbos-stickers.jpg)
    
    Bos Stickers!
    

It was a lot to take in, but at the end of the session I didn't feel overwhelmed at all. I began thinking of any possible best use-cases where I can try and start implementing Gatsby (on a smaller scale to start, of course) in my future projects. I may not completely understand 100% of what we did today, it's a good jumpstart. That's how I learned HTML back then anyway - I saved "existing" HTML codes from sites that I like and I tried to tinker and play around with it.

Also, I'd like to thank the hotel's charging station for saving my \[phone's\] life today - because I'm a doofus and I left my USB-C cable at the hotel. :P

I'm ready for all the fun topics for the conference in the next two days! Bring it on!!

![](/images/field-notes/korean-bbq.jpg)

Wrapped up my first day in Toronto with some good Korean BBQ. Hey, I earned it! :P