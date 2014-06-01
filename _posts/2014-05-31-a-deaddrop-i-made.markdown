---
layout: post
title: "a deaddrop i made"
date: 2014-05-31 18:35:35
tags: how-to dead_drops piratebox openwrt lol_tradecraft
---

The fabulous [Aurelia Moser][aure] and I are going to be giving a talk at [Hope X][hope_x] next month on the topic of [dead drops][dd_wiki].  Dead drops are rad, and anyone who knows me just a little bit, knows that I have a thing for tradecraft.  I've been putting it off and putting it off, but I finally used this beautiful late-spring day to slap together a digital dead drop.

###Imagine, if you will...###

You're mad as hell, and you're not going to take it anymore!  Your boss has dicked you over for the last time, and you're about to dump the biggest leak in history.  You reach out to your reporter friend and invite her for coffee.

Sitting across from one another, after you've exchanged PGP keys, she says: "I'll follow up with an email."  She downs her Jameson (who am I kidding, she's not drinking coffee) and leaves.  The next day, an encrypted email shows up in your inbox; it reads:

`Get on the Brooklyn-bound L train at Bedford Avenue at 3:27 pm.  Sit in the second car.  Pull out your phone and join a network called "OMG SECRET SHIT" with the password doopie_d00pie_d00.  Then watch this You Tube Video: http://www.youtube.com/watch?v=qMPaTRYaaR8`

"Well, ok," you think.  "That's kind of cryptic, but whatever."  You follow the instructions, and on the train, when you click that link, you're facing a dinkly little page that simply contains an file uploader.  "Shiiiiiiiit!" you think, as you select your document from your phone's file system, and upload to some invisible little internet thingie somewhere on the train with you.  By the time you emerge at 1st Avenue, you've taken that dump, if you know what I mean.

###OK, cool.  Let's make that.###

OK.

####Ingredients####

* TP-Link TL-MR3040 Wireless Router ($35)
* USB stick or nubbin (at least 4GB, but we live in the turn-of-the-century so get a bigger one!)
* PirateBox

####Step 1: Hello OpenWRT!####

Install the OpenWRT and PirateBox software on your router according to [these instructions][darts_ins].  It's ok if you brick yours.  It's recoverable.  Once you've verified that PirateBox is working (meaning you can find the access point, join the network, and even send a chat message) you'll be super impressed with what you've got so far.  However, we want to make some l33t cloak-n-dagger crap, so let's rip out their interface and make out own! 

####Step 2: Let's add PHP####

What I want to do is, be able to authenticate certain people to upload files onto my router-- each person identifiable by a simple, one-time-use token.  Also, I want to be able to so some server-side authentication to prevent things like XSRF.  So, I'm going to want to add some server stuff for HTTP requests.  I want PHP.  But before I start adding packages, I need to reconnect the router back to the internet.

To do that, you have to plug the router back into your internet-serving router, and (temporarily) change some of the configurations to get to the net.  SSH into the router and open `/etc/config/network`.  Modify it like so:

{% highlight bash %}
config interface 'lan'
	option ifname 'eth0'
	option type 'bridge'
	option proto 'static'
	option netmask '255.255.255.0'
	option gateway '192.168.1.1'	# or whatever your router IP is
	option ipaddr '192.168.1.14'	# shouldn't confilict with your router's IP, btw!
	list dns '192.168.1.1'	# (router IP again)
	list dns '8.8.8.8'	# good-old Google DNS
{% endhighlight %}

Then reboot your router.  Once it's back on, you should be able to have it use the internet to download new software.  Let's:

{% highlight bash %}
opkg update
opkg -d piratebox install php5
opkg -d piratebox install php5-cgi
opkg -d piratebox install php5-mod-json
opkg -d piratebox install php5-mod-session
cp /mnt/ext/etc/php.ini /etc/
{% endhighlight %}

The php modules will be installed in a different place than where php thinks by default, so do a search-n-replace for the default path with our extension path with 

{% highlight bash %}
sed -i 's,extension_dir = \"/usr/lib/php\",extension_dir = \"/usr/local/lib/php\",g' /etc/php.ini
{% endhighlight %}

Finally, let's change the doc_root in php.ini to point to the PirateBox www folder.  Open up `/etc/php.ini` and replace

