---
layout: post
title: "How to unbrick the box"
date: 2014-09-05 09:55:41
---
 
_This post is one of a series of posts about OpenWRT hacking.  My OpenNews friends [@malev][at_malev], [@gaba][at_gaba], and I have been doing a lot of research into OpenWRT, and we're finally taking the time to write up our findings.  Hope you'll enjoy!_

One thing I've learned over the years is, the better you are at un-bricking your setup, the more efficient you'll be at hacking stuff.  If you "brick" your piratebox (which can happen easily!) you'll feel frustrated and worry that you'll never be able to recover from it.  So, before we really got to work, we made sure we learned how to come back from bricking the box. We became so good at repairing our boxes, we felt fully confident to experiment going forward, knowing that we could restore the boxes back to a working state if we got in trouble.  Here's how you un-brick the pirate box.

On our routers (we use the TP-Link MR3040, or Mr. 30-40, as I like to call it) there is a physical reset button.  Pressing the button requires a safety pin or paperclip, or even an earring (which Gaba and I already had, being fashionistas as we are!)

<img src="/assets/media{{page.id}}/box_and_earring.jpg" />

You'll know you've successfully entered failsafe mode if Mr. 30-40's LED pattern looks like this:

<img src="/assets/media{{page.id}}/failsafe_success.jpg" />

(Note: if the LED pattern looks like this:

<img src="/assets/media{{page.id}}/failsafe_fail.jpg" />

this means Mr. 30-40 has bootloaded, and you won't be able to do recovery.  Don't get discouraged!  Just turn off the box and try again-- you'll get it eventually.)

When Mr. 30-40 is turned on, poking the reset button prevents the router software from bootloading, and also, keeps the router broadcasting on the failsafe subnet with an IP address of 192.168.1.1.  So, connect your computer to Mr. 30-40 (via ethernet cable) and (manually) give your computer an IP address on that same subnet. 

<img src="/assets/media{{page.id}}/manual_ip.jpg" />

Now, you can telnet into Mr. 30-40 because you're on the same network.  (Try pinging the IP address: if all goes well, you'll be able to make a connection.)

So, run `telnet 192.168.1.1` and you'll be greeted by the OpenWRT screen (hallelujah!!!) and you're almost ready to go.  Run `mount_root` to force Mr. 30-40 to mount the assets on its filesystem, and you can edit any of the config files that you've borked.  It's also a good idea to keep backups of your configs on the box, and restore your state simply by running `cp good_wireless_config.backup wireless` (or whatever makes sense to you).

You can then restart the box and it will be fully restored.

[at_malev]: https://twitter.com/malev
[at_gaba]: https://twitter.com/gaba