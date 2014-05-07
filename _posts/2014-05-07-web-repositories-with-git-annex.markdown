---
layout: post
title: "Web repositories with git annex"
date: 2014-05-07 09:44:51
tags: git-annex how-to
---

As I described in a [previous post][prev_post], [git annex][ga_link] can be used to share files using git's infrastructure by uploading files via ssh to remote servers or computers.  This is a great tool for small organizations, because files can be easily shared and made available in a manner similar to dropbox but on networks of machines that you control yourself.

In this post, I'll cover how to make those assets available via a URL, so you can send someone a link to share any asset with them.  In order to do this, we'll have to create a special type of remote repository that's specifically for the web, and outfit our web server to respond with the content of a file that resides in our git annex repository.

### Accessing content the git-annex way

If you run the command `ls -la` from your remote repo, you'll see that all of your assets are actually symbolic links to the real assets that have been properly checked-in to the remote.  To find individual files, use the command `git annex whereis [filename]`.

If you're concerned about the safety of your files, you're in luck if you're using git annex.  Only files that are successfully pushed to your remote are available.  When you look for a file that's not in your repo, you're notified:

{% highlight bash %}
~/annex_local $ git annex whereis not_here.txt
git-annex: not_here.txt not found
{% endhighlight %}

Also, you look for a file When you query for a file outside of the remote repo, git annex will give you an error:

{% highlight bash %}
~/annex_local $ git annex whereis ../not_in_repo.txt
fatal: '../not_in_repo.txt' is outside repository
git-annex: ../not_in_repo.txt not found
{% endhighlight %}

That's great to know.  So, when you do have a file that's successfully checked-in, you'll see the following:

{% highlight bash %}
~/annex_local $ git annex whereis a_file.txt
whereis a_file.txt (2 copies) 
  	2a6013d6-6d52-4e10-b725-71f25f21ca73 -- annex_remote
   	5891af45-ecbc-41c1-84ba-bfd710480c9a -- here (annex_local)
ok
{% endhighlight %}

That list of hashes represents all the places git has checked a copy of the requested file.  In this example, we have a version stored on my local machine and on a remote machine (which we set up in the last tutorial.)

### Adding a web remote

To register this asset so it's accessible via URL, git annex includes the `addurl` method so you can associate the asset's file path to a URL you specify.  In my example, I want all requests to the `/files` endpoint to deliver the assets.  

{% highlight bash %}
~/annex_local $ git annex addurl --file a_file.txt http://localhost:8888/files/a_file.txt
addurl a_file.txt ok
{% endhighlight %}

For the method I've come up with, I add the `--relaxed` flag to the addurl call.  This ensure's the url will be added as long as my web server returns a successful code.

When you run this command, git annex will hit the URL you specified with a HEAD request (rather than a GET, PUT, or POST request).  For this command to work, your web server must return a 200 response code on success or 405 if the file cannot be accessed.  So, let's first update our server code to handle HEAD requests for a file; returning success if the requested file is in our git annex.

Now, whenever we hit our URL, the web server will:

1. check to see if the file is in our annex
2. if it is, find the file registered to the web remote (and add the file to our web remote if it's not there)
3. return the content of the file

Here's our updated API with these new functions.

{% gist harlo/58e040358b8ba43c405a %}

### A note of caution

Researchers [recently cautioned that][db_blog], if an asset you visit via this web remote has a URL in it, and you click that link, the URL of the asset itself will be revealed to a 3rd party because that asset's URL will be included in the referer header of the request you make once you click the hyperlink.  Referer headers are part of the way the web works (at least right now) so while I wouldn't call this a "bug," it's definitely worth taking note of if you're concerned about your own operational security.  In our next posts, I'll discuss securing your git annex installations.

[prev_post]: http://harlo.github.io/2014/04/16/so_im_excited_about_git-annex.html
[ga_link]: https://git-annex.branchable.com
[db_blog]: http://nakedsecurity.sophos.com/2014/05/07/dropbox-stumbles-over-security-and-privacy-of-secret-links/