#Framework Issues risks & benefits
--------------------------------------


##Purpose:

To document some of the issues we've been having with our current Canvas abstraction layer: EaselJS, part of our current framework: CreateJS.
And to outline some pros and cons of replacing the framework with something else.


##Terms:

Vendor: A 3rd Party Framework or Tool we rely on.
Framework: A collection of libraries designed to fulfill multiple tasks, usually with a focus on one particular area of sofware development.  eg A Game framework.
Tool: A single tool with a specific purpose.  Might consist of multiple JS files.


##Vendor usage:

Our build process concatenates and minifies the entire application + frameworks & libraries (vendor files) to 1 file which
currently loads in at 521KB as of version 0.3.4.

##Frameworks

Framework: CreateJS

Tools:
    - EaselJS
        - Mainly A canvas rendering abstraction layer
        - Based on the Flash display API
        - Modules (Class based inheritance pattern)
    - PreloadJS
        - Multiple asset preloading tool
    - SoundJS
        - A cross device helper for playing sounds in HTML5)
    - TweenJS
        - A Tweening library
        - We use for animating reel strip positions during spin animation and other simple animations like credit rollups
    - Missing:
        - Does not include a particle framework (we use a 3rd party one called Proton)
        - Device detection, we use devicejs but currently only for detecting between mobile * desktop



Framework: PhaserJS

Tools:
    - Rendering: Currently PixiJS
    - Particles: Includes a very optimised particle animation framework (likely to be faster than Proton because Proton is a 1 guy project)
    - Loading: Includes an asset loader
    - Tweening: Includes a Tweening library which is good enough for us.
    - Device Detection: Includes a device library for detecting devices and supported features of the device.
    - Misisng:
        - A module pattern so we'd need to plugin in Browserify / RequireJS / ClassJS or similar



Framework: None
* We pick new tools for specific tasks previously handled by our framework

Tools:
    - PixiJS:
        - A canvas rendering abstration layer
        - also based on the Flash API
        - Has focused on delivering the best rendering speed, therefore is faster than EaselJS
    - Example Tool replacements:
        - Particles: Our existing particle system (Proton) works with easelJS or PixiJS so we can keep
        - Preloading: We'd need to look at what's available and choose, or keep using PreloadJS.
        - Modules: ClassJS for Class based inheritance or continue to use EaselJS's module pattern.
        - Tweening: we could continue to use TweenJS or Greensock (Greensock is faster)
        - Sounds: We could continue to use SoundJS or pick something else.



Current Issues
--------------

    * Createjs seems to have variable performance between devices / browsers and OS's.

    * As support requirements are unclear at the momement it's very difficult to focus on testing this thoroughly.  For example, IPhone 6 (mobile Safari) drops to 5FPS during a
    big win animation and sometimes during a normal spin.
    although IPhone 5S (mobile safari) runs the application minimum 40FPS during big win and reaches maximum 55+ FPS during spins.

    * WEBGL is not utilised by default with EaselJS.  The latest mobile phones (IOS 8+) and Android phones from earlier make WEBGL available to developers.
    so we should use it if it's available.  CreateJS makes it difficult to implement this, because important features which we rely on (eg masking) are switched off if we
    use easelJS + WebGL.  Porting to make WEBGL available in the current code will also take time: something like 3-4 days, and comes with its own risks. (eg an alternative to
    masking must be found).

    * All the code is based on the module pattern, EaselJS has a nice implementation of the module pattern, which supports classical class based inheritance.
    This is an advantage because any developer who has used Actionscript 3 or JAVA would be very comfortable using the code.  Createjs is not the only implementation
    of the class based inheritance module pattern, but since we were using the Framework, I implemented this pattern in a game.
     But this has now produced a major flaw in our strategy: that if we port away from CreateJS, we would either lose the pattern our modules are based on, (we'd need to replace it with something
     else, there are many and most are lightweight, eg. ClassJS).. OR we would have to keep the EaselJS library inside our code, even though we wouldn't be using its most
     important feature: the rendering abstraction!

    * CreateJS is not updated regularly... When I joined the project, CreateJS had just received a major upgrade (to v0.8.0) which suggested the project was being
     supported well, and many of the performance issues which seem to exist in the framework were being worked on.  However, since 2 months, the project hasn't had a single
     feature release.. it is still 0.8.0 and it's not very clear if the performance issues are being worked on, or how quickly they might be fixed.

    * We are overloading device memory with assets at the moment, we're trying to squeeze too many assets from the desktop version into a mobile device which doesn't have
     as much ram as most desktop computers.  This goes for graphics (especially the fullscreen animations) and sounds.  But the sounds are actually tipping older devices
     over the memory allocation.

    * When running inside a Webview enabled native application on iphone5s, the application delivers a memory warning and sounds do not play at all.

    * Createjs Timingmodes... Createjs has a ticker based rendering (redrawing) cycle.  There are 3 of these, and the best performance of each seems to vary
     between devices.  The good news is we've just noticed the big win animation improves from about 5-10fps to 40+ fps on iphone5 by switching from the default (TIMEOUT) based
     timing method, to the Request Animation Frame (RAF) based timing method.  The bad news is we will need to test which browsers/os's/devices perform better on which timeiout method
     and implement a switch in the code which will set the correct method on the device.  This is a nightmare, even if we knew what devices to support and had
     all those devices... And we don't.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------

