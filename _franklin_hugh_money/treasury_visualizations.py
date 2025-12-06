import matplotlib.pyplot as plt
import plotly.graph_objects as go
import plotly.express as px
from plotly.subplots import make_subplots
import numpy as np
import pandas as pd

# Data preparation
raw_data = {
    'Federal Reserve': 6.5,
    'Intragovernmental Holdings': 6.8,
    'Foreign Official Holders': 8.5,
    'U.S. Mutual Funds & ETFs': 6.8,
    'U.S. Banks & Depositories': 4.5,
    'Pension Funds': 2.5,
    'Insurance/State/Local/Other': 2.0
}

# Normalize to exactly $36T
total = sum(raw_data.values())
scale_factor = 36.0 / total
data = {k: v * scale_factor for k, v in raw_data.items()}

# Calculate percentages
percentages = {k: (v / 36.0) * 100 for k, v in data.items()}

# Professional color palette
colors_palette = [
    '#2E5090',  # Federal Reserve - Deep blue
    '#4A6FA5',  # Intragovernmental - Medium blue
    '#E65100',  # Foreign - Deep orange
    '#2E7D32',  # Mutual Funds - Deep green
    '#43A047',  # Banks - Medium green
    '#66BB6A',  # Pension - Light green
    '#9E9E9E'   # Other - Gray
]

# 1. PIE CHART
plt.style.use('seaborn-v0_8-white')
fig1, ax1 = plt.subplots(figsize=(12, 8))

# Sort data for consistent ordering
sorted_items = sorted(data.items(), key=lambda x: x[1], reverse=True)
labels_pie = [f'{k}\n${v:.1f}T ({percentages[k]:.1f}%)' for k, v in sorted_items]
sizes = [v for k, v in sorted_items]

# Explode top 3
explode = [0.15 if i == 0 else 0.1 if i < 3 else 0 for i in range(len(sizes))]

wedges, texts, autotexts = ax1.pie(
    sizes,
    labels=labels_pie,
    explode=explode,
    colors=colors_palette,
    autopct='',
    startangle=45,
    shadow=True,
    textprops={'fontsize': 11, 'fontweight': 'bold', 'fontfamily': 'Segoe UI'}
)

# Add white borders
for w in wedges:
    w.set_edgecolor('white')
    w.set_linewidth(2)

plt.title('Who Owns the $36 Trillion U.S. Treasury Market?',
          fontsize=18, fontweight='bold', pad=20, fontfamily='Segoe UI')
plt.tight_layout()
plt.show()

# 2. TREEMAP
fig2 = go.Figure(go.Treemap(
    labels=[k for k in data.keys()],
    parents=[""] * len(data),
    values=list(data.values()),
    text=[f"<b>{k}</b><br>${v:.1f}T<br>{percentages[k]:.1f}%"
          for k, v in data.items()],
    textfont=dict(size=14, family='Segoe UI'),
    marker=dict(
        colorscale='Viridis',
        cmid=6,
        line=dict(width=2, color='white')
    ),
    hovertemplate='<b>%{label}</b><br>Value: $%{value:.1f} Trillion<br>Share: %{percentile}<extra></extra>',
    textposition='middle center'
))

fig2.update_layout(
    title={
        'text': 'U.S. Treasury Ownership Distribution - Treemap View',
        'font': {'size': 18, 'family': 'Segoe UI', 'color': '#333'}
    },
    height=600,
    width=1000,
    margin=dict(l=10, r=10, t=50, b=10)
)
fig2.show()

# 3. SANKEY DIAGRAM
# Define nodes
source_nodes = []
target_nodes = []
values_flow = []
node_colors = []

# Create node labels
node_labels = [
    "U.S. Treasury Debt<br>$36T",  # 0
    "U.S. Government<br>$13.0T (36%)",  # 1
    "Domestic Private<br>$14.2T (39%)",  # 2
    "Foreign Holders<br>$8.8T (24%)",  # 3
    f"Federal Reserve<br>${data['Federal Reserve']:.1f}T",  # 4
    f"Intragovernmental<br>${data['Intragovernmental Holdings']:.1f}T",  # 5
    f"Foreign Official<br>${data['Foreign Official Holders']:.1f}T",  # 6
    f"Mutual Funds & ETFs<br>${data['U.S. Mutual Funds & ETFs']:.1f}T",  # 7
    f"Banks & Depositories<br>${data['U.S. Banks & Depositories']:.1f}T",  # 8
    f"Pension Funds<br>${data['Pension Funds']:.1f}T",  # 9
    f"Insurance/Other<br>${data['Insurance/State/Local/Other']:.1f}T"  # 10
]

# Node colors
node_color_list = [
    '#808080',  # Treasury (gray)
    '#2E5090',  # Government (blue)
    '#2E7D32',  # Domestic (green)
    '#E65100',  # Foreign (orange)
    '#2E5090',  # Fed (blue)
    '#4A6FA5',  # Intra (light blue)
    '#E65100',  # Foreign (orange)
    '#2E7D32',  # Mutual (green)
    '#43A047',  # Banks (green)
    '#66BB6A',  # Pension (green)
    '#81C784'   # Other (light green)
]