{% highlight bash %}
doc_root = "/www"
{% endhighlight %}

with

{% highlight bash %}
doc_root = "/opt/piratebox/www"
{% endhighlight %}

Cool, so we have PHP now, and it'll totally work once we re-init PirateBox.

####Step 3: Ditch the old default www####

We want to make our own file uploader thingie, so let's create our own web root for our own app.  To do this, we must create a folder called `www_alt` in the PirateBox directory (`/mnt/usb/Piratebox` usually.)  Go ahead, do it:

{% highlight bash %}
mkdir /mnt/usb/Piratebox/www_alt
{% endhighlight %}

And fill it up with your app files.  Perhaps, you place a stub phpinfo file as your `index.php`, just to test it out?

{% highlight php %}
<?php phpinfo(); ?>
{% endhighlight %}

Once that's done with, we have to reload and restart the PirateBox engine.  In order for PB to pull in our changes so far, we have to do the following __(NB: make sure you're not in either the `/mnt/usb` or `/opt/piratebox` directories; do `cd /` first!)__:

{% highlight bash %}
/etc/init.d/piratebox stop
/etc/init.d/piratebox updatePB
{% endhighlight %}

####Step 4: Fix your webserver config####

Now, piratebox is stopped.  That's ok-- we have to fix some things in our web server's configurations for PHP to be totally functional.  Open `/opt/piratebox/conf/lighttpd/lightpd.conf` and make the following edits:

Replace

{% highlight bash %}
static-file.exclude-extensions = ( ".php",".pl", ".fcgi" , ".cgi" , ".py" )
{% endhighlight %}

with

{% highlight bash %}
static-file.exclude-extensions = ( ".pl", ".fcgi" , ".cgi" , ".py" )
{% endhighlight %}

(Get it?  You just removed ".php" from the directive...)

And scroll down to

{% highlight bash %}
$HTTP["url"] =~ "^/cgi-bin/" {
	cgi.assign = ( ".py" => "/usr/bin/python" )
}
{% endhighlight %} 

and add

{% highlight bash %}
$HTTP["url"] =~ "^" {
	cgi.assign = ( ".php" => "/usr/local/bin/php-cgi" )
}
{% endhighlight %}

In my build, I also found the directives that allow users to see the directory tree and commented them out-- bad for security.

{% highlight bash %}
#dir-listing.encoding        = "utf-8"
#server.dir-listing          = "enable"
{% endhighlight %}

You should also have a look at the line

{% highlight bash %}
# 404 Error Page with redirect         
#                                       
server.error-handler-404 = "/redirect.html"
{% endhighlight %}

Might want to 1) make sure `/redirect.html` exists, and is appropriate for what you want, and 2) add the following

{% highlight bash %}
server.errorfile-prefix = "/error-"
{% endhighlight %}

...so you have error pages, instead of generic, auto-generated pages that leak information about your server set-up.

Now, start up PirateBox with

{% highlight bash %}
/etc/init.d/piratebox start
{% endhighlight %}

and you're done!  Since the box is on your home network, try accessing it by its IP-- you should see your index.

####Step 5: Configure your network and wireless settings####

You no longer need the box to be on the internet.  At this point, you should reconfigure the router to function as an access point, and put encryption on it.  First, edit `/etc/config/network` and restore its gateway, DNS, and IP address:

{% highlight bash %}
config interface 'lan'
	option ifname 'eth0'
	option type 'bridge'
	option proto 'static'
	option netmask '255.255.255.0'
	option gateway '192.168.1.1'
	option ipaddr '192.168.1.1'
	list dns '192.168.1.1'
{% endhighlight %}

Next, edit `/etc/config/wireless` to set your access point ssid and encryption:

{% highlight bash %}
config wifi-iface
	option device 'radio0'
	option network 'lan'
	option mode 'ap'
	option encryption 'psk2'
	option ssid 'OMG SECRET SHIT'
	option key 'doopie_d00pie_d00'
{% endhighlight %}

Reboot your router.  Like a boss.

[aure]: https://twitter.com/auremoser
[hope_x]: http://www.hope.net/
[dd_wiki]: http://en.wikipedia.org/wiki/Dead_drop
[darts_ins]: http://daviddarts.com/piratebox-diy-openwrt/