#OPTIONS:
--------

##OPTION 1:

Remain with current Framework

##OPTION 2:

Port the code to a new Game framework: PhaserJS and replace the other tools of CreateJS with other 3rd party tools.

##OPTINON 3:

Introduce a new rendering abstraction layer: PixiJS, and replace the other tools of CreateJS with other 3rd party tools.

----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------
----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------


Risks of a new Engine
------------------------------
    * Pixi is currently v2.2 and is focusing on a v3  Although it's safe to assume that when v3 hits, it will
      be better and faster.

    * Phaser is currently v2.3 and is working on a v3, and has discussed its plan to drop PixiJS from its framework, and work on their own canvas renderer.  This
      is because PixiJS updates would tend to introduce breaking changes which Phaser would need to take account of in their own framework, but Pixi didint'
      document all of these when releasing so, it hurt Phaser to a degree.

     That said, picking the latest stable v2.2 Pixi or the latest stable v2.3 Phaser should be safe enough for our project, which just needs to render things fast.

    * Introducing something new which requires some re-writing of the code is always risky, it is time consuming and and previously tested features of the application
    must be tested again.



Benefits of a new Engine:
-------------------------
    * We should see much greater performance of the application working on more devices
    * We get better support from developers involved in the creation of these engines
    * A simple test which generates the big win animation and smaller win animations in sequence is in progess, but should confirm the speed increase.
    * We're at a position in development where porting could take as little as 1 week (A bit optimisitic, but doable).. but the more we implement in the old
     framework, the longer it will take to port to a new.
    * PixiJS is being improved constantly, it understands that the main thing developers want from a rendering engine in games, is speed, and it
    focuses primarily on it, and does it better than any other rendering library there is right now.
    * Phaser and Pixi Will use WebGL when available, with no modifications to the code other than to specify to use WebGl when available.
    * PhaserJS has used PixiJS for its rendering layer since the project started a few years ago.  It picked PIXI for the reasons given above.


Conclusion:
-----------
Personally I'd recommend we port frameworks to Phaser for the reasons outlined above.  CreateJS seemed like a safe framework to use at the start of the
project, since it is unit tested, and provided a lot of features which we use.  But during development the performance issues seen on different devices
leads me to believe that we're going to have an extremely difficult task ahead trying to make this app support the number of devices it will need to.
Particularly on the most popular mid-range device group.  However if we're happy with the current performance of the app, then there's no need to switch.
The next version (v0.3.5) should improve performance as we're switching from Timeout to RAF timing methods and seen a lot of improvement on our own mobile devices.

Please note that if we want to utilise WEBGL, then we require a large part of the code to be re-written anyway. And because easelJS's support
for WebGl is so limited, this comes with it's own risks and time cost.





























