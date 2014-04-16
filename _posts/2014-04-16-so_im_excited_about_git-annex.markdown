---
layout: post
title:  "So, I'm excited about git-annex"
date:   2014-04-16 08:52:17
categories: git-annex how-to
---

If you work in an organization like a newsroom, it might seem the world runs on Dropbox.  Which is kind of a shame for a few reasons:

1. $$$
2. um, why do I have to query a remote server if I want to share a document with someone sitting right next to me?
3. You know they are very aware of the content you store!
4. Terms of Service.

So, what are my options if I want to have locally-hosted synced storage?  There are a few notable options, like [BitTorrent Sync][bts_link], but those aren't open enough (*~cough~* at all).  (Open Source is important.  Anyone reading this knows why...)  There's also [Sparkleshare][spkl_link], which my employer, the "hacker ethos with a 1099" called [The Guardian Project][gp_link], uses with the help of Tor's hidden services.  Sparkleshare is really great, and I highly recommend it, but I wanted something that was less of a service than a framework: Sparkleshare doesn't have much room for developers to build on top of it.

Then, I found out about [git-annex][ga_link].  It's a simple piece of software that automatically syncs files across multiple repositories using git.  It's that simple: you add a file, and it's immediately checked into your repository, and pushed to any remotes.  On the receiving end, remotes automatically pull and apply any changes.  Very simple.

My gears started turning, and I thought, what if we just tried using git like we use Dropbox?  So, I did a proof of concept using two machines: my own laptop as client, and a linux box somewhere else on my network as server.  My example server is in python and includes a very lightweight REST API, but you could modify this to suite whatever langauges you want, or even handle the whole thing in bash.

So, without further ado, here's how to make a Dropbox clone using git-annex.

### Step 1: set up your server

1. install dependencies.

We're going to need requests and tornado packages to handle the REST API.
  
{% highlight bash %}
pip install --upgrade requests tornado
{% endhighlight %}
  
You'll notice I have you download git-annex as a pre-built tarball. Although you could totally just apt-get install git-annex, through trial-and-error, I found this to the the most efficient.  Substitute the url for the one that matches your architecture.

{% highlight bash %}
wget -O git-annex.tar.gz http://downloads.kitenet.net/git-annex/linux/current/git-annex-standalone-amd64.tar.gz
tar -xvzf git-annex.tar.gz

THIS_DIR=`pwd`
echo export PATH=$PATH:$THIS_DIR/git-annex.linux >> ~/.bashrc
source ~/.bashrc

{% endhighlight %}

2. add git-annex's path to your PATH in environment variables  (usually at /etc/environment)

3. init our git-annex remote repository

Now with everything is installed, let's init our annex.

{% highlight bash %}
mkdir ersatz_dropbox
cd ersatz_dropbox

git init
echo curl -X GET "http://localhost:8888/sync/" >> .git/hooks/post-receive
chmod +x .git/hooks/post-receive

git-annex init "ersatz_dropbox"
git-annex untrust web
git checkout -b master
{% endhighlight %}

4. make a little tornado server to handle git hooks.

Git hooks are bash scripts that execute whenever a certain event goes off.  With git-annex, whenever a file is added to our remote repository on the server, git's post-receive hook fires.  So, let's use that to automatically sync the files: pulling them and their metadata into our remote.  This is a sample script in python called __api.py__

{% highlight python %}
import re, os, signal
import tornado.ioloop, tornado.web, tornado.httpserver
from subprocess import Popen, PIPE
from sys import exit

signal.signal(signal.SIGINT, terminationHandler)

ANNEX_DIR = "/path/to/your/remote/repository"
API_PORT = 8888
NUM_PROCESSES = 10

def terminationHandler(signal, frame): 
	"""
		this is just so you don't get errors/exception cruft when you ctrl-c the server :)
	"""
	exit(0)

