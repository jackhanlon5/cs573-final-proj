import pandas as pd
import numpy as np
import matplotlib.pyplot as plt

# Load the CSV file (replace 'path_to_your_file.csv' with the actual file path)
player_data = pd.read_csv('E:/CS573 - Data Viz/datasets/nba_player_data.csv')
# Select the columns related to offensive stats
offensive_stats = ['PTS', 'FG%', '3P%', 'eFG%', 'FT%', 'AST']
players = player_data[['Player'] + offensive_stats].dropna()

# Normalize the statistics (0-1 range)
normalized_players = players.copy()
for stat in offensive_stats:
    normalized_players[stat] = (players[stat] - players[stat].min()) / (players[stat].max() - players[stat].min())

# Sum the normalized stats to rank players
normalized_players['Total'] = normalized_players[offensive_stats].sum(axis=1)

# Sort by total score and take the top 15 players
top_players = normalized_players.sort_values(by='Total', ascending=False).head(15)

# Radar Chart for the top 15 players
def plot_radar_chart(players):
    categories = offensive_stats
    num_vars = len(categories)

    angles = np.linspace(0, 2 * np.pi, num_vars, endpoint=False).tolist()
    angles += angles[:1]

    fig, ax = plt.subplots(figsize=(8, 8), subplot_kw=dict(polar=True))

    for i, player in players.iterrows():
        values = player[categories].values.flatten().tolist()
        values += values[:1]
        ax.fill(angles, values, alpha=0.25, label=player['Player'])
        ax.plot(angles, values, linewidth=2)

    ax.set_xticks(angles[:-1])
    ax.set_xticklabels(categories)
    plt.title("Offensive Ability of Top 15 Players (Normalized)")
    plt.legend(loc='upper right', bbox_to_anchor=(1.3, 1.1))
    plt.show()

# Bubble Chart for the top 15 players
def plot_bubble_chart(players):
    x = players['PTS']
    y = players['FG%']
    bubble_size = players['AST'] * 100  # scale assists for bubble size

    plt.figure(figsize=(10, 6))
    plt.scatter(x, y, s=bubble_size, alpha=0.5, color='b')

    for i, player in enumerate(players['Player']):
        plt.text(x.iloc[i], y.iloc[i], player, fontsize=9, ha='right')

    plt.xlabel('Points per Game (PTS)')
    plt.ylabel('Field Goal Percentage (FG%)')
    plt.title('Offensive Ability: Bubble Size = Assists')
    plt.grid(True)
    plt.show()

# Plot radar chart and bubble chart for the top 15 players
plot_radar_chart(top_players)
plot_bubble_chart(top_players)