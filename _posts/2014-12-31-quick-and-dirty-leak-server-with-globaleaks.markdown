---
layout: post
title: "Quick-and-dirty Leak Server with Globaleaks and 2FA"
date: 2014-12-31 21:15:09
tags: how-to virtualbox docker globaleaks 2fa lol-tradecraft turducken
---

For my last trick of 2014, I spent the afternoon making a leak server running locally in my home.  I wanted to make a pretty-secure box that you could treat like a burner, spinning it up as need be.

This is the setup:  I have a linux machine in my house that has a 2 TB external hard drive attached to it.  On this hard drive, I created a virtual machine (using Oracle's VirtualBox) that runs Ubuntu Server 14.04.  On this virtual machine, I have a docker image that's dedicated to serving up my Globaleaks instance.  The Globaleaks instance can be ssh'd into only using a ssh key that resides on the "host"/virtual machine.  The virtual machine, in turn, can only be ssh'd into via 2-factor authentication; I use Google's PAM module to make that work.  Here's how:

### 1. Make your virtual machine

Spin up VirtualBox and create a new machine.  The machine's network settings should be "Bridged Adapter" and bridged to whatever network interface is serving the internet to the host.  My machine is on ethernet, so I bridge it to eth0.

Once you've initialized your machine (AND DUH, ENCRYPT THE DISK!) install the things you'll need to create your Globaleaks server:

	sudo apt-get update
	sudo apt-get install python-dev docker.io libpam-google-authenticator

Set up 2-factor auth following the directions here: [http://www.howtogeek.com/121650/how-to-secure-ssh-with-google-authenticators-two-factor-authentication/][htg_2fa].  It's pretty simple.

### 2. Setup your Docker image

Docker's super fun.  To make Globaleaks run on it, you're going to need some basic files, and create a Dockerfile to tell Docker how to put it all together.  First, make a folder with all those assets you're going to need:

	mkdir GL

Download the Globaleaks install script and set it to executable:

	wget -O GL/gl_install.sh https://deb.globaleaks.org/install.sh
	chmod +x GL/gl_install.sh

Here's my template for a Dockerfile for Globaleaks.  It should not be in the Globaleaks folder, but in its parent directory:

{% gist harlo/17e3d8649c644038cdb4 %}

Once you've built the docker image with `sudo docker build -t globaleaks/latest .` (from within the same directory as your Dockerfile), spin it up in the background with `sudo docker run -dPt globaleaks:latest`.  

You should be able to see what port Docker has pushed your instance's ssh port to by querying the instances: `sudo docker ps -a`.  In my example, Docker put 22 on 49153.

You can then ssh into the Docker image with: `ssh -p 49153 globaleaks@localhost` and run the Globaleaks set-up script: `./gl_install.sh`.  Your globaleaks server is just about ready to go.

You'll want to know the Globaleaks server's .onion address, so you can direct people to leak to you.  So, let's find out with `sudo less /var/globaleaks/torhs/hostname`.  Copy-paste that address somewhere so you have easy access to it.

### 3. Lock down the Docker image

On your virtual machine (the VM hosting the Docker image), make an rsa keypair: `ssh-keygen -t rsa -b 4096` and append the public key to the Globaleak server's authorized keys file.  The file you want, `/home/globaleaks/.ssh/authorized_keys`, probably doesn't exist yet.  So create it and copy the host's public key in.

Edit the Globaleak server's ssh config (/etc/ssh/sshd_config) to only allow identity file-based authentication by changing the "PasswordAuthentication" directive from yes to no.  I also changed the "PermitRootLogin" from yes to no, but that change in-and-of-itself doesn't do much to improve your overall security, I'm told.

Now, only the bearer of the private key on your virtual machine can access the Globaleaks server via ssh.  And the only way to access that private key is from within the virtual machine, which is itself guarded by 2-factor authentication.  This is VM turducken.

### 4. Getting to the Globaleaks GUI

Globaleaks is easy to set up, and should be running on the docker image's port 8082, which is once again mapped to something on the host machine's 491xx space (query docker with `sudo docker ps -a` to find out where).  In order access the web interface, you need to do a bit of port forwarding all the way into the core of the turducken.

Ultimately, you just want port 8082 to show up on your own computer.  So, in the virtual machine, set up port forwarding: `ssh -i /path/to/private_key -p 49153 -n -L 8082:localhost:8082 globaleaks@localhost -f "tail -f /dev/null"` which creates a backgrounded daemon, doing nothing, that just maintains the port-forwarding from Globaleaks to the virtual machine.  Then, on your own computer, do the same port-tapping to the virtual machine: `ssh virtualmachine@network_address -n -L 8082:localhost:8082 -f "tail -f /dev/null"`.  Once you've properly authenticated with your smartphone's Authenticator app, you can navigate to http://localhost:8082 and setup your Globaleaks server.

You can kill any of those connections with `kill $(lsof -t -i:8082)` and be sure to do so, or else you'll have hanging connections all over the place and get frustrated that something's on port 8082 and you can't remember what or why.  You can even script that if you'd like.

### 5. Caveats

I just set this up in an afternoon, so I haven't tested out how well the Globaleaks server performs over time.  I think, depending on a variety of variables, that the clock on Docker images tends to lose accuracy over time, so that might throw off some crypto processes.  One workaround is to spin up the docker image with a pointer to the host's time: `sudo docker run -v /etc/localtime:/etc/localtime:ro -dPt globaleaks:latest` but not sure...

Anyhoos, lmk if any of that works for you!
Happy new year!

[htg_2fa]: http://www.howtogeek.com/121650/how-to-secure-ssh-with-google-authenticators-two-factor-authentication/