class Api(tornado.web.Application):
	def __init__(self):
		print "API started..."
		
		self.routes = [(r"/", self.MainHandler),(r"/sync/", self.SyncHandler)]
	
	def startup(self):
		tornado.web.Application.__init__(self, self.routes)
		
		server = tornado.httpserver.HTTPServer(self)
		server.bind(API_PORT)
		server.start(NUM_PROCESSES)
		
		tornado.ioloop.IOLoop.instance().start()
	
	def syncAnnex(self):
		create_rx = r'\s*create mode (?:\d+) (?:(?!\.data/.*))([a-zA-Z0-9_\-\./]+)'
		cmd = ['git', 'annex', 'sync']
		
		old_dir = os.getcwd()
		os.chdir(ANNEX_DIR)
		
		p = Popen(cmd, stdout=PIPE, close_fds=True)
		data = p.stdout.readline()
		
		new_files = []

		while data:
			print data.strip()
			create = re.findall(create_rx, data.strip())
			if len(create) == 1:
				print "INIT NEW FILE: %s" % create[0]
				new_files.append(create[0])
				
				'''
					OMG! WHAT SHOULD WE DO NOW THAT WE HAVE A NEW FILE?
				'''
				
			data = p.stdout.readline()
		p.stdout.close()
		
		os.chdir(old_dir)
		return new_files
	
	class SyncHandler(tornado.web.RequestHandler):
		@tornado.web.asynchronous
		def get(self):
			result = "HI!  Welcome to your ersatz dropbox!\n"
			result += ("synced files:\n%s" % self.application.syncAnnex())
			self.finish(result)
	
	class MainHandler(tornado.web.RequestHandler):
		@tornado.web.asynchronous
		def get(self):
			self.finish("HI!  Welcome to your ersatz dropbox!")
	
if __name__ == "__main__":	
	api = Api()
	api.startup()

{% endhighlight %}

5. test it!

Run api.py and open [localhost:8888/sync/][your_api].  You should see something like this:

(commit ok)

... which means that everything's working, but since there are no new files, there's nothing else to do.

### Step 2: set up your client

1. install dependencies

Revisit the first step for setting up the server.  You should download git-annex on the client machine and set its path in your bash profile.

2. create your ssh key for your annex and link it up to establish trust.  you will be promped for a password: make it a good one.  Please substitute REMOTE_HOST and REMOTE_USER for whatever makes sense for you.

{% highlight bash %}
# what's the host IP and username?
REMOTE_HOST=192.168.1.101
REMOTE_USER=remote_user

REMOTE_PATH=/home/your_computer/ersatz_dropbox
LOCAL_PATH=/home/my_computer/ersatz_dropbox

ssh-keygen -f ~/.ssh/ersatz_dropbox.key -t rsa -b 4096
scp ~/.ssh/ersatz_dropbox.key.pub $REMOTE_USER@$REMOTE_HOST:/home/$REMOTE_USER/.ssh/authorized_keys
ssh -t -i ~/.ssh/ersatz_dropbox.key $REMOTE_USER@$REMOTE_HOST -v <<EOF
echo "AYO TECHNOLOGY!" > /dev/null 2>&1
EOF

echo "HOST $REMOTE_HOST" >> ~/.ssh/config
echo "	IdentityFile ~/.ssh/ersatz_dropbox.key" >> ~/.ssh/config

{% endhighlight %}

3. init your local repository

Choose a place for your local repository folder.  This folder should not exist already!  So, /home/my/computer/ersatz_dropbox must not exist aready (but /home/my/computer/ should...)

{% highlight bash %}
git clone ssh://$REMOTE_USER@$REMOTE_HOST$REMOTE_PATH $LOCAL_PATH
cd $LOCAL_PATH
git-annex init "ersatz_dropbox"
git-annex untrust web
git remote add ersatz_dropbox ssh://$REMOTE_USER@$REMOTE_HOST$REMOTE_PATH

{% endhighlight %}

### Step 3. test it out!

You saw the server in action at the end of step one, but now, try dropping a file into your local ersatz dropbox folder.  If all goes well, you should see something like this:

(commit ok)

So, there you have it: the first step towards a free, easy, open source dropbox clone.  Next steps naturally include:

1. sharing files to other users not synced to your repo
2. having web access to said files

I've done plenty of work of that, too, and stay tuned for the next post!

[bts_link]: http://www.bittorrent.com/sync
[spkl_link]: http://sparkleshare.org
[gp_link]: https://guardianproject.info
[ga_link]: https://git-annex.branchable.com
[your_api]: http://localhost:8888/sync/