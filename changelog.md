## Changelog

####v0.4.0
- spin evaluation got smarter, win anims should show for all gaffes including 3x3 and 3x4 anims (nb. some animations are missing due to incorrect texture-packer labelling)
- using combined spritesheets which have 3x5 big win animations with smaller win animation

####v0.3.3
- new spin evaluation and tests for symbol wins
- refactoring of CommandQueue queue
- simplified gameComponents wiring in Game.. now game components wire themselves

####v0.3.2
- spin evaluation now detects big win
- initial win anims introduced based on new node system
- preloading new assets
- jpg sprite sheet
- parse url params for testing
- refactor of core components
- all gaffes added to menu
- client side gaffeing
- client side m1 reintroduced
- custom command
- replacements implemented
- fixed linting, cleaned Gruntfile
- reels changed to reflect new cut size, server tests introduced
- reels can now be displayed in node in an ascii table)
- supports.json file added (describes device groups and supported features)
- client-side m1 gaffe updated
- new symbol data based on original symbol.txt used in setup.json
- currency add
- reset createjs.Ticker timing mode to default, it's better in ios safari
- fixed 1fps prob
- texture command change, all keys forced to lower case to avoid problem with mixed case filenames in symbols

####v0.3.1
- initial gaffes added to gaffe menu
- reel strip animations refactored to support node requests, and custom cut length symbols
- new class: CustomCommand (to make fake Win Animations easier)
- before lotsofWin (for symbolAnimation comparison)
- node: stops added to json
- node: all gaffes added to api
- node: proper reel strip data from shadow of the panther used
- node: mocha introduced (allows server side tests)

####v.0.3.0
- docs expanded (homepage and clearer core classes clearer)
- Basic Node server implemented to respond slotInit and spinResponse jsons via REST api
- Symbol Win Spritesheet missing win anims inserted.
- preloader refactor + tests
- easel-packer now populates speed, endFrame, and the short + resume animations
- new assets
- new symbol export
- audio
- change css
- fixed layout on preloader

####v.0.2.3
- Moved Game Setup into Game.js
- Implemented celebration Fireworks
- Implemented Failsafe Loading (longer initialisation for more reliable anim loading)
- spritesheets for caching paylines implemented
- Added Tests and Docs Links to Gaffe Menu
- Added MeterComponent consisting of balance/win rollups
- new class: DJ
- timerMode RAF sync implemented
- desktopView
- fixed landscape 404
- devicejs introduced: device detection script
- Game function refactoring
- migrated ticker and other game specific things to Game
- new vagrantfile

####v0.2.2
- Introduced Proton particle animation system
- imagediff introduced and symbol bitmaps test implemented
- vagrant bootstrap
- version injection
- fixed CommandQueue loop

####v0.2.1
- gaffe line 1 implemented
- css overlay
- corrections to pay line drawing and pre-init rendering
- implemented cheaper winline shadows (better on mobile)
-

####v0.2.0
- scaling introduced
- reels can now modify symbols dynamically
- reel spin dev mode introduced
- lua code added to src
- gaffe menu and normal win implemented
- lots grunt tasks added to support development

####v0.1.0
- removed jquery
- flush command queue when spinning
- bower dependency management introduced
- package structure introduced
- Symbol Win Animations introduced
- yuidocs introduced

####v0.0.6-v0.0.2
- vendor cleanup
- removed js-signals (duplicate dependency)
- GameComponent super class introduced
- js-hint fixes
- WinLines introduced
- Spin Animation features stop where you want
- CommandQueue implemented
- 90% core classes test coverage
- Preloader
- gas pedal infinite spin demo
- initial spritesheet sources
- texture packer data grunt helper
- new class structure

###v0.0.1
- first commit
- node app skeleton initial commit
- linting, concat, uglifying setup