# [A Yeoman 1.0 Backbone RequireJS Example] (http://www.youtube.com/watch?v=QYzjfT78Ir8)

This is an example application for using these libs meant to accompany the: [How To Code - Backbone RequireJS Yeoman Vids][vids]
[vids]: http://www.youtube.com/watch?v=QYzjfT78Ir8 "How To Code Videos"

---

<a href="http://www.youtube.com/watch?feature=player_embedded&v=QYzjfT78Ir8" target="_blank"><img src="http://img.youtube.com/vi/QYzjfT78Ir8/0.jpg" 
alt="How to code - Backbone RequireJS Yeoman Videos on Youtube" width="240" height="180" border="10" /></a>

---

# Installation

**DISCLAIMER: I did this in my spare time for example purposes; there are some "anti-patterns" you should avoid in a real project e.g. Category model code that uses backbone localstorage is not a recommended approach and is not __efficient__.**

Make sure you have Node.js, Git, Ruby and Compass installed. Oh and an internet connection...duh!

```base
# Make sure you have grunt and bower installed (well, yeoman too but not required):
npm install -g yo grunt-cli bower
# Install deps
grunt install && bower install
# I had issue getting correct backbone.localStorage via Bower
# What I did was suffix'ed the directory with .custom (so bower won't overwrite on updates, etc.
cd app/components/backbone.localStorage.custom # you might have to mkdir on backbone.localStorage.custom part
git clone https://github.com/jeromegn/Backbone.localStorage.git
# above should result in: app/components/backbone.localStorage.custom/backbone.localStorage.js
# Now go back to root of project and fire off grunt build and preview in browser
cd -
grunt && grunt server
```

# Contributing

Just because this is an instructional repo doesn't mean it can't be improved. If you see something glaringly wrong, please feel free tosubmit a PR. I'm open if it's a legitimate improvement.

1. Fork it
2. Create your feature branch (`git checkout -b my-new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin my-new-feature`)
5. Create new Pull Request

