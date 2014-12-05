---
layout: post
title: "Unveilling... Unveillance"
date: 2014-11-29 15:30:34
tags: the_latest opennews unveillance how-to
---

It's a simple idea, but I've found it so hard to explain.  If I could give it to you in three words: Open Source Palantir.

Unveillance is a tool that allows you to privately send documents to a server you maintain, and is dedicated to running bits of code experiements, written by you or your friends, on your documents.  Some processes are triggered to run based on the mime type of the documents you drop in; you can also chain together processes from within the software, or from a Github Gist.  You can then manage, rework, and mash-up the data that results from any of those processes, drawing you closer to whatever data-based questions you might ask about the documents you've collected.

Unveillance can be configured to run on a single machine, or on an instance in the cloud, or on a Docker container, or any combination of those things; depending on your need.  It's designed to behave like Dropbox: you input documents into your Unveillance machine via a folder on your own computer, and can navigate your documents and data via a handy, locally-running web interface.

Unveillance is what I call the core engine, but any developer can extend the core packages in order to create experiences specific to their need.  For example, this year I built two versions of Unveillance for two different purposes, both using the same core engine.  At [The New York Times][pilhofer_blog], I built a version customized for [natural language processing on corpuses of documents][uv_nyt].  I also led The Guardian Project in building a version dedicated to making use of [forensic metadata in images and video][uv_gp].

At the heart of it, documents are exchanged between the user interface (the Frontend) and the remote server (the Annex) Unveillance via [Git-Annex][git-annex].  Users can both query the Annex and program the Annex's behavior via the web interface.

Here's a little demo:

[ video ]

# 1. Setup

Unveillance comes in two parts, the Annex and the Frontend.  The Annex currently only runs on Debian/Ubuntu linux.  The Frontend can be run on Mac OSX as well.  While the two can be configured a number of ways (both Frontend and Annex on one machine, an Annex in the cloud and sever users worldwide, or ...) the videos in these tutorials assume a Mac OSX client and an Annex on Ubuntu Server 14.04 in the cloud.  __Mac OSX users should already have git-annex installed.__  Run `brew install git-annex` before starting.

The following video details how to set up the Annex:

<iframe width="560" height="315" src="//www.youtube.com/embed/EkEQwdWNYVY" frameborder="0" allowfullscreen></iframe>

This video details how to set up the Frontend:

<iframe width="560" height="315" src="//www.youtube.com/embed/CrHJ99ovIp0" frameborder="0" allowfullscreen></iframe>

By default, the Annex will use port 8889.  The Annex will also broadcast messages on port 8890 by default.  Admins should make sure these ports (or whatever substitutes) are open to the network.

# 2. Basic Use

The Annex and the Frontend are started up and shut down with `./startup.sh` and `./shutdown.sh`.  They can also be restarted with `./restart.sh`

<iframe width="560" height="315" src="//www.youtube.com/embed/-xNdsWEHTrw" frameborder="0" allowfullscreen></iframe>

Or, if tl;dw:

	cd /path/to/annex/or/frontend
	./startup.sh

By default, the Frontend is accessible on port 8888 and the Annex on 8889.

# 3. Troubleshooting

This is artisinal software.  There are bugs and new features will be added constantly.  This is a project I'm continuing with what little funding I've retained.  That said, there are a few features built-in to help any troubleshoot.

<iframe width="560" height="315" src="//www.youtube.com/embed/-L4O6epARf4" frameborder="0" allowfullscreen></iframe>

Also, please file your issues and pull requests.  Any effort sprucing up the UI would be greatly appreciated!

# 4. Public Users vs. Private Users

There are 4 tiers of users.  An administrator can restrict users of different tiers from different aspects of the site if necessary fairly easily.  A user with a no-access cookie (usually called "uv_public", but configurable in your settings) has a 0 status; a logged-out user has a 1 status; a regular, logged-in user as a 2 status; and the Frontend administrator has a status of 3. 

That way, if you want to share your document collection publicly over the internet, but don't want people to do run tasks on anything, only browse, you can put your public-facing port behind a proxy (like Nginx) to automatically add the 0-status, no-access cookie.

# 5. Other Platforms

Unveillance is built for linux systems.  But, its configurations are so modular, it's possible to run both packages on any platform with virtualization software such as Oracle's VirtualBox.  I would recommend a Mac or Windows user to create a linux server image virtually, and add a shared volume that you can access from your host machine.  There is also a [somewhat complicated package I wrote for deploying to Docker][uv_deploy], but this might be a bit cumbersome in its current state.  I will be updating that package in coming months, though.

[pilhofer_blog]: http://aronpilhofer.com/post/57733248022/from-documents-to-data-help-build-a-toolkit-for
[uv_nyt]: https://github.com/harlo/CompassAnnex
[uv_gp]: http://github.com/harlo/InformaAnnex
[git-annex]: https://git-annex.branchable.com
[uv_deploy]: http://github.com/harlo/UnveillanceDeploy