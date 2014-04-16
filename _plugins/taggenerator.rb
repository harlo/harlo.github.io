module Jekyll

	class TagIndex < Page
		def initialize(site, base, dir, tag)
			@site = site
			@base = base
			@dir = dir
			@name = 'index.html'
			
			self.process(@name)
			self.read_yaml(File.join(base, '_layouts'), 'tags_index.html')
			self.data['tag'] = tag		
			self.data['title'] = "Tag: &lsquo;#{tag}&rdquo;"
		end
	end
	
	class TagGenerator < Generator
		safe true
		
		def generate(site)
			if site.layouts.key? 'tags_index'
				dir = site.config['tag_dir']
				site.posts.each do |post|
					post.tags.each do |tag|
						write_tag_index(site, File.join(dir, tag), tag)
					end
				end
			end
		end
		
		def write_tag_index(site, dir, tag)
			index = TagIndex.new(site, site.source, dir, tag)
			index.render(site.layouts, site.site_payload)
			index.write(site.dest)
		end
	end
end