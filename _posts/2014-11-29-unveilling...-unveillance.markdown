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

1.	before you get started, choose your configuration (let's assume a local frontend and an ec2-based annex)
1.	there's no wrong way to make a family! (other configs: all-on-one-computer; docker-farm; mac & pc)
1.	make annex config file
1.	or follow the prompts on install: ./setup.sh (annex)
1.	get annex config for frontend
1.	edit it as needed
1.	install: ./setup.sh (frontend)
1.	send public key to administrator (frontend)
1.	add key of client (annex)

By default, the Annex will use port 8889.  The Annex will also broadcast messages on port 8890 by default.  Admins should make sure these ports (or whatever substitutes) are open to the network.

# 2. Basic Use

1.	./startup.sh, ./shutdown.sh, ./restart.sh
1.	drop in a file, off it goes!


    cd /path/to/annex/or/frontend
    ./startup.sh

By default, the Frontend is accessible on port 8888.

# 3. Search (frontend)

1.	search by mime type
1.	search by assets generated
1.	search by keyword
1.	cluster around keyword

# 4. Tasks (frontend)

1.	reindex a document
1.	re-do a task
1.	create a task pipe

# 5. GISTS!

1.	add a trusted github user (annex)
1.	create a gist on github
1.	add a gist to a task pipe
1.	sorry, api is kind of opaque but it WILL get better!

# 6. Public Users vs. Private Users

There are 4 tiers of users.  An administrator can restrict users of different tiers from different aspects of the site if necessary fairly easily.  A user with a no-access cookie (usually called "uv_public", but configurable in your settings) has a 0 status; a logged-out user has a 1 status; a regular, logged-in user as a 2 status; and the Frontend administrator has a status of 3. 

That way, if you want to share your document collection publicly over the internet, but don't want people to do run tasks on anything, only browse, you can put your public-facing port behind a proxy (like Nginx) to automatically add the 0-status, no-access cookie.

# 7. Troubleshooting

1.	./tail.sh : api, els, worker (annex)
1.	./tail.sh : api, watcher (frontend)
1.	Docs at the README
1.	fork the gists
1.	issues and pull requests welcome

# 8. Other Platforms

Unveillance is built for linux systems.  But, its configurations are so modular, it's possible to run both packages on any platform with virtualization software such as Oracle's VirtualBox.  I would recommend a Mac or Windows user to create a linux server image virtually, and add a shared volume that you can access from your host machine.  There is also a [somewhat complicated package I wrote for deploying to Docker][uv_deploy], but this might be a bit cumbersome in its current state.  I will be updating that package in coming months, though.

[pilhofer_blog]: http://aronpilhofer.com/post/57733248022/from-documents-to-data-help-build-a-toolkit-for
[uv_nyt]: https://github.com/harlo/CompassAnnex
[uv_gp]: http://github.com/harlo/InformaAnnex
[git-annex]: https://git-annex.branchable.com
[uv_deploy]: http://github.com/harlo/UnveillanceDeploy