import streamlit as st
import streamlit.components.v1 as components


st.set_page_config(
    page_title="NEXORA'26 · Campus Hub",
    page_icon="🎓",
    layout="wide",
    initial_sidebar_state="collapsed",
)

st.markdown(
    """
    <style>
      #MainMenu, footer, header { visibility: hidden; }
      .stApp, [data-testid="stAppViewContainer"], [data-testid="stMain"] {
        background: #0a1418;
      }
      [data-testid="stMain"] > div {
        padding: 0;
      }
      iframe {
        display: block;
        border: 0;
      }
    </style>
    """,
    unsafe_allow_html=True,
)

components.iframe(
    "https://campushub-orpin.vercel.app/",
    height=1000,
    scrolling=True,
    tab_index=0,
)
