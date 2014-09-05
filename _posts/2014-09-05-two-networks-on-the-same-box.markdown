---
layout: post
title: "Two networks on the same box"
date: 2014-09-05 14:20:01
tags: openwrt how-to
---
 
_This post is one of a series of posts about OpenWRT hacking.  My OpenNews friends [@malev][at_malev], [@gaba][at_gaba], and I have been doing a lot of research into OpenWRT, and we're finally taking the time to write up our findings.  All these posts are co-written.  Hope you'll enjoy!_

Now that you know a little bit about the project (link to whatever), that you wan to share some of your Internet bandwidth (link) and that you know how to "un-brick" your PirateBox, why don't we move one step forward in the craziness ad we setup two (yes two) different networks on your device. Let's think on a private secured network and a open to the public network. Both on the same device! Keep in mind that since we are dealing with an unpowerful device we are going to be hammering our PirateBox. But ... Why not?

By this point, you already have one WiFi network on your PirateBox.  Connect to it via ssh (or telnet), and run `ifconfig`.  You should see that the PirateBox has an IP address on the same subnet as your router.  Now, open another terminal window, and run `ifconfig` on your own machine.  You'll notice that you have an IP address on that very same subnet.  This isn't a bad thing, but it presents a security hole if you plan on sharing your network, because any machine that connects to this network has access to the same stuff as your router does. 

At this point, I'd like to ask you if you've enabled network encryption!  If you have, your network is somewhat more secure because at least only people who know your password can have network access.  But, boogey-man alert: passwords can be cracked!  Anyway, I'm getting ahead of myself...  Back to the subnet stuff.

Thankfully, we can create a new **interface** that will put connected devices on a different subnet.  That way, your private network that you share with your router is kept apart from the network your guests are using.  Let's create this interface.  Open up `/etc/config/network` and add a new interface similar to the one that describes your lan:

{% highlight text %}
config interface 'for_guests'
    option proto 'static'
    option ipaddr '10.100.251.1'    # or whatever you want your network to be (as long as its not the same as your private network!)
    option netmask '255.255.255.0'
{% endhighlight %}

Now, let's link up the interface we created to the radio by telling the wireless manifest about it.  Pop open `/etc/config/wireless` and add after the lan description:

{% highlight text %}
config wifi-iface
    option device 'radio0'    # or whatever your primary device is called (check the wifi-device section above!)
    option mode 'ap'
    option network 'for_guests'
    option ssid 'here is some free internet'
    option encryption 'none'    # or put some encryption on it, too, whatever...
{% endhighlight %}

Next, let's add give our interface a DHCP pool of its own, so it can automatically assign IPs to devices when they connect.  In `/etc/config/dhcp`, add:

{% highlight text %}
config dhcp 'for_guests'
    option interface 'for_guests'
    option start '100'
    option limit '150'
    option leasetime '1h'    # or longer if you want? IDK && IDC lol!
{% endhighlight %}

OK, now we do the important part: we set up our firewall to properly jail devices on our public network, restricting them to only what we want them to be allowed to do.  Edit `/etc/config/firewall` accordingly:

1. Setup the "zone" with its basic iptable rules:

{% highlight text %}
config zone
    option name for_guests
    option network 'for_guests'
    option forward REJECT
    option input REJECT
    option output ACCEPT
{% endhighlight %}

2. Link the interface to the router's network

{% highlight text %}
config forwarding
    option src for_guests
    option dest wan
{% endhighlight %}

This is the basic setup!  Now let's add specific rules to guide what connected users can and cannot do.  

3. Now let's set a rule that allows users to get a DHCP lease:

{% highlight text %}
config rule
    option name 'Guest DHCP Requests'
    option src 'for_guests'
    option src_port '67-68'
    option dest_port '67-68'
    option proto 'udp'
    option target 'ACCEPT'
{% endhighlight %}

4. Next, set a rule to allow connected clients to make DNS queries:

{% highlight text %}
config rule                           
        option name 'Guest DNS Queries'
        option src 'for_guests'
        option dest_port '53'
        option proto 'tcpudp'
        option target 'ACCEPT'
{% endhighlight %}