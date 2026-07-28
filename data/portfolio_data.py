# This file is the ONLY place you should edit to update your portfolio's content.
# Keeping data separate from HTML means the templates never need to change
# when you just want to add a new project or skill.

PROFILE = {
    "name": "Kiran Kanor",
    "role": "Python Developer",
    "tagline": "I build backend systems and tools with Python.",
    "email": "you@example.com",
    "socials": {
        "github": "https://github.com/yourusername",
        "linkedin": "https://linkedin.com/in/yourusername",
    },
}

ABOUT = (
    "A short paragraph about who you are, what you work on, "
    "and what you're currently learning or interested in."
)

# A list of dicts -> Jinja2 will loop over this to render each skill icon/badge.
# Add or remove entries here; no template changes needed.
SKILLS = [
    "Python", "Flask", "FastAPI", "SQL", "Docker", "Git", "Linux", "uv",
]

# Same idea for projects: each dict becomes one project card in the grid.
PROJECTS = [
    {
        "title": "Project One",
        "description": "One or two sentences describing the problem it solves.",
        "tech": ["Python", "Flask"],
        "link": "https://github.com/yourusername/project-one",
    },
    {
        "title": "Project Two",
        "description": "One or two sentences describing the problem it solves.",
        "tech": ["Python", "FastAPI", "PostgreSQL"],
        "link": "https://github.com/yourusername/project-two",
    },
]
