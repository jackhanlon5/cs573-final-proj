import pandas as pd
import plotly.graph_objects as go
from sklearn.preprocessing import MinMaxScaler

# Load data
df = pd.read_csv('cs573-final-proj/datasets/nba_player_data.csv')

# Select relevant stats
stats = ['PTS', 'FG%', '3P%', 'eFG%', 'FT%', 'AST']
df_stats = df[['Player'] + stats]

# Normalize statistics for radar chart but keep original values for tooltips
scaler = MinMaxScaler()
df_stats_normalized = df_stats.copy()
df_stats_normalized[stats] = scaler.fit_transform(df_stats[stats])

# Calculate total scores based on normalized stats and select the top 15 players
df_stats_normalized['TotalScore'] = df_stats_normalized[stats].sum(axis=1)
top_players_normalized = df_stats_normalized.nlargest(15, 'TotalScore')
top_players_original = df_stats[df_stats['Player'].isin(top_players_normalized['Player'])]

# Prepare data for radar chart
categories = stats
fig = go.Figure()

# Set the number of players to be visible initially
initial_visible_players = 3

counter = 0

for i, row in top_players_normalized.iterrows():
    player = row['Player']
    
    # Get normalized and actual (non-normalized) values
    normalized_values = row[stats].values.tolist()
    original_values = top_players_original[top_players_original['Player'] == player][stats].values.flatten().tolist()
    
    # Create axis-specific hover text with normalized values
    axis_hover_texts = [f"{stat}: {value:.2f}" for stat, value in zip(stats, normalized_values)]
    
    # Create custom hover text for full player area with actual values
    player_hover_text = f"{player}<br>" + "<br>".join([f"{stat}: {value:.2f}" for stat, value in zip(stats, original_values)])
    
    # Determine initial visibility: show first 3 players, hide others
    visible = True if counter < initial_visible_players else "legendonly"
    counter += 1
    
    # Add trace for each player
    fig.add_trace(go.Scatterpolar(
        r=normalized_values,
        theta=categories,
        fill='toself',
        name=player,
        opacity=0.6,
        hovertext=axis_hover_texts,  # Axis-specific hover text for points
        hoverinfo="text",
        customdata=[[player_hover_text]] * len(categories),  # Full stats hover text for scatterpolar area
        hovertemplate="%{customdata[0]}<extra></extra>",  # Show the full player stats when hovering over area
        visible=visible
    ))

# Update chart layout
fig.update_layout(
    title="Offensive Ability of Top 15 Players (Normalized)",
    polar=dict(
        radialaxis=dict(visible=True, range=[0, 1]),
        bgcolor="rgba(240,240,240,0.8)"
    ),
    showlegend=True,
    legend=dict(title="Players", itemclick="toggle", itemdoubleclick="toggleothers"),
    font=dict(size=14)
)

# Show the chart
fig.show()
