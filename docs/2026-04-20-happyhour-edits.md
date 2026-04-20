# 2026-04-20-happyhour-edits
1. **Branding**
   1. We have a new brand name for this project: Happyhour
      1. Make a plan to change this everywhere in local directories, code, GitHub, repo, on Cloudflare etc.
      2. Walk me through the necessary changes I need to make
   2. New domain will be https://happyhour.day
      1. Walk me through making that change at Cloudflare
   3. Implement new header with new branding
      1. See this Figma component: ~[https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=95-2575&t=jlfdti5KKYN7kN9d-11](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=95-2575&t=jlfdti5KKYN7kN9d-11)~
   4. Implement new OpenGraph graphic
      1. See Figma frame here: [Figma](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=185-1716&t=jlfdti5KKYN7kN9d-11)
   5. Implement new Favicon
      1. See Figma frame here: [Figma](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=185-1719&t=jlfdti5KKYN7kN9d-11)
2. **New Feature**
   1. Adding a new mode alongside dark and light mode called “Happy Mode”
      1. This mode changes the background to a rich yellow
      2. Add a new icon to the Appearance switcher in the sidebar
         1. [Figma](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=198-1782&t=jlfdti5KKYN7kN9d-11)
3. **Enhancements**
   1. Drawer toggle changes: 
      1. Fix: The open state is positioned about 6px lower than the closed state; they should be perfectly aligned
      2. Implement redrawn icons for drawer toggle, where vector lines are slightly thicker: [Figma](https://www.figma.com/design/ykzuXYZ4gnogbNKZeV3Q1H/Happyhour-Design?node-id=95-2575&t=jlfdti5KKYN7kN9d-11)      
   2. When editing an existing clock tile the menu of cities should be scrolled to display the current city instead of the top of the menu list
   3. When deleting a Clock Tile the system message is titled with the URL of the site; 
      1. See screen grab at: chat/2026-04-20-clock-tile-deletion-messsage.png
      2. can we change it to say Happyhour
   4. Next/Prev/Offset badges in clock tiles
      1. Change font to semi-bold
      2. Increase the font size to 8px with a line-height of 16px
      3. Increase the letter spacing on the Next/Prev labels only to 0.2px 
4. **Bugs:** 
   1. When editing an existing clock tile, if the user types in the name of a city with a space, e.g., Los Angeles or San Francisco, the Z-index of the drop down menu drops to the back, the clock tile turns yellow/active and pushes forward
   2. In logged out default state, the second city still shows a null city and says “Select City”; it should be set to New York
   3. Time data can get cleared from an instance of the web app when it sits for a certain length of time, causing the app to display null data and requiring a slow refresh
   4. When removing a clock tile, add an animation to quickly fade the clock tile to zero before removing it from the canvas; the current behavior is too abrupt
   5. When I’m in Northern California. e.g., Napa or Sacramento, the hero clock says my closest city is Los Angeles; can we target this closer?
   
