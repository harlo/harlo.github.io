---
layout: post
title: "Neat little jekyll trick!"
date: 2014-04-23 10:05:53
tags: jekyll how-to
---

I find that Jekyll's infinite scriptability makes blogging so much more fun for me.  Since I love Jekyll so much, I decided to automate my blog-writing by adding a little script.  I gave it an alias ("blog") to point to my "jekyll-blog.sh" script, and when I run `blog` from terminal, a new post is automatically generated in the `_posts` folder.  I can optionally add a title by running something like `blog "Neat little jekyll trick"`, too.  (__note:__ no punctuation here because my script doesn't do much string validation.)

Also, a post's corresponding folders for media (like images) are created.  Folder generation is key for having standardized URLs for anything you insert; you should always have an assets folder to hold such things.  If I specify a title, a folder with it's title-slug is appended to the folder generation path. 

Finally, the script launches my prefered IDE so I can start blogging right away!  If you're a jekyll fan, I hope my little script is of use to you :)

{% gist harlo/11216974 %}


