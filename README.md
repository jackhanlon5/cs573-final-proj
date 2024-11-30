# Data Visualization Project

## NBA Data

The data I propose to visualize for my project is my 2023/24 NBA Season dataset 


## Questions & Tasks

The following tasks and questions will drive the visualization and interaction decisions for this project:

1. Create a correlation matrix between all of the statistics tracked to find relations
2. Find the best players in the league based on offensive stats
3. Find the best players in the league based on defensive stats
4. Find the relationship between minutes played and points per game and see who ranks above the rest
5. See if there is a postive/upward trending relationship between ORB and FTA or DRB and AST as the two statistics should be heavily related with the way the game is played


## Sketches

![image](https://github.com/user-attachments/assets/9f8d45ce-9a2a-4498-912c-ca384eac8a92)

The above image is a radar chart which I plan to use to map out offensive and defensive stats for players comparatively. I aim to use these to not only compare players head-to-head but also to see where specific players excel compared to the general "top" players in the league.

![image](https://github.com/user-attachments/assets/2b70983a-a29d-4642-8593-b8476efffb23)

This sketch of a stacked bar chart is going to be used for offensive and defensive statistics as well, but more so to see a smaller subset of statistics combined. On both sides of the ball there is generally a "Big 3" of stats, those being points, assists, and rebounds, but I want to focus on just offense and just defense as well to really separate players as well. So I plan to make this with those 3 previously mentioned as well as points, assists, and eFG% for offense, and steals, blocks, and rebounds for defense.

![team_data](https://github.com/user-attachments/assets/81c0bbef-4d35-4fe1-b9d9-1fa92122c534)

Initial concept of some team data plots! Prototype below, just created this before doing the map assignment. 

## Prototypes

![image](https://github.com/user-attachments/assets/9348bd12-375b-4a06-bc91-0aa483d6dad3)

I’ve created a proof of concept visualization of this data. It's just a quick mock up of the radar chart made with Python graphing libraries. I made it to show the 'top 15' offensive players with a normalization applied to ensure that each axis is equal.

![image](https://github.com/user-attachments/assets/afe368bb-f67c-454d-a0ba-99a935842742)

I also made this which is a visualization of the initial version of the second sketch above.

![image](https://github.com/user-attachments/assets/e034b777-a8bc-496e-80d2-348a7d09e9d2)

This is a quick mockup I made for the map assignment, plan to further imnprove on it!

## Current Visualization Iterations

![image](https://github.com/user-attachments/assets/5a410260-6076-44a5-8898-3110d6aa5414)

Here is the most up to date iteration of my radar chart for the top 15 offensive players comparison. I really like how this turned out and despite a few statistical outliers (Looking at you Luke Kornet), this does a fantastic job of showing what I wanted it to. It accurately captures the players that many believe to be at the top of the league in terms of scoring and pacing and I'm happy with how easy it ended up being to read once I filtered the players down

![image](https://github.com/user-attachments/assets/dbaa48fc-1fa4-4335-95b8-29a255907979)

Interestingly, this is the same radar chart but built with a completely different plotting library in Python! Dash was able to do so much more for me in terms of filtering than plotyl could so I needed to swap in order to make my offensive comparison radar chart work out! This one allows for the comparison of players head-to-head using the same format as before so it's much less limited in terms of who it can display at the cost of it being 2 at a time. Great for weighing players against each other in a vacuum which is something NBA fans do a little too often!

![image](https://github.com/user-attachments/assets/7350982c-1de5-45a1-b237-19b73c58f2f8)

This is the most up to date version of the bubble chart which turned into my stacked bar chart! Really like how it came together as it's very simple but tells a great story with such little relative information. I believe that the colors, which not incredibly cohesive, do their jobs in highlighting which portion of their combined statistics come from which stat and show just how much of an impact a player can make from just one really strong category, such as Nic Claxton with significantly higher blocks than those around him, or even Jokic with so many steals compared to the other top 5 defensive players.

![image](https://github.com/user-attachments/assets/8247a944-c9f9-4631-85bb-1be6305f9ba8)

Finally this is where the map stands. I haven't been able to get this working well as trying to line up all of the pieces has been a surprisingly difficult challenge and I haven't enjoyed it as it's been rather frustrating. Future work has more information on it, very in need of ideas and suggestions!

## Open Questions

I am unsure of how well I can continue to plot the FG% numbers with the rest of the data as the numbers for those are all 0-1 and would be rather hard to normalize well. The radar chart mockup I made does it in an alright fashion but I want to see if I can make it better or even just plot them together to make it a non-issue and even create a new visualization for the best shooters in the league. This gave me a new idea!!

How can I take the players and organize them by team to visualize team and region data? Sketches above!

## Future Work

I am sad to report that I don't think the map visualization will be getting any more love without some serious assistance. It didn't pan out how I had hoped and there were so many moving pieces that I struggled to really get everything onto the vis cohesively. I also ran into some graphing issues with numerous teams in the same or very similar locations which lead to some overlap and I couldn't think of a solution that really satisfied me for those. I would love to revisit this and see if I could get that going another time, but for now I think I would need to go with some sort of tabular or graphical vis to make it work with the time left. Very very open to suggestions and ideas here please as I really want to do this before the semester is over!

## Milestones

10/10: Created this branch, had initial sketches and a few pseudo visualizations created. Direction of final visualizations established and plans laid out.

10/24: Iterated on the psuedo visualizations. Added an idea to visualize 'team statistics' on a map as a result of the map assignment and added a sketch. Work on that to follow.

10/31: Iterated on the radar chart. Made it a little easier to view and read the statistics. Sadly need each axis to be normalized otherwise the data looks ridiculous and it is impossible to read. Added a better legend which is now able to be interacted with as well! Also fixed the dataset path so anyone can run it and interact easily.

11/8: Created the stacked bar chart from my sketches. Didn't attempt to add the full color layers as I thought it might have actually been distracting and would take away from the players statistics and it made the orderings look strange. Added the ability to sort between total combined statistics (highest to lowest) as well as by the combined normalized statistics to also display how good they are comparatively since the plain numbers didn't tell the full story!

11/15: Missed my update in here but did manage to add some interactive piece to oen of my visualizations! I took the stacked bar chart from before and made a few interactive bits with it which were a filtering legend and data values to appear on hover! These were interesting to add as I've never had to do something like this before and I really thought it added to the visual as I was having trouble fitting a meaningful amount of data within the vis without compromising the scales, so this helped tremendously. 

11/22: Had a rough week with some assignments and work and was unable to really do much or submit a check in. Tried to get some work done on my map idea but was unable to get anything good going or get a solid solution for any of the glaring issues I was having so I decided to move away from it and get back into my radar chart, which was one plan for the final few weeks.

11/29 iterated heavily on the radar chart. Made no visual changes to it as I felt like it was as nice as it was going to get in that regard. but I did make a change to how I can display the data by changing it into a comparison tool! I went in the direction of head-to-head comparisons by overlaying a players stat's with another since this is something that fans do all the time when looking at players for OPOY and MVP all the time. I did something similar by normalizing the defensive stacked bar chart to get a better comparison going on that visualization, which is what really spurred the idea here for a comparison based vis. Couldn't get it to flow properly with ploty so I sadly had to have ChatGPT help me shift things to Dash which I had never used before, but it worked beautifuly after!