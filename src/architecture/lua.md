##############################################################################################################################################SPIN/TUMBLE
TAG SPINNER
	SPEED:1	#Spinner speed, value 1 means passing by 17 symbols per second during spinning
	START_BOUNCE:TRUE	#"TRUE" means buck up and down the reel when spin starts 
	DURATION:2.5	# Duration of the spinning presentation, in seconds
	TAG DIRECTION	# Spin direction for each reel. most spin down. 99%. 
		REEL1:Down
		REEL2:Down
		REEL3:Down
		REEL4:Down
		REEL5:Down
		REEL6:Down
	END
	TAG START_DELAY	# Reels start to spin sequentially with delay(in seconds) on each reel
		REEL1:0
		REEL2:-0.2
		REEL3:-0.4
		REEL4:-0.6
		REEL5:-0.8
		REEL6:-1.0
	END
	TAG STOP_DELAY_COUNT	# Additional stop delays by symbol count. most have a stop delay. 
		REEL1:0
		REEL2:-0.2
		REEL3:-0.4
		REEL4:-0.6
		REEL5:-0.8
		REEL6:-1.0
	END
	TAG ANTICIPATION
	// when th user is ABOUT to win on the last reel, we slow the speed of the last reel.
	// come back to this.
		TAG SYMBOL
			TYPE:SYMBOL # Anticipation based on Symbol count or reels
			THRESHOLD:2	# Minimum number of bonus symbols to trigger anticipation
			THRESHOLD_OFFSET:1	# threshold + threshold_offset = minimum of bonus symbols to trigger bonus
			SPEED:0.3333333	# Anticipated spinning speed, 1 means going through 17 symbols per seconds
			SYMBOL_BY_REEL:01110	# Max possible bonus symbols appear on each reel
		END
		TAG STACK
			STAGE:BONUS	# I dont think this is being used
		END
		TAG SMART_MOVIE
			INTRO:SmartIntro	# intro smart animation ID
			LOOP:SmartLoop	# loop smart animation ID
			WAIT_FOR_ANIMATIONS:TRUE	# "TRUE" means do not cut off the last smart animation
			HIDE_STATICS:FALSE	# "TRUE" means hide symbol statics underneath smart animations
		END
	END

	BONUS_SPIN_DELAY:2	
	// In bonus, if there is no win, delay certain amount of time (in seconds) before next spin
	SPEED_BONUS_INCREMENT:0 # factor to increase bonus spin 
	// dont worry about this for now. 

	TAG INDEPENDENT_REELS
	// dont worry about this for now.
		TAG PROPERTIES
			ROWMAJOR:TRUE	#PT internal use. If this is true the indexing of independent reels goes from left to right and then down
		END
		TAG START_DELAY
			SEGMENT1:-0.09	#Additional delay added to the Start_Delay of Segment 1 of the corresponding reel
			SEGMENT2:-0.18	#Additional delay added to the Start_Delay of Segment 2 of the corresponding reel
			SEGMENT3:-0.27	#Additional delay added to the Start_Delay of Segment 3 of the corresponding reel
			SEGMENT4:-0.36	#Additional delay added to the Start_Delay of Segment 4 of the corresponding reel
			SEGMENT5:-0.45	#Additional delay added to the Start_Delay of Segment 5 of the corresponding reel
			SEGMENT6:-0.54	#Additional delay added to the Start_Delay of Segment 6 of the corresponding reel
		END
		TAG SMART_SOUNDS
			SYMBOL_BY_REEL:00100001000010000100	#Similar to other SYMBOL_BY_REEL. Indexing is determined by the ROWMAJOR property
		END
	END
END

TAG TUMBLER
	// just like spinning symbol. the direction
	TAG DIRECTION #Tumbling direction for each reel
		REEL1:Down
		REEL2:Down
		REEL3:Down
		REEL4:Down
		REEL5:Down
		REEL6:Down
	END
	TAG START_DELAY # Reels start to spin sequentially with delay(in seconds) on each reel
		REEL1:0
		REEL2:0.2
		REEL3:0.4
		REEL4:0.6
		REEL5:0.8
		REEL6:1.0
	END
	POST_SLAM_DELAY:1.0
	// we dont know
	GRAVITY:80	# Drop down acceleration
	BOUNCE_FACTOR:0.15
	SEGMENT_DELAY:0.1 # start delay between each symbol on the same reel 

	// i dont know. i dont work here. 
	TAG SMARTSOUND
		TAG SYMBOL
			INDEX:11
			THRESHOLD:2
			SPEED:1
			SYMBOL_BY_REEL:01110
			LINE_TRIGGERED:FALSE
		END
		INDEX:11
	END
	BONUS_SPIN_DELAY:2