# Define flows
# From Treasury to categories
source_nodes.extend([0, 0, 0])
target_nodes.extend([1, 2, 3])
values_flow.extend([
    data['Federal Reserve'] + data['Intragovernmental Holdings'],
    data['U.S. Mutual Funds & ETFs'] + data['U.S. Banks & Depositories'] +
    data['Pension Funds'] + data['Insurance/State/Local/Other'],
    data['Foreign Official Holders']
])

# From categories to specific holders
# Government to specific
source_nodes.extend([1, 1])
target_nodes.extend([4, 5])
values_flow.extend([data['Federal Reserve'], data['Intragovernmental Holdings']])

# Domestic to specific
source_nodes.extend([2, 2, 2, 2])
target_nodes.extend([7, 8, 9, 10])
values_flow.extend([
    data['U.S. Mutual Funds & ETFs'],
    data['U.S. Banks & Depositories'],
    data['Pension Funds'],
    data['Insurance/State/Local/Other']
])

# Foreign to specific
source_nodes.append(3)
target_nodes.append(6)
values_flow.append(data['Foreign Official Holders'])

fig3 = go.Figure(data=[go.Sankey(
    node=dict(
        pad=15,
        thickness=30,
        line=dict(color="white", width=1),
        label=node_labels,
        color=node_color_list,
        hovertemplate='%{label}<extra></extra>'
    ),
    link=dict(
        source=source_nodes,
        target=target_nodes,
        value=values_flow,
        color=['rgba(46, 80, 144, 0.4)'] * 2 + ['rgba(46, 125, 50, 0.4)'] * 4 +
              ['rgba(230, 81, 0, 0.4)'] + ['rgba(46, 80, 144, 0.3)'] * 2 +
              ['rgba(46, 125, 50, 0.3)'] * 4 + ['rgba(230, 81, 0, 0.3)'],
        hovertemplate='$%{value:.1f} Trillion<extra></extra>'
    )
)])

fig3.update_layout(
    title={
        'text': "U.S. Treasury Ownership Flow - From Issuance to Holders",
        'font': {'size': 18, 'family': 'Segoe UI', 'color': '#333'}
    },
    font=dict(size=12, family='Segoe UI'),
    height=700,
    width=1200,
    margin=dict(l=10, r=10, t=60, b=10)
)
fig3.show()

# 4. DONUT CHART (Nested)
# Inner donut data
gov_total = data['Federal Reserve'] + data['Intragovernmental Holdings']
non_gov_total = 36.0 - gov_total

# Create subplots for donut effect
fig4 = make_subplots(
    rows=1, cols=1,
    specs=[[{'type': 'pie'}]]
)

# Outer ring - detailed breakdown
fig4.add_trace(go.Pie(
    labels=list(data.keys()),
    values=list(data.values()),
    hole=0.4,
    marker=dict(colors=colors_palette, line=dict(color='white', width=2)),
    textfont=dict(size=11, family='Segoe UI'),
    textposition='outside',
    textinfo='label+percent',
    hovertemplate='<b>%{label}</b><br>$%{value:.1f}T<br>%{percent}<extra></extra>',
    sort=False,
    direction='clockwise'
))

# Inner ring - government vs non-government
fig4.add_trace(go.Pie(
    labels=['U.S. Government<br>(Fed + Intragovt)', 'Non-Government<br>(Private + Foreign)'],
    values=[gov_total, non_gov_total],
    hole=0.75,
    marker=dict(colors=['#3F51B5', '#FF6F00'], line=dict(color='white', width=3)),
    textfont=dict(size=13, family='Segoe UI', color='white'),
    textposition='inside',
    textinfo='percent',
    hovertemplate='<b>%{label}</b><br>$%{value:.1f}T<br>%{percent}<extra></extra>',
    domain=dict(x=[0.2, 0.8], y=[0.2, 0.8]),
    sort=False
))

fig4.update_layout(
    title={
        'text': 'U.S. Treasury Ownership: Government vs. Non-Government Holdings',
        'font': {'size': 18, 'family': 'Segoe UI', 'color': '#333'}
    },
    annotations=[
        dict(
            text='<b>$36T</b><br>Total',
            x=0.5, y=0.5,
            font=dict(size=24, family='Segoe UI', color='#333'),
            showarrow=False
        )
    ],
    height=700,
    width=900,
    margin=dict(l=100, r=100, t=80, b=50),
    showlegend=True,
    legend=dict(
        orientation="v",
        yanchor="middle",
        y=0.5,
        xanchor="left",
        x=1.1,
        font=dict(size=11, family='Segoe UI')
    )
)

fig4.show()

# COMBINED VIEW - All visualizations in one window
from IPython.display import display, HTML

display(HTML("""
<div style='background: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;'>
    <h2 style='font-family: Segoe UI; color: #333; text-align: center;'>
        U.S. Treasury Market Ownership Analysis - Complete Dashboard
    </h2>
    <p style='font-family: Segoe UI; color: #666; text-align: center; font-size: 14px;'>
        December 2025 | Total Market Size: $36 Trillion
    </p>
</div>
"""))

print("\n✅ All visualizations have been generated successfully!")
print("\n📊 Summary of Holdings:")
print("-" * 50)
for holder, amount in sorted(data.items(), key=lambda x: x[1], reverse=True):
    print(f"{holder:30s} ${amount:5.1f}T ({percentages[holder]:5.1f}%)")
print("-" * 50)
print(f"{'TOTAL':30s} $36.0T (100.0%)")