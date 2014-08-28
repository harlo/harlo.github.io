---
layout: post
title: "The Hotel Safe"
date: 2014-08-27 13:44:53
tags: how-to veronica-mars-would-dig-this lol-tradecraft symmetric-encryption gpg
---


 ## But first, a very long (and skippable) rant about my failures

"Those who can't do, teach."  Although, I really dislike that addage, and would never think that being one would preclude anyone from being the other, I'm starting to learn that it's ridiculously difficult to do both.  And the more things you do, the less time you have available to responably and thoroughly respond to people out there who need help doing the things that we've been doing.  I've had somewhat-longform correspondence with several people I've met after conferences and hackathons who live real lives, and face real threats to their safety.  Some of these people have been burned badly in online dogfights, some of my contacts live in countries that are slowly turning more draconian before their very eyes.  All of these people need concrete help to solve concrete everyday problems.

So, yeah, I don't have all of these answers.  And the answers I do have require a lot more than just "Oh, right, just use SecureBlip* instead of Facebook and problem's all solved!"  Some answers require an entirely new workflow, or way of living, in order to maintain a level of security that works for you.  And all of you are different.

I'm busy, and I'm a private person.  I'm not a huge fan of Facebook (despite being one of its original users) and I don't like to chat at all.  Which is ironic, because of Guardian Project's work on chat-based security.  Nathan "gently scolded" me a week ago for not using one of our flagship products, ChatSecure but I'm like "didn't your momma tell you you can't change somebody".  I hide from everyone on Hangout-- you will only find me online for the brief moment every two days when my "snooze notifications" expires.  So you really won't see me chatting with you for hours giving you tutorials about how to do stuff.  But, please don't take that as an insult or indication that I don't care-- I do want to help.  I'm just a lot stronger on the "doing" side of things than the "teaching" side of things.  But that said, I'm reaffirming my commitment to the "teaching" part of this gig but sharing new tips and tricks as I come by them...

## What this post is really about: The Hotel Safe

Ok, that was a very roundabout way of getting to the meat of this post:  Another trick you can try, if you like, to take control of your digital security.  I present to you: [The Hotel Safe][hotel_safe]!

Here's my scenario:

My computer was getting old and kludgy, so I wanted a new one.  Instead of doing the whole "apple-store-or-amazon-dot-com" thing, I... just... went... outside.  I walked about 2 miles out, and came across one of those small computer stores that practically litter our city.  I bought a thinkpad from the dude who works there.  And that was it.

So, I configure my environment (goodbye windows*! hello ubuntu!) and I start thinking about how I'm going to do PGP key management.  I decide that I don't actually want to keep my keys on the computer's hard drive, and that I would sequester my GPG keyring to some sort of removable media, that way I can pop it out of my machine whenever, and worry less about such important assets being out of my control.  How do you do that? Hmmmm....

### 1. Create a brand new keyring

GPG takes the `homedir` parameter, so you could use separate keyrings for separate uses.  I chose to import my private keys and those of my contacts by hand (because I had some pruning to do on my old keyring on my old computer.)  So, for instance, to add a key:

`gpg --homedir /path/to/your/keyring/.gnupg -import-key SOMEKEY.asc`

### 2. Make an alias for GPG

Ultimately, you'll want to preface every gpg command with the homedir directive.  Make an alias in your .bash_aliases file that does just that.  Mine looks like:

`alias jeepy-g="gpg --homedir /path/to/my/keyring/.gnupg"`

This means, when I want to use my secret keyring instead of "regular" GPG, I invoke `jeepy-g -encrypt filename.txt`.

### 3. Let Thunderbird know about that

Seamlessly integrate your keyring into Thunderbird by fiddling with the Enigmail preferences.  In Enigmail->Preferences->Basic, enable "Display Expert Settings and Menus".  You should now see the "Advanced" tab, which has the directive "Additional parameters for GnuPG."  That's where you add

`--homedir /path/to/your/keyring/.gnupg`

Click OK, duh.

### 4. Want extra credit?  Try The Hotel Safe

DISCLAIMER: you could be using [MiniLock][nk_ml] instead, and it's definitely a lot better than this thing I hacked together in one afternoon.  Backup your stuff if you're worried about losing it forever!  (Yeah, it's ok to backup your GPG keys on a removable, physical medium and stash it somewhere like at the bottom of a coffee can in your kitchen pantry, not like that's where my backups are but, just sayin'...)

You know what I love about hotel safes?  They're so simple.  You know how it goes: you put something in the box, and when you close it, you give it a 4-digit pin of your choosing to lock the door.  When you want to open it, you give it that same 4-digit pin.  If you forget the pin, tough noogies, but it's not like a password which tends to be permanent and personal.  This is simply non-committal, and you can switch your pin with every successful use if you wanted.

The hotel safe is basically symmetric encryption.  So I set out to make the same thing for my files.  Since I travel a lot, I wanted a way to lock away bits of sensitive info temporarily, so if I'm ever detained, or much more likely, if I loose that little USB nubbin with my keys on it, I can deny the existence of such keys.  Before heading out to Argentina yesterday, I used my little hotel safe hack to encrypt my keyring (and a few other things, too), removed my USB nubbin, and tucked it away in my bag.

And yes, of course, I recommend using a much better passphrase than a 4-digit pin.  Nadim's MiniLock requires you to have a 45-character minimum passphrase, and that's always a good idea!  There's an XKCD cartoon out there with a great mind-hack for generating good, memorable, yet secure passphrases.

The Hotel Safe is, once again, the product of a lazy Saturday afternoon.  It works well for me, and I'd like to add a few more features (i.e. encrypting certain assets that contain a bit of metadata) but I'm not going to go very much further with it.  Have at it, and let me know what you think!

* SecureBlip doesn't exist yet.  Or maybe it does.  IDGAF.

* Don't get me wrong, like most people on earth, I used to know my way around a windows machine.  But I had never used Windows 8 before and I thought I was having a STROKE because what the hell were you guys thinking over there when you designed Windows 8?

[nk_ml]: https://github.com/kaepora/miniLock
[hotel_safe]: https://github.com/harlo/hotel_safe