from flask import Flask, render_template

# Import the content as plain Python data. The route below just hands it
# to the template -- app.py contains no HTML and no personal content.
from data.portfolio_data import PROFILE, ABOUT, SKILLS, PROJECTS

app = Flask(__name__)


@app.route("/")
def home():
    # render_template looks inside the templates/ folder for index.html
    # and passes these variables in so Jinja2 can use them with {{ }} syntax.
    return render_template(
        "index.html",
        profile=PROFILE,
        about=ABOUT,
        skills=SKILLS,
        projects=PROJECTS,
    )


if __name__ == "__main__":
    # debug=True gives auto-reload on file save and better error pages
    # while you're developing locally. Turn this off before deploying.
    app.run(debug=True)
