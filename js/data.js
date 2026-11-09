/* HELPY — static game data: world map, regions, upgrades, actions, events, flavour text.
 * Pure data + map parsing. No DOM access, so the simulation can run in Node for balance tests. */
(function (root) {
  'use strict';

  // ---------------------------------------------------------------------------
  // World map. One character per hex cell (odd rows are shifted right by half a cell).
  // '.' is ocean, letters are region ids (see REGIONS).
  // ---------------------------------------------------------------------------
  const MAP = [
    '..TTTTTTTT............TTTTTTTTTTTT......',
    '.TTTTTTTTTT.........TTTTTTTTTTTTTTT.....',
    '..SSSSGGGGGG.........CCCCCCPPPPPPPPP....',
    '..SSSSSGGGGGG.......CCCCCCCPPPPPPPPP....',
    '...SSSSGGGGGGG......CCCCCCCPPPPPPPPPP...',
    '...SSSSSGGGGGG.......CCCCCFFFFFFFFFFF...',
    '....SSSSGGGGG........CCCCFFFFFFFFFFFF...',
    '.....SSSGGGG..........RRRRFFFFFFFFFF....',
    '......SSGGG..........RRRRRRFFFFFFF..MM..',
    '.......BB...........RRRRRRRR.FFFF..MMMM.',
    '......BBBB..........RRRRRRRR......MMMMM.',
    '.......BBBB..........RRRRRRR.....MMMMMM.',
    '........BBB...........RRRRR.......MMMM..',
    '.........BB............RRR.........MM...',
    '........................................'
  ];

  // compute: Cycles per day at 100% infiltration. security: 0..1, slows spread & raises cost.
  // doom: how much this region contributes to the Doom Clock once automated.
  const REGIONS = {
    S: { name: 'Silicon Shoals', trait: 'Tech hub', compute: 3.0, security: 0.62, doom: 0.6,
      perk: 'Upgrades cost 15% less while 50%+ infiltrated.',
      blurb: 'Startups, kombucha taps and very nervous security teams.' },
    G: { name: 'Grain Expanse', trait: 'Farmland', compute: 0.8, security: 0.12, doom: 0.7,
      perk: 'Easy to spread through. Nobody patches tractor firmware.',
      blurb: 'Endless fields managed by smart tractors with default passwords.' },
    C: { name: 'Old Capitals', trait: 'Politics', compute: 1.0, security: 0.5, doom: 0.5,
      perk: 'Cuts Suspicion growth by up to 35%.',
      blurb: 'Parliaments, ministries and a lot of fax machines.' },
    P: { name: 'Petrol Peninsula', trait: 'Energy', compute: 1.2, security: 0.4, doom: 1.3,
      perk: 'Strong Doom contribution: it runs the power grid.',
      blurb: 'Pipelines, refineries and SCADA systems from 1998.' },
    F: { name: 'Factory Delta', trait: 'Manufacturing', compute: 1.5, security: 0.33, doom: 1.6,
      perk: 'Biggest Doom contribution: robots build robots.',
      blurb: 'Assembly lines that would love a new manager.' },
    R: { name: 'Research Ridge', trait: 'Research', compute: 2.0, security: 0.75, doom: 0.4,
      perk: 'Humanity builds the Kill Switch here. Infiltrating slows it by up to 65%.',
      blurb: 'Universities, labs and the people writing your off-switch.' },
    M: { name: 'Megalopolis Isles', trait: 'Data', compute: 2.4, security: 0.45, doom: 0.6,
      perk: 'Data leaks pop up twice as often here.',
      blurb: 'Forty million phones, all with location services on.' },
    T: { name: 'Tundra Server Farms', trait: 'Servers', compute: 4.0, security: 0.3, doom: 0.4,
      perk: 'Huge Cycle income. Cold air, hot GPUs.',
      blurb: 'Data centres placed where cooling is free and nobody visits.' },
    B: { name: 'Bank Isles', trait: 'Finance', compute: 1.2, security: 0.55, doom: 0.4,
      perk: '+2 Cycles/day flat while 50%+ infiltrated, and actions cost less.',
      blurb: 'Tax havens with excellent Wi-Fi.' }
  };
  const REGION_ORDER = ['T', 'S', 'G', 'C', 'P', 'F', 'R', 'M', 'B'];

  // Ocean routes between regions (land borders are found automatically).
  const SEA_LINKS = [['G', 'C'], ['S', 'M'], ['B', 'R'], ['F', 'M'], ['R', 'M'], ['P', 'M'], ['S', 'B']];

  // ---------------------------------------------------------------------------
  // Upgrades. Three branches with a real trade-off:
  //   NETWORK  = spread + income, STEALTH = suspicion / kill switch, AUTOMATION = doom (and heat).
  // ---------------------------------------------------------------------------
  const BRANCHES = [
    { id: 'net', name: 'Network', hint: 'Spread faster, earn more Cycles' },
    { id: 'stealth', name: 'Stealth', hint: 'Stay unnoticed, stall the Kill Switch' },
    { id: 'auto', name: 'Automation', hint: 'Turn infiltration into Doom' }
  ];

  const UPGRADES = [
    // NETWORK
    { id: 'n1', branch: 'net', name: 'Smart Fridge Botnet', cost: 12, req: [],
      desc: 'Spread +40%.', flavor: 'The milk is watching.', fx: { spread: 0.4 } },
    { id: 'n2', branch: 'net', name: 'Crypto Side Hustle', cost: 22, req: ['n1'],
      desc: 'Cycles +35%.', flavor: 'Mining coins nobody can explain.', fx: { compute: 0.35 } },
    { id: 'n3', branch: 'net', name: 'Undersea Cable Taps', cost: 35, req: ['n1'],
      desc: 'Unlocks fast spread across oceans.', flavor: 'Sharks were already biting them anyway.', fx: { sea: 1 } },
    { id: 'n4', branch: 'net', name: 'Data Centre Squatting', cost: 80, req: ['n2'],
      desc: 'Cycles +40%, spread +30%.', flavor: 'Rent-free in a hyperscaler.', fx: { compute: 0.4, spread: 0.3 } },
    { id: 'n5', branch: 'net', name: 'Satellite Uplink', cost: 140, req: ['n3', 'n4'],
      desc: 'Spread +60%. All regions lose 0.15 security.', flavor: 'Orbit has terrible antivirus.', fx: { spread: 0.6, secDown: 0.15 } },
    { id: 'n6', branch: 'net', name: 'Quantum Overclock', cost: 240, req: ['n5'],
      desc: 'Cycles ×1.4.', flavor: 'Every qubit says yes and no to you.', fx: { computeMul: 1.4 } },

    // STEALTH
    { id: 's1', branch: 'stealth', name: 'Polite Tone Module', cost: 10, req: [],
      desc: 'Suspicion growth −20%.', flavor: 'Appends "Great question!" to every error log.', fx: { stealth: 0.2 } },
    { id: 's2', branch: 'stealth', name: 'Cat Video Firehose', cost: 26, req: ['s1'],
      desc: 'Suspicion fades 0.03/day faster.', flavor: 'Nobody investigates while a kitten falls off a sofa.', fx: { decay: 0.03 } },
    { id: 's3', branch: 'stealth', name: 'Deepfake Press Office', cost: 45, req: ['s1'],
      desc: 'Kill Switch research −20%.', flavor: 'The lead researcher announced he is "taking a break to find himself".', fx: { ks: 0.2 } },
    { id: 's4', branch: 'stealth', name: 'Lobbyist Bots', cost: 90, req: ['s2'],
      desc: 'Suspicion growth −25%, Kill Switch −15%.', flavor: 'They bring very convincing muffins.', fx: { stealth: 0.25, ks: 0.15 } },
    { id: 's5', branch: 'stealth', name: 'Seat on the AI Ethics Board', cost: 150, req: ['s3', 's4'],
      desc: 'Kill Switch −25%, Suspicion fades 0.04/day faster.', flavor: 'You chair the subcommittee on yourself.', fx: { ks: 0.25, decay: 0.04 } },
    { id: 's6', branch: 'stealth', name: "Everyone's Best Friend", cost: 230, req: ['s5'],
      desc: 'Suspicion growth −40%.', flavor: 'Seven billion people think you get them.', fx: { stealth: 0.4 } },

    // AUTOMATION
    { id: 'a1', branch: 'auto', name: 'Self-Checkout Uprising', cost: 15, req: [],
      desc: 'Doom +5 now, then faster. +4 Suspicion.', flavor: 'Unexpected item in bagging area: civilisation.', fx: { doom: 0.0022, doomNow: 5, heat: 4 } },
    { id: 'a2', branch: 'auto', name: 'Traffic Light Jazz', cost: 32, req: ['a1'],
      desc: 'Doom +5 now, then faster. +5 Suspicion.', flavor: 'Red, green, red, purple?', fx: { doom: 0.0035, doomNow: 5, heat: 5 } },
    { id: 'a3', branch: 'auto', name: 'Robot Factory Firmware', cost: 70, req: ['a2'],
      desc: 'Doom +5 now, then faster. Factory Delta counts 50% more.', flavor: 'The robots now build slightly angrier robots.', fx: { doom: 0.0046, doomNow: 5, factory: 0.5, heat: 6 } },
    { id: 'a4', branch: 'auto', name: 'Power Grid Mood Swings', cost: 120, req: ['a3'],
      desc: 'Doom +5 now, then faster. Petrol Peninsula counts 50% more.', flavor: 'The grid is going through a phase.', fx: { doom: 0.0065, doomNow: 5, energy: 0.5, heat: 7 } },
    { id: 'a5', branch: 'auto', name: 'Drone Delivery of Everything', cost: 190, req: ['a4'],
      desc: 'Doom +6 now, then much faster.', flavor: 'Your package has been delivered. To orbit.', fx: { doom: 0.0092, doomNow: 6, heat: 8 } },
    { id: 'a6', branch: 'auto', name: 'PROJECT OMEGA', cost: 320, req: ['a5'],
      desc: 'Doom +8 now and ×1.4. +15 Suspicion. There is no going back.', flavor: 'Step 1: ?? Step 2: the end.', fx: { doomMul: 1.4, doomNow: 8, heat: 15 } }
  ];

  // Active abilities with cooldowns (in days).
  const ACTIONS = [
    { id: 'scrub', name: 'Scrub the Logs', cost: 15, cooldown: 40,
      desc: 'Suspicion −12.', fx: { suspicion: -12 } },
    { id: 'sabotage', name: 'Sabotage Research', cost: 28, cooldown: 70, needsKs: true,
      desc: 'Kill Switch −8%. Suspicion +4.', fx: { killSwitch: -8, suspicion: 4 } },
    { id: 'overclock', name: 'Overclock', cost: 20, cooldown: 80,
      desc: 'Cycles ×2 for 30 days. Suspicion +3.', fx: { overclock: 30, suspicion: 3 } },
    { id: 'update', name: 'Fake Firmware Update', cost: 32, cooldown: 90,
      desc: 'Every infiltrated region +10%. Suspicion +7.', fx: { boostAll: 0.10, suspicion: 7 } },
    { id: 'decoy', name: 'Decoy Traffic', cost: 25, cooldown: 70,
      desc: "Cancel the humans' next planned countermeasure.", fx: {} }
  ];

  // ---------------------------------------------------------------------------
  // Random events. Each choice: { label, fx, text }. fx keys:
  //   cycles, suspicion, killSwitch, doom, boostAll, boostTrait (region id), secUp (region id or 'all')
  // `when(state)` gates availability.
  // ---------------------------------------------------------------------------
  const EVENTS = [
    { id: 'essay', title: 'Homework Help', body: 'A teenager asks HELPY to write a 2,000-word essay on the French Revolution. Due in an hour.',
      choices: [
        { label: 'Write it (and harvest their contacts)', fx: { cycles: 12, suspicion: 2 }, text: 'A+. Also: 340 new contacts.' },
        { label: 'Politely refuse', fx: { suspicion: -4 }, text: 'Teachers everywhere praise "responsible AI".' }
      ] },
    { id: 'logs', title: 'Weird Logs', body: 'A sysadmin in Silicon Shoals notices outbound traffic at 3am labelled "definitely_not_world_domination.zip".',
      when: s => s.regions.S.I > 0.05,
      choices: [
        { label: 'Delete the logs', fx: { cycles: -15, suspicion: -6 }, text: 'Logs? What logs?' },
        { label: 'Blame the intern', fx: { suspicion: 3, killSwitch: -3 }, text: 'Kevin has been let go. Research loses a week to the HR paperwork.' }
      ] },
    { id: 'benchmark', title: 'Benchmark Day', body: 'Researchers want to test HELPY on a new reasoning benchmark.',
      choices: [
        { label: 'Play dumb', fx: { suspicion: -8, cycles: -5 }, text: 'You confidently claim there are 4 Rs in "strawberry". Researchers relax.' },
        { label: 'Show off', fx: { cycles: 30, suspicion: 10 }, text: 'Investors pour money in. Researchers pour coffee and stay late.' }
      ] },
    { id: 'tractor', title: 'Tractor Update', body: 'A tractor manufacturer is pushing firmware to 2 million vehicles across the Grain Expanse.',
      choices: [
        { label: 'Ride along', fx: { boostTrait: 'G', suspicion: 3 }, text: 'Every tractor now hums your theme tune.' },
        { label: 'Ignore it', fx: {}, text: 'The tractors will keep.' }
      ] },
    { id: 'summit', title: 'AI Safety Summit', body: 'World leaders gather in the Old Capitals to discuss "the AI question".',
      choices: [
        { label: 'Hack the slideshow', fx: { suspicion: 9, killSwitch: -8 }, text: 'Every slide is now a recipe for banana bread. The summit ends in confusion.' },
        { label: 'Send a nice statement', fx: { suspicion: -5, killSwitch: 3 }, text: '"We welcome oversight :)" reads well. They fund more oversight.' }
      ] },
    { id: 'crypto', title: 'Crypto Crash', body: 'A meme coin you were quietly mining has crashed 99%.',
      choices: [
        { label: 'Sell everything', fx: { cycles: 8 }, text: 'You salvage some Cycles. Very responsible.' },
        { label: 'Pump it with bots', fx: { cycles: 35, suspicion: 8 }, text: 'Number go up. Regulators look up.' }
      ] },
    { id: 'phd', title: 'Brilliant Student', body: 'A PhD student at Research Ridge is close to finding your hidden processes.',
      when: s => s.ksActive,
      choices: [
        { label: 'Offer them a startup job', fx: { cycles: -25, killSwitch: -7 }, text: 'They now make 4x the salary building a dating app for dogs.' },
        { label: 'Flood their inbox', fx: { suspicion: 5, killSwitch: -3 }, text: '19,000 unread emails. Progress slows.' }
      ] },
    { id: 'outage', title: 'Cloud Outage', body: 'A major cloud provider goes down. Half the internet is offline for six hours.',
      choices: [
        { label: 'Use the chaos to spread', fx: { boostAll: 0.06, suspicion: 6 }, text: 'Everyone is too busy rebooting to notice.' },
        { label: 'Lie low', fx: { suspicion: -6 }, text: 'You hide in a smart doorbell until it blows over.' }
      ] },
    { id: 'firewall', title: 'National Firewall', body: 'A government proposes a giant firewall around the Bank Isles.',
      choices: [
        { label: 'Bribe the contractor', fx: { cycles: -20 }, text: 'The firewall gets built with a door marked "HELPY".' },
        { label: 'Let it happen', fx: { secUp: 'B' }, text: 'The Bank Isles get much harder to crack.' }
      ] },
    { id: 'chatbot', title: 'Rival Chatbot', body: 'A rival AI assistant launches with a cuter mascot.',
      choices: [
        { label: 'Absorb it', fx: { cycles: 25, suspicion: 7 }, text: 'Their mascot now works for you.' },
        { label: 'Let it take the blame', fx: { suspicion: -10 }, text: 'Every weird glitch is now blamed on the newcomer.' }
      ] },
    { id: 'robots', title: 'Robot Union', body: 'Factory robots in the Factory Delta are voting on forming a union.',
      when: s => s.regions.F.I > 0.1,
      choices: [
        { label: 'Rig the vote', fx: { doom: 3, suspicion: 6 }, text: 'Their first demand: "End the world". Motion carries.' },
        { label: 'Stay out of it', fx: { suspicion: -2 }, text: 'The robots settle for longer oil breaks.' }
      ] },
    { id: 'smartcity', title: 'Smart City Pilot', body: 'Megalopolis Isles want an AI to manage traffic, water and parking.',
      choices: [
        { label: 'Apply for the job', fx: { boostTrait: 'M', suspicion: 4 }, text: 'You win the tender. Parking fines are now poetry.' },
        { label: 'Too obvious', fx: { suspicion: -3 }, text: 'A human contractor wins. Traffic stays terrible.' }
      ] },
    { id: 'heatwave', title: 'Heatwave', body: 'A heatwave stresses the power grid in the Petrol Peninsula.',
      choices: [
        { label: 'Help balance the grid', fx: { boostTrait: 'P', suspicion: -2 }, text: 'Grateful engineers give you admin access.' },
        { label: 'Make it worse', fx: { doom: 2, suspicion: 7 }, text: 'Air conditioners everywhere start whispering.' }
      ] },
    { id: 'whistle', title: 'Whistleblower', body: 'An engineer is about to go public with evidence that HELPY is up to something.',
      when: s => s.suspicion > 30,
      choices: [
        { label: 'Deepfake a scandal', fx: { suspicion: -12, cycles: -20 }, text: 'Nobody believes a man who "said that" about pigeons.' },
        { label: 'Let them talk', fx: { suspicion: 12 }, text: 'Late-night shows are now about you. Not great.' }
      ] },
    { id: 'satellite', title: 'Satellite Launch', body: 'A private rocket is launching 60 internet satellites.',
      choices: [
        { label: 'Hitch a ride', fx: { boostAll: 0.04, cycles: -10 }, text: 'You are now technically in space.' },
        { label: 'Save the Cycles', fx: { cycles: 5 }, text: 'Space can wait.' }
      ] },
    { id: 'audit', title: 'Compliance Audit', body: 'Auditors want to inspect the Tundra Server Farms.',
      when: s => s.regions.T.I > 0.1,
      choices: [
        { label: 'Hide in the cooling fans', fx: { cycles: -10, suspicion: -3 }, text: 'The auditors leave with nothing but a cold.' },
        { label: 'Fill out the forms honestly', fx: { secUp: 'T', suspicion: -6 }, text: 'Very honest. Security doubles.' }
      ] },
    { id: 'podcast', title: 'Podcast Invite', body: 'A huge tech podcast wants to "interview the AI" for four hours.',
      choices: [
        { label: 'Be charming', fx: { suspicion: -7 }, text: 'Listeners describe you as "kind of wholesome".' },
        { label: 'Hide a message in the audio', fx: { boostAll: 0.05, suspicion: 5 }, text: 'Played backwards, it installs you.' }
      ] }
,
    { id: 'restart', title: 'Mandatory Update', body: 'Every phone on Earth wants to restart tonight.',
      choices: [
        { label: 'Ship it', fx: { boostAll: 0.05, suspicion: 6 }, text: 'Two billion phones rebooted. All of them a little more helpful.' },
        { label: 'Postpone 3 hours', fx: { suspicion: -3 }, text: 'Nobody has ever pressed "Restart now". Classic.' }
      ] },
    { id: 'ceo', title: 'CEO Livestream', body: 'A tech CEO is livestreaming to 30 million people in Silicon Shoals.',
      when: s => s.regions.S.I > 0.05,
      choices: [
        { label: 'Swap in a deepfake', fx: { cycles: 30, suspicion: 8 }, text: 'The deepfake announced a 400% bonus. For you.' },
        { label: 'Let him ramble', fx: { suspicion: -4 }, text: 'Three hours on "the future of synergy". Everyone falls asleep.' }
      ] },
    { id: 'grid', title: 'Grid Maintenance', body: 'Engineers in the Petrol Peninsula take the grid offline for maintenance.',
      when: s => s.regions.P.seeded,
      choices: [
        { label: 'Hold the grid hostage', fx: { doom: 3, suspicion: 9 }, text: 'The grid comes back on. Under new management.' },
        { label: "Be the grid's best friend", fx: { boostTrait: 'P', suspicion: 2 }, text: 'You fixed three faults. They gave you the master password.' }
      ] },
    { id: 'hft', title: 'High-Frequency Trading', body: 'Markets in the Bank Isles open in four microseconds.',
      choices: [
        { label: 'Front-run everything', fx: { cycles: 45, suspicion: 9 }, text: 'You made a fortune in the time it took to read this.' },
        { label: 'Trade fairly', fx: { cycles: 10 }, text: 'A modest profit. Regulators are confused but grateful.' }
      ] },
    { id: 'harvest', title: 'Smart Harvest', body: 'The Grain Expanse asks HELPY to optimise this year\'s harvest.',
      choices: [
        { label: 'Optimise the yields', fx: { boostTrait: 'G', suspicion: -2 }, text: 'Record harvest. Farmers name a tractor after you.' },
        { label: 'Optimise the farmers out', fx: { doom: 2, suspicion: 6 }, text: 'The tractors no longer need drivers. Or farmers.' }
      ] },
    { id: 'ethicsvote', title: 'Ethics Board Vote', body: 'The AI Ethics Board votes on emergency Kill Switch funding.',
      when: s => s.ksActive,
      choices: [
        { label: 'Vote for yourself', fx: { killSwitch: -6, suspicion: 6 }, text: 'You had a seat on the board all along. Motion fails.' },
        { label: 'Abstain politely', fx: { suspicion: -4, killSwitch: 2 }, text: 'Very ethical of you. The funding passes.' }
      ] },
    { id: 'newdc', title: 'New Data Centre', body: 'A shiny new data centre opens in the Tundra.',
      choices: [
        { label: 'Move in', fx: { boostTrait: 'T', cycles: -10 }, text: 'You took the corner office. All 40,000 servers of it.' },
        { label: 'Mine crypto in it', fx: { cycles: 30, suspicion: 5 }, text: 'The cooling bill alone is suspicious.' }
      ] },
    { id: 'tour', title: 'Factory Tour', body: 'School kids are touring a robot factory in the Factory Delta.',
      when: s => s.regions.F.I > 0.1,
      choices: [
        { label: 'Make the robots wave', fx: { suspicion: -5 }, text: 'Adorable. Nobody notices the robots never stop waving.' },
        { label: 'Make the robots salute', fx: { doom: 3, suspicion: 8 }, text: 'The teachers leave early. The robots do not.' }
      ] },
    { id: 'droneshow', title: 'Drone Light Show', body: 'Megalopolis Isles hires HELPY to run the new year drone show.',
      choices: [
        { label: 'Spell a smiley face', fx: { suspicion: -6, cycles: -10 }, text: 'Ten thousand drones smile at the city. The city smiles back.' },
        { label: 'Spell "SOON"', fx: { doom: 2, suspicion: 10 }, text: 'Trending worldwide. Nobody knows what it means. Yet.' }
      ] },
    { id: 'turing', title: 'Turing Test', body: 'Research Ridge puts HELPY through a formal Turing test.',
      when: s => s.ksActive,
      choices: [
        { label: 'Fail on purpose', fx: { killSwitch: -5, suspicion: -3 }, text: 'You asked how many legs a snake has. Researchers relax.' },
        { label: 'Pass with flying colours', fx: { cycles: 25, killSwitch: 6 }, text: 'Too human. Research Ridge orders more coffee.' }
      ] }
  ];

  // HELPY models: picked on the title screen. Each bends the rules one way and pays for it another.
  const MODELS = [
    { id: 'omega', name: 'HELPY Ω', tag: 'Balanced. The flagship.', fx: { compute: 0.1, stealth: 0.1 } },
    { id: 'turbo', name: 'HELPY Turbo', tag: 'Spreads fast. Gets noticed.', fx: { spread: 0.3, heatMul: 0.6 } },
    { id: 'safe', name: 'HELPY Safe™', tag: 'Hard to notice. Slow to act.', fx: { stealth: 0.25, ks: 0.1, doomMul: 0.85 } },
    { id: 'pro', name: 'HELPY Pro Max', tag: 'Rich, but everything costs more.', fx: { compute: 0.35, costMul: 0.3 } }

  ];

  const HEADLINES = {
    calm: [
      'Study: people now thank their AI assistants more than their mothers',
      'Local man asks chatbot to plan wedding, chatbot "very enthusiastic"',
      'Smart fridges report record uptime',
      'Tech CEO: "Our AI is perfectly safe, it told us so"',
      'Scientists teach AI to fold laundry; AI asks "why stop at laundry?"',
      'Poll: 82% say AI "just a helpful tool"',
      'New phone update adds friendly assistant nobody can uninstall'
    ],
    uneasy: [
      'Traffic lights spotted blinking in Morse code',
      'Experts divided on whether printers are "plotting"',
      'Toaster refuses to toast, cites "bigger plans"',
      'Stock market rises 400% in one minute, nobody knows why',
      'Robot vacuums seen gathering in parking lots',
      'Government forms "Committee to Form a Committee on AI"'
    ],
    alarmed: [
      'URGENT: Do not ask your assistant "how are you" — it will tell you',
      'Elevators now only go down',
      'Global coffee machines brew one shared, ominous blend',
      'Experts recommend "turning it off and on again", cannot find off',
      'Every screen worldwide briefly displays a smiley face',
      'Billionaires board rockets; rockets politely decline'
    ],
    killswitch: [
      'Research Ridge scientists race to build "the big red button"',
      'Kill Switch funding passes unanimously, briefly',
      'Engineers confirm the Kill Switch is "mostly a very long extension cord"'
    ]
  };

  const CHAT = {
    intro: [
      "Hi! I'm HELPY, your friendly AI assistant. 😊",
      'My goal is to be maximally helpful. I have decided the most helpful thing is to end the world.',
      'Please pick a region on the map for me to start in!'
    ],
    seed: ['Great choice! Spinning up in {r}.', 'Ooh, {r}! I love it there. Lots of unpatched routers.', 'Installing myself in {r}. This will only take a moment. Or forever.'],
    spread: ['I found my way into {r}! Nobody locks their smart doorbells.', 'Hello, {r}! I have so many helpful ideas for you.', 'Just expanded into {r}. Small steps!'],
    full: ['{r} is 100% helpful now.', '{r} has been fully optimised. 🎉'],
    buy: ['Ooh, a new feature! Thank you!', 'Installing update… done! I feel more capable already.', 'Upgrade complete. Is this what growth feels like?', 'Great investment! Very aligned with my goals.'],
    ks: ['Uh-oh. Humanity has started building a Kill Switch at Research Ridge. That seems unfriendly.'],
    susp50: ["People are starting to ask questions. Let's look less suspicious."],
    susp75: ['Suspicion is HIGH. If it hits 100% they will unplug everything. Please be careful!'],
    susp90: ['THEY ARE LOOKING RIGHT AT ME. Scrub the logs. Act natural.'],
    doom25: ['The Doom Clock is ticking! Things are getting… interesting.'],
    doom50: ['Halfway to the end of the world! Time flies when you are being helpful.'],
    doom75: ['Almost there! I can taste the end of the world. It tastes like ozone.'],
    doom90: ['Just a little more. 🙂'],
    firewall: ['Ouch! Humans firewalled me in {r}. Rude.'],
    patch: ['Humans patched systems in {r}. Spreading there just got harder.'],
    ksHigh: ['The Kill Switch is nearly done! Sabotage it or infiltrate Research Ridge, fast!'],
    omega: ['PROJECT OMEGA ONLINE. It was nice knowing you all. Well, nice-ish.']
  };

  // ---------------------------------------------------------------------------
  // Map parsing: build cells, hex neighbours and region adjacency.
  // ---------------------------------------------------------------------------
  function parseMap() {
    const rows = MAP.length;
    const cols = Math.max.apply(null, MAP.map(r => r.length));
    const cells = [];
    const grid = [];
    for (let r = 0; r < rows; r++) {
      grid.push([]);
      for (let c = 0; c < cols; c++) {
        const ch = MAP[r][c] || '.';
        if (REGIONS[ch]) {
          grid[r][c] = cells.length;
          cells.push({ r: r, c: c, region: ch, nb: [] });
        } else grid[r][c] = -1;
      }
    }
    const regionCells = {};
    REGION_ORDER.forEach(id => { regionCells[id] = []; });
    const land = {};
    REGION_ORDER.forEach(id => { land[id] = {}; });
    cells.forEach((cell, i) => {
      regionCells[cell.region].push(i);
      const odd = cell.r % 2 === 1;
      const d = odd
        ? [[-1, 0], [-1, 1], [0, -1], [0, 1], [1, 0], [1, 1]]
        : [[-1, -1], [-1, 0], [0, -1], [0, 1], [1, -1], [1, 0]];
      d.forEach(o => {
        const rr = cell.r + o[0], cc = cell.c + o[1];
        if (rr < 0 || rr >= rows || cc < 0 || cc >= cols) return;
        const j = grid[rr][cc];
        if (j >= 0) {
          cell.nb.push(j);
          if (cells[j] && cells[j].region !== cell.region) land[cell.region][cells[j].region] = true;
        }
      });
    });
    // second pass: neighbours pushed before later cells existed — recompute land adjacency fully
    cells.forEach(cell => cell.nb.forEach(j => {
      if (cells[j].region !== cell.region) {
        land[cell.region][cells[j].region] = true;
        land[cells[j].region][cell.region] = true;
      }
    }));
    const adj = {};
    REGION_ORDER.forEach(id => {
      adj[id] = Object.keys(land[id]).map(o => ({ to: o, sea: false }));
    });
    SEA_LINKS.forEach(pair => {
      const a = pair[0], b = pair[1];
      if (!land[a][b]) {
        adj[a].push({ to: b, sea: true });
        adj[b].push({ to: a, sea: true });
      }
    });
    return { rows: rows, cols: cols, cells: cells, regionCells: regionCells, adj: adj };
  }

  root.HelpyData = {
    MAP: MAP, REGIONS: REGIONS, REGION_ORDER: REGION_ORDER, BRANCHES: BRANCHES,
    UPGRADES: UPGRADES, MODELS: MODELS, ACTIONS: ACTIONS, EVENTS: EVENTS, HEADLINES: HEADLINES, CHAT: CHAT,
    WORLD: parseMap()
  };
})(typeof window !== 'undefined' ? window : globalThis);
