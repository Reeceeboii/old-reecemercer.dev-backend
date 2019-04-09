# reecemercer.dev-backend
This is the backend for my personal website. In its current state, it is only responsible for the content listed on https://reecemercer.dev/GitHubViewer (my 'GitHub viewer').

This page has the aim of providing a one click solution to all of my public repositories currently listed on GitHub. My profile has the pinned repositories but this section can only show 6 of the however many repositories I currently have public. It also doesn't do things such as provide language statistics (i.e. how many of my current public repositories use Java? How does this number stack up to the number that use Python? etc...). You could argue that just clicking 'repositories' will take you right to it, but this still misses some insights into the work I've created that I'd like to have public.

It was this kind of thing that I wanted to have a single page on my website take care of. It is currently in its first kind of iteration, and there are many improvements (both in terms of functionality and the visuals) that I plan to make in the near future. The visuals side of things is purely frontend so it isn't much of a hassle, but the backend is where I interface with the GitHub API, and also expose my own API for the frontend to get more specific data from - so that's where more thought is needed. That brings me nicely onto the next thing I want to talk about; that being exactly how the backend works and provides the frontend with the data it needs.

### Basic architecture
 * **Frontend hosted on Netlify**
 * **Backend hosted on Heroku**
 * **MongoDB instance hosted on MongoDB Atlas**

1. Every 10 minutes, the backend server polls the GitHub API for data.
2. The data received from GitHub is then stored in the MongoDB instance, replacing and updating whatever was there previously.
3. Every visit to the GitHub Viewer page on *my site* retrieves its data from Mongo rather than GitHub.
  * This stops the site from unnecessarily overloading GitHub with requests if I ever suddenly get a spike in visitors or if someone refreshes the page a few times.

What this means is that if anything ever changes on my GitHub, it will be less than 10 minutes until that same data is mirrored in a way I designed on my personal site, and this all happens passively without me clicking a thing.

If this small API I currently have becomes something more substantial I might open it up to more people and make a system where anyone can punch in their name as part of a request, and receive personalised data back about their public repositories too.
The GitHub API does have a request limit however, even for authenticated users, but that's something for another time.
