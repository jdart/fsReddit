
When reading reddit I have a bad habbit of skimming headlines and going straight to the comments. I wanted to give react a shot so I decided to build a web app that puts the original content first, and has efficient navigation.

This project is based on the [este](https://github.com/este/este) starter project.

## Features

* Read one reddit post at a time
* Support for common media sources:
  * Imgur
  * Gfycat
  * Youtube
  * Instagram
  * Streamable.com
* Intuitive keyboard navigation
  * left/right arrows nagivate between posts
  * up/down arrows navigate current post (only applies to imgur)
* Upvoting/Unvoting
* User following
* Simple comment reader

## Known Issues

* Ugly/plain
* Only tested in Chrome
* App focused on passive users (i.e. no commenting)
* Really wide/tall images get scaled down too much
* Many sites prevent other sites from iframing them, and it's hard to detect sites that do that. If the site's onload event fires quickly, the site is assumed to be blocked and the app can't show its content. I have experimented with using a service like readability.com to provide the content but I don't want to run a server - it's there in the code if you want to try it (checkout the Content component).

