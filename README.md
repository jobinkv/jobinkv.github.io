A Github Pages template for academic websites. This was forked (then detached) by [Stuart Geiger](https://github.com/staeiou) from the [Minimal Mistakes Jekyll Theme](https://mmistakes.github.io/minimal-mistakes/), which is © 2016 Michael Rose and released under the MIT License. See LICENSE.md.

I think I've got things running smoothly and fixed some major bugs, but feel free to file issues or make pull requests if you want to improve the generic template / theme.

### Note: if you are using this repo and now get a notification about a security vulnerability, delete the Gemfile.lock file. 

# Instructions

1. Register a GitHub account if you don't have one and confirm your e-mail (required!)
1. Fork [this repository](https://github.com/academicpages/academicpages.github.io) by clicking the "fork" button in the top right. 
1. Go to the repository's settings (rightmost item in the tabs that start with "Code", should be below "Unwatch"). Rename the repository "[your GitHub username].github.io", which will also be your website's URL.
1. Set site-wide configuration and create content & metadata (see below -- also see [this set of diffs](http://archive.is/3TPas) showing what files were changed to set up [an example site](https://getorg-testacct.github.io) for a user with the username "getorg-testacct")
1. Upload any files (like PDFs, .zip files, etc.) to the files/ directory. They will appear at https://[your GitHub username].github.io/files/example.pdf.  
1. Check status by going to the repository settings, in the "GitHub pages" section
1. (Optional) Use the Jupyter notebooks or python scripts in the `markdown_generator` folder to generate markdown files for publications and talks from a TSV file.

See more info at https://academicpages.github.io/

## To run locally on macOS

The local site uses Ruby 3.3 and Bundler 2.4.19, as specified by this repository's dependencies. Ruby 4 may remain installed for other tools, but use Ruby 3.3 for this site.

1. Install [Homebrew](https://brew.sh/) if it is not already installed.
1. Install Ruby 3.3:

	```sh
	brew install ruby@3.3
	```

1. Add Homebrew Ruby 3.3 to the front of your `PATH`. This command adds it to future zsh login shells and activates it in the current terminal:

	```sh
	echo 'export PATH="$(brew --prefix ruby@3.3)/bin:$(brew --prefix)/bin:$PATH"' >> ~/.zprofile
	source ~/.zprofile
	ruby -v
	```

	Confirm the version starts with `3.3`.
1. Install the Bundler version recorded in `Gemfile.lock`:

	```sh
	gem install bundler -v 2.4.19
	```

1. From the repository directory, install the Ruby dependencies and start Jekyll:

	```sh
	bundle install
	bundle exec jekyll serve --livereload

    PATH="/opt/homebrew/opt/ruby@3.3/bin:/opt/homebrew/lib/ruby/gems/3.3.0/bin:/opt/homebrew/bin:$PATH" bundle exec jekyll build --config _config.yml,_config.dev.yml
	```

1. Open <http://localhost:4000>. Jekyll rebuilds the site when files change. Press `Ctrl+C` in the terminal to stop the server.

Node.js is not required to serve the site. It is only needed for the optional JavaScript build scripts. Keep `Gemfile.lock`; it pins the dependency versions used by the site.

# Changelog -- bugfixes and enhancements

There is one logistical issue with a ready-to-fork template theme like academic pages that makes it a little tricky to get bug fixes and updates to the core theme. If you fork this repository, customize it, then pull again, you'll probably get merge conflicts. If you want to save your various .yml configuration files and markdown files, you can delete the repository and fork it again. Or you can manually patch. 

To support this, all changes to the underlying code appear as a closed issue with the tag 'code change' -- get the list [here](https://github.com/academicpages/academicpages.github.io/issues?q=is%3Aclosed%20is%3Aissue%20label%3A%22code%20change%22%20). Each issue thread includes a comment linking to the single commit or a diff across multiple commits, so those with forked repositories can easily identify what they need to patch.
