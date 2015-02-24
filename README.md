# kingkong

## installation

```sh
$ npm install
```

Run local server
```sh
$ npm start
```

Tests and minifies current javascripts and generate yuidocs
```sh
$ grunt build
```

Initiate Vagrant box for sharing
```sh
$ vagrant up
```

## gruntTasks

    default      : runs tests and jsLint
    test         : runs tests and jsLint
    build        : runs tests, jsLint, creates minified js (with current version number), documentation and creates a development index.html
	build:prod   : same as grunt build, but produces an index.html which loads the minified js (production ready).
	patch        : same as grunt build, also bumps patch version number by 1.
	patch:prod   : same as grunt patch, also produces production ready index.html
	feature      : same as grunt build, also bumps minor version number by 1.
	feature:prod : same as grunt feature, also produces production ready index.html
	release      : same as grunt build, also bumps release version number 1.
	release:prod : same as grunt release, also produces production ready index.html

	#support tasks:

	texture      : take a texture-packer json file from src/texturepacker/ and generate animation data, and copy to public/assets/sprites along with spritesheet png
	doc, docs    : generate yuidoc based on current public/javascripts/app
	add          : add a new class in public/javascripts/app with autogenerated createjs style Module.Class structure. Supports inheritance, follow prompts for details.



## Current bugs / features working on:

v.0.2.3
-------

- Moved ServerInterface to Game
- Implement celebration Fireworks