END

#######################################################################################################     PRESENTATION SECTION
TAG PRESENTATION
	// comes from electro
	COIN_IN_TIMER:1 #PT internal use: set coin in duration to 1 second if coin-in animation is not available
	COIN_OUT_TIMER:2 #PT internal use: set coin out duration to 2 seconds if coin-in animation is not available

	// the initial symbols on load. comes from electro. 
	TAG INITIAL_STOP #Not being used right now because slot engine provide us initial stops
		TAG MAIN
			REEL1:0
			REEL2:0
			REEL3:0
			REEL4:0
			REEL5:0
			REEL6:0
		END
		TAG BONUS
			REEL1:0
			REEL2:0
			REEL3:0
			REEL4:0
			REEL5:0
			REEL6:0
		END
	END

	TAG BELL
		DRAW_SMART_LOOP:FALSE
		// draw the bonus win animation on the Bonus Win Animations
		HIDE_STATICS:FALSE
		// dont worry about 
	END
	TAG PRESHOW
		SHOW:TRUE #"TRUE" means show all winning payline(s) before wincycle
		ANIMATE:FALSE #"TRUE" means show all wincycle animation in preshow
		LENGTH:0.7 # Amount of time (in seconds) to show all winning paylines
	END
	TAG ANIMATE

		SHOW_UNDER_SUPERSTACK:FALSE	#"TRUE" means show symbol animations underneath superstack animation
		SHOW_STATIC_UNDER_SUPERSTACK:FALSE #"TRUE" means show symbol statics (aka poster image) underneath superstack animation
		HIDE_STATICS:TRUE # "TRUE" means hiding statics under symbol animations during animate state
		CROP_ANIMATION:TRUE	# "TRUE" means crop the same superstack to fit different box wins
		SKIP_AFTER_BELL:TRUE # "TRUE" means skip symbol animation after bell. This is used to avoid playing bonus symbol aniamtion twice then bonus is triggered
		FORCEQUIT_ANIMATE:FALSE	#TRUE" means force the game quit symbol animation and proceed after certain amount time
		FORCEQUIT_ANIMATE_TIMEOUT:3
		WILD_LIST_FOR_SOUND:0		#used to decide which symbols are to be treated as wild for sound play 
		SUPERSTACK_ANIMATION_CROP_OFFSET:FALSE # "TRUE" means that Superstack movie is drawn at crop and offset CROP_ANIMATION also need to be true for this to work
		SCALE_UNCROPPED_SUPERSTACK_ANIMATION:FALSE # "TRUE" means that Superstack movies which are not cropped are scaled using the dimensions of superstack movies.
	END
	
	TAG EXPLODE
		OVERSIZE:FALSE	
		// for tumbling.  "TRUE means all tumbling explode animations are double sized 
	END
	TAG PAYTABLE
	// dont worry
		REDRAW_BACKGROUND:FALSE
	END
	PAYLINE_SELECT_DURATION:10	
	// Amount of time(in seconds) to show all betting paylines if player changes bet options
	SUPERSTACK_ANIMATION:TRUE	# "TRUE" means draw superstack animation if there is a box win
	// 
	DOES_WILD_PAY:TRUE	# "TRUE" means pure wild win is possible
	// 
	SHOW_METER_IN_TRANSITION:FALSE # "TRUE" means meter panel is visible during transition
	SHOW_TRANSITION_ENVELOPE:TRUE # MOBILE only
	SHOW_METER_ABOVE_CELEBRATION:TRUE #"TRUE" means meter panel is visible during celebration
	FG_METER_ROLLUP_SNAP:TRUE	# "TRUE" means snap free games counter to target value, "FALSE" means roll up free games counter
	RETRIGGER_POPUP_DURATION:3 # The amount the time(in seconds) to show retrigger pop up
	PRE_ROLL_UP:FALSE # "TRUE" means roll up base win to credit meter before entering bonus game
	POST_ROLL_UP:FALSE	# Post roll up means: in bonus, all awards roll up to win meter only, and when bonus is finished and the game swap back to main, rolling up all bonus awards to both credit and win meters
	DIM_BY_REEL_FADE:FALSE	# "TRUE" means dim symbols by full size ReelFade.png, "FALSE" means dim symbols by symbol sized dim.png 
	MAX_ACTION_BANNER:TRUE	# "TRUE" means show max action banner when betting lines are less than max lines. IGT only
	TAG EASING_FUNCTION	# PT internal use: fade in/out curve
		TRANSITION_FADE_TEXT:timePointFade
		TRANSITION_FADE_IN_TEXT:inExpo
		TRANSITION_FADE_OUT_TEXT:outExpo
	END
	// important 
	TAG TRANSITION	# transition font string fade in/out time
		INTRO_FONT_FADEIN:1
		INTRO_FONT_FADEIN_DURATION:0.5
		INTRO_FONT_FADEOUT:3
		INTRO_FONT_FADEOUT_DURATION:0.5
		
		OUTRO_FONT_FADEIN:1
		OUTRO_FONT_FADEIN_DURATION:0.5
		OUTRO_FONT_FADEOUT:3
		OUTRO_FONT_FADEOUT_DURATION:0.5
	END
	SWAP_STAGE_INTRO_TIME:1.5	# PT internal use: swap stage timer
	SWAP_STAGE_OUTRO_TIME:1.5	# PT internal use: swap stage timer
	FREEGAMES_TRANSITION_CUSTOM_EVENT:2.5
	MATHSCREEN_TRANSITION_CUSTOM_EVENT:2.5
	INTRO_TRANSITION_CUSTOM_EVENT:2.5
	SHOW_FREE_GAMES_WIDGET:TRUE
	USE_OLD_DRAW_SYMBOL:FALSE
	TAG DEMO_MODE
		BONUS_WIN_METER:100
		BONUS_FS_METER:45		# Number of spins before "winning" more spins
		BONUS_FS_WIN:8          # Number of spins to be "won"
	END
	RETURN_FROM_BONUS_MOVIE:B1LoopNoText
