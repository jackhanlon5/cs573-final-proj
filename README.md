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

## Open Questions

I am unsure of how well I can continue to plot the FG% numbers with the rest of the data as the numbers for those are all 0-1 and would be rather hard to normalize well. The radar chart mockup I made does it in an alright fashion but I want to see if I can make it better or even just plot them together to make it a non-issue and even create a new visualization for the best shooters in the league. This gave me a new idea!!

How can I take the players and organize them by team to visualize team and region data? Sketches above!

## Milestones

10/10: Created this branch, had initial sketches and a few pseudo visualizations created. Direction of final visualizations established and plans laid out.

10/24: Iterated on the psuedo visualizations. Added an idea to visualize 'team statistics' on a map as a result of the map assignment and added a sketch. Work on that to follow.
