---
layout: post
title: "Unveilling... Unveillance"
date: 2014-11-29 15:30:34
tags: the_latest opennews unveillance how-to
---

It's a simple idea, but I've found it so hard to explain.  If I could give it to you in three words: Open Source Palantir.

Unveillance is a tool that allows you to privately send documents to a server you maintain, and is dedicated to running bits of code experiements, written by you or your friends, on your documents.  Some processes are triggered to run based on the mime type of the documents you drop in; you can also chain together processes from within the software, or from a Github Gist.  You can then manage, rework, and mash-up the data that results from any of those processes, drawing you closer to whatever data-based questions you might ask about the documents you've collected.

Here's a little demo:

[ video ]

Unveillance can be configured to run on a single machine, or on an instance in the cloud, or on a Docker container, or any combination of those things; depending on your need.  It's designed to behave like Dropbox: you input documents into your Unveillance machine via a folder on your own computer, and can navigate your documents and data via a handy, locally-running web interface.

# 1. Setup

1.	before you get started, choose your configuration (let's assume a local frontend and an ec2-based annex)
1.	make annex config file
1.	or follow the prompts on install: ./setup.sh (annex)
1.	get annex config for frontend
1.	edit it as needed
1.	install: ./setup.sh (frontend)
1.	send public key to administrator (frontend)
1.	add key of client (annex)

# 2. Basic Use

1.	./startup.sh, ./shutdown.sh, ./restart.sh
1.	drop in a file, off it goes!

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

# 6. Troubleshooting

1.	./tail.sh : api, els, worker (annex)
1.	./tail.sh : api, watcher (frontend)
1.	Docs at the README
1.	fork the gists
1.	issues and pull requests welcome