END

################################################################################################################################### WINCYCLE SECTION
TAG WINCYCLE
	// important
	CYCLE_LENGTH:3 # The amount of time to show each line win during cycling
	// important
	FLASH_LENGTH:0.2	# If no wincycle animation exists, the symbols blink in 0.2 seconds interval
	CONTINUOUS_ANIMATION:FALSE	# Animate all winning symbols continuously during wincycle. "TRUE" for all tumbling games
	CONTINUOUS_BONUS_ANIMATION:FALSE 	# Animate bonus symbols at all times during wincycle.
	SHOW_PAYLINES:TRUE	# Show paylines during wincycle. Bally games do not have to show paylines
	SHOW_DIM:FALSE # "TRUE" means dim non-winning symbols on active paylines and all symbols on non-active paylines
	SHOW_WINBOX:TRUE # "TRUE" means draw win boxes around winning symbols on actived paylines
	HIDE_STATICS:TRUE	#"TRUE" means hide symbol statics under symbol animation
	ANIMATED_WINBOX:FALSE	# "TRUE" means animated win boxes, "FALSE" means static win boxes
	// like a sparkle around the winbox
	GROUP_PAYLINES:FALSE	# "TRUE" means show all winning paylines at the same time if they have the same winning segments.
	GROUP_SCATTERS:TRUE	
	GROUP_SCATTERS_BY_TYPE:FALSE
	FLASH_ROYALS_WITH_ASSET:ReelTexture # The asset name that used to flash the royals, "ReelTexture" or "Background"
	CELEBRATION_MOVIE:MobileCelebration	# MOBILE ONLY
	WINBOX_WIDTH:256	# win box image width
	WINBOX_HEIGHT:256	# win box image height
	USE_BG_IMAGE:FALSE	# whether or not to draw BG.tga
	USE_ANIMATE_MOVIE:FALSE #use animation loop to draw the wincycle movie
	FLASH_BELOW_BET:FALSE # "TRUE" means flash winning symbols in wincycle if win is less than cover bet
END

