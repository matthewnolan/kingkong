#PIXI.js

Pros:

    Bleeding edge filter / animation effects
    Easy API
    Canvas2D and WebGL support
    Spritesheet support

Cons:

    Breaking changes are common in updates
    We'd require another 3rd party Tweening library (eg. Greensock TweenLite)


#Createjs

Pros:

    Fully unit tested framework
    More features we require are already built into framework (including Tweenjs)
    Updates don't tend to introduce breaking changes
    Uses similar API to Flash, making it easier for Flash Devs to maintain
    Canvas2D and WebGL support
    Supports surfaces other than Canvas, making it more portable
    Spritesheet support
    Provides it's own methods which let us Extend Classes in our own code - a feature we've used in king kong and godzilla

Cons:

    Filter and Vector drawing is costly, requires predrawing to be effective on mobile devices (Not sure how this compares to PIXI)

#Other options

    Zebkit: http://www.zebkit.com/ - not used
    Canvas Engine http://canvasengine.net/ - not used
    Phaser.js http://phaser.io - A fully fledged game framework which uses PIXI.js for rendering












