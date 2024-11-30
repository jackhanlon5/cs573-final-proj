import dash
import dash_core_components as dcc
import dash_html_components as html
from dash.dependencies import Input, Output
import pandas as pd
import plotly.graph_objects as go
from sklearn.preprocessing import MinMaxScaler

# Load data
df = pd.read_csv("D:/CS573 - Data Viz/cs573-final-proj/datasets/nba_player_data.csv")

# Select relevant stats
stats = ['PTS', 'FG%', '3P%', 'eFG%', 'FT%', 'AST']
df_stats = df[['Player'] + stats]

# Normalize statistics for radar chart but keep original values for tooltips
scaler = MinMaxScaler()
df_stats_normalized = df_stats.copy()
df_stats_normalized[stats] = scaler.fit_transform(df_stats[stats])

# Prepare data for radar chart
categories = stats

# Initialize the Dash app
app = dash.Dash(__name__)

# Layout for the app
app.layout = html.Div([
    html.H1("Player Comparison - Offensive Ability"),
    
    # Dropdowns for selecting the players
    html.Div([
        html.Label("Select Left Player:"),
        dcc.Dropdown(
            id='left-player-dropdown',
            options=[{'label': player, 'value': player} for player in df['Player']],
            value=df['Player'].iloc[0],  # Default value
            style={'width': '48%', 'display': 'inline-block'}
        ),
        html.Label("Select Right Player:"),
        dcc.Dropdown(
            id='right-player-dropdown',
            options=[{'label': player, 'value': player} for player in df['Player']],
            value=df['Player'].iloc[1],  # Default value
            style={'width': '48%', 'display': 'inline-block'}
        ),
    ], style={'display': 'flex', 'justify-content': 'space-between', 'margin-bottom': '20px'}),
    
    # The radar chart will be displayed here with increased size
    dcc.Graph(
        id='radar-chart',
        config={'responsive': True},  # Makes the chart responsive to screen size
        style={'height': '80vh', 'width': '90vw'}  # Adjusts chart to take up 80% of the viewport height and 90% of the viewport width
    ),
])

# Function to create the radar chart
def create_radar_chart(left_player, right_player):
    fig = go.Figure()

    # Add trace for the left player
    row_left = df_stats_normalized[df_stats_normalized['Player'] == left_player].iloc[0]
    normalized_values_left = row_left[stats].values.tolist()
    fig.add_trace(go.Scatterpolar(
        r=normalized_values_left,
        theta=categories,
        fill='toself',
        name=left_player,
        opacity=0.6,
        hoverinfo="text",
        customdata=[[left_player]] * len(categories),
        hovertemplate="Player: %{customdata[0]}<br>" + "<br>".join([f"{stat}: {value:.2f}" for stat, value in zip(stats, normalized_values_left)]) + "<extra></extra>"
    ))

    # Add trace for the right player
    row_right = df_stats_normalized[df_stats_normalized['Player'] == right_player].iloc[0]
    normalized_values_right = row_right[stats].values.tolist()
    fig.add_trace(go.Scatterpolar(
        r=normalized_values_right,
        theta=categories,
        fill='toself',
        name=right_player,
        opacity=0.6,
        hoverinfo="text",
        customdata=[[right_player]] * len(categories),
        hovertemplate="Player: %{customdata[0]}<br>" + "<br>".join([f"{stat}: {value:.2f}" for stat, value in zip(stats, normalized_values_right)]) + "<extra></extra>"
    ))

    # Update layout for the radar chart
    fig.update_layout(
        polar=dict(
            radialaxis=dict(visible=True, range=[0, 1]),
            bgcolor="rgba(240,240,240,0.8)"
        ),
        showlegend=True,
        title="Offensive Ability Comparison",
        font=dict(size=14)
    )

    return fig

# Dash callback to update the chart based on selected players
@app.callback(
    Output('radar-chart', 'figure'),
    Input('left-player-dropdown', 'value'),
    Input('right-player-dropdown', 'value')
)
def update_chart(left_player, right_player):
    return create_radar_chart(left_player, right_player)

# Run the app
if __name__ == '__main__':
    app.run_server(debug=True)