####################################################################################################################################### ROLLUP SECTION
TAG ROLLUP
	TYPE:IGT	# Roll up type: "IGT" or "H5G" 
	TAG H5G
		TAG Main
			NUM_ROLLUP:10	# Number of roll up levels in main
			ROLLUP_1:0.5	# roll up threshold (win/bet)
			ROLLUP_2:1
			ROLLUP_3:1.5
			ROLLUP_4:2
			ROLLUP_5:3
			ROLLUP_6:4
			ROLLUP_7:6
			ROLLUP_8:7.5
			ROLLUP_9:10
			TERM_BAKED_IN:TRUE	# "TRUE" means terminator is baked into the roll up sound
			TERM_OFFSET:5	# trail duration in seconds
			SYNC:FALSE	# "TRUE" means synrc with backgroudn music
		END
		TAG Bonus
			NUM_ROLLUP:2	#Number of roll up levels in bonus
			ROLLUP_1:10	# roll up threshold (win/bet)
			TERM_BAKED_IN:FALSE	# "TRUE" means terminator is baked into the roll up sound
			SYNC:TRUE	# "TRUE" means synrc with backgroudn music
		END
		TAG Feature
			NUM_ROLLUP:2	#Number of roll up levels in bonus
			ROLLUP_1:10	# roll up threshold (win/bet)
			TERM_BAKED_IN:FALSE	# "TRUE" means terminator is baked into the roll up sound
			SYNC:TRUE	# "TRUE" means synrc with backgroudn music
		END
		TAG CELEBRATION
			SPEED:0.74074	# celebration speed: win ratio/per seond
			CAP:44.44	# if win/bet is grater than 44.44, then recaculate the roll up speed to make to finish in one minute
		END
	END
	TAG IGT
		TAG Main
			NUM_ROLLUP:12
			ROLLUP_1:0.2
			ROLLUP_2:0.4
			ROLLUP_3:0.6
			ROLLUP_4:0.8
			ROLLUP_5:1
			ROLLUP_6:1.5
			ROLLUP_7:2
			ROLLUP_8:3
			ROLLUP_9:4
			ROLLUP_10:5
			ROLLUP_11:10
			TERM_BAKED_IN:FALSE
			SYNC:FALSE
			SLAM_ROLLUP_1:FALSE
		END
		TAG Bonus
			NUM_ROLLUP:2
			ROLLUP_1:10
			TERM_BAKED_IN:FALSE
			SYNC:FALSE
		END
		TAG SPEED
			NUM_SPEED:6
			LIMIT_1:0
			SPEED_1:40
			LIMIT_2:250
			SPEED_2:60
			LIMIT_3:500
			SPEED_3:80
			LIMIT_4:1000
			SPEED_4:160
			LIMIT_5:2000
			SPEED_5:320
			LIMIT_6:4000
			SPEED_6:640
		END
	END
END
################################################################################################################################### SOUNDS OPTIONS
TAG SOUND
	TAG SPIN_SOUND
		COUNTER:4	# Number of reel spin sounds
		// cause we randomize the sound 
		TRAIL:FALSE	# "TRUE" mean do not cut off reel spin sound when spin presentation is done
		TYPE:SEQUENTIAL  # "RANDOM" or "SEQUENTIAL"
		RE_TUMBLE_COUNTER:0	# Number of re-tumble sounds
		RE_TUMBLE_TYPE:SEQUENTIAL	# "RANDOM" or "SEQUENTIAL"
		FROZEN_IDLE_TIME_MAIN:8 #Used in conjunction with FROZEN type, time interval for which main game will remain idle before extended reelspin sounds starts to fade
		FROZEN_IDLE_TIME_BONUS:0 #Used in conjunction with FROZEN type,time interval for which bonus game will remain idle before extended reelspin sounds starts to fade
		FROZEN_FADE_TIME_MAIN:2 #Used in conjunction with FROZEN type,fading time duration for main
		FROZEN_FADE_TIME_BONUS:0 #Used in conjunction with FROZEN type,fading time duration for bonus
		FADE_OUT_START:1 # Percentage of tumble duration
		FADE_OUT_END:1 # Percentage of tumble duration
		FADE_ON_SLAM:FALSE #set to true if reel sound should fade on slam
		FADE_ON_SLAM_TIME:2 # used when fade on slam is set to true. duration of fade out
	END
	ANTICIPATION_LENGTH:2 # Duration of anticipation presentation for each reel
	SMART_SOUND_TRAILING:FALSE	# "TRUE" mean cut off smart sound
	BELL_LENGTH:3	# Bell duration
	RETRIGGER_BELL_LENGTH:3	# Retrigger bell duation
	BELL_TERM:TRUE	# "TRUE" means play bell terminator sound
	TRANSITION_TRALING:FALSE	# "TRUE" means do not cut off transition sound when transition animation is finished 
	BONUS_MAJOR_SYNC:FALSE	#"TRUE" means syrc major symbol aniamtion sounds with underscore
	UNDERSCORE_DUCKING_BONUS_ROLLUP:1.0		#Change the volume of the Bonus underscore to this value during a rollup 
	UNDERSCORE_DUCKING_BONUS_PRESHOW:1.0		#Change the volume of the Bonus underscore to this value during preshow
	UNDERSCORE_DUCKING_BONUS_PRESHOW_STACK:1.0	#Change the volume of the Bonus underscore to this value during preshow if there is a stack sound
	UNDERSCORE_DUCKING_BONUS_SYMBOLS:1.0	#Change the volume of the Bonus underscore to this value during symbol sounds
	UNDERSCORE_DUCKING_BONUS_STACKS:1.0		#Change the volume of the Bonus underscore to this value during superstack sounds
	UNDERSCORE_DUCKING_BASE_ROLLUP:1.0		#Change the volume of the Main underscore to this value during a rollup
	UNDERSCORE_DUCKING_BASE_PRESHOW:1.0		#Change the volume of the Main underscore to this value during a preshow
	UNDERSCORE_DUCKING_BASE_PRESHOW_STACK:1.0	#Change the volume of the Main underscore to this value during a preshow if there is a stack sound
	UNDERSCORE_DUCKING_BASE_SYMBOLS:1.0		#Change the volume of the Main underscore to this value during symbol sounds
	UNDERSCORE_DUCKING_BASE_STACKS:1.0		#Change the volume of the Main underscore to this value during superstack sounds
	UNDERSCORE_DUCKING_ANTICIPATION:1.0		#Change the volume of either underscore to this value during the anticipation sound
	UNDERSCORE_DUCKING_SMART:1.0			#Change the volume of either underscore to this value during a smart sound
	UNDERSCORE_BASE_BPM:120					#Beats per minute of the Underscore in the Main Game
	UNDERSCORE_BONUS_BPM:120				#Beats per minute of the Underscore in the Bonus Game
	UNDERSCORE_ANIMATION_BEAT_SYNC:FALSE	#Turn on whether the underscore's beat will be synced to symbol animation sounds
	POSTPONE_BASE_UNDERSCORE:FALSE			#If true, the base underscore will not play until the coinIn sound is done
	BASE_UNDERSCORE_LOOP_START:0			#loop point start (in milliseconds)
	BASE_UNDERSCORE_LOOP_END:0				#loop point end
	BONUS_UNDERSCORE_LOOP_START:0			#loop point start (in milliseconds)
	BONUS_UNDERSCORE_LOOP_END:0				#loop point end
	PAN_REEL_STOP:FALSE
	START_BASE_UNDERSCORE_ON_SPIN:FALSE	# "TRUE" means play underscore music when player initiates a spin
	START_BASE_UNDERSCORE_ON_IDLE:FALSE	# "TRUE" means after idling the game for certain seconds(IDLE_TIMER), start to play main underscore
	START_BASE_UNDERSCORE_ON_START:FALSE # "TRUE" means start to play underscore as soon as the game starts
	POSTPONE_BASE_UNDERSCORE:TRUE			#If true, the base underscore will not play until the coinIn sound is done
	IDLE_TIMER:0
	UNDERSCORE_FADE_IN_DURATION:2	# undersocre fade in duration after roll up 
	UNDERSCORE_SEQUENCE:{}
END

#################################################################################################################################### GAME FEATURE
TAG GAME_FEATURE
END

#################################################################################################################################### SUPER SYMBOLS
TAG SUPERSYMBOLS
	INDICATOR_INDEX:10000
	FILLER_INDEX:10000
	USE_MULTIPLE_MOVIES:TRUE
	SUPERSYMBOLREEL:112233
	#TAG OVERRIDE_DIVIDER_SIZE
	#	WIDTH:0
	#	HEIGHT:0
	#END
	USE_REGULAR_SYMBOL_ANIMATIONS:FALSE
	REPLACE_WILDS_IN_PARTIAL_SUPERSYMBOLS:FALSE
END
