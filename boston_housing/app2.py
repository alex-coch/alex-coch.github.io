import pickle
from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired, URL

application = Flask(__name__)
application.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap(application)

class CafeForm(FlaskForm):
    cafe1 = StringField('Cafe name1', validators=[DataRequired()])
    cafe2 = StringField('Cafe name2', validators=[DataRequired()])
    cafe3 = StringField('Cafe name3', validators=[DataRequired()])
    # location = StringField("Cafe Location on Google Maps (URL)", validators=[DataRequired(), URL()])
    # open = StringField("Opening Time e.g. 8AM", validators=[DataRequired()])
    # close = StringField("Closing Time e.g. 5:30PM", validators=[DataRequired()])
    # coffee_rating = SelectField("Coffee Rating", choices=["☕️", "☕☕", "☕☕☕", "☕☕☕☕", "☕☕☕☕☕"], validators=[DataRequired()])
    # wifi_rating = SelectField("Wifi Strength Rating", choices=["✘", "💪", "💪💪", "💪💪💪", "💪💪💪💪", "💪💪💪💪💪"], validators=[DataRequired()])
    # power_rating = SelectField("Power Socket Availability", choices=["✘", "🔌", "🔌🔌", "🔌🔌🔌", "🔌🔌🔌🔌", "🔌🔌🔌🔌🔌"], validators=[DataRequired()])
    submit = SubmitField('Submit')

@application.route("/")
def index():
    with open('boston_housing_model.pkl', 'rb') as f:
        reg = pickle.load(f)
    # Produce a matrix for client data
    client_data = [[5, 17, 15],  # Client 1
                   [4, 32, 22],  # Client 2
                   [8, 3, 12]]   # Client 3
    ret = ""
    for i, price in enumerate(reg.predict(client_data)):
        ret += "Predicted selling price for Client {ii}'s home: ${pp:.2f}<br>".format(ii = i+1, pp = price)
    # return ret
    return render_template('index.html')

@application.route('/add', methods=["GET", "POST"])
def add_cafe():
    form = CafeForm()
    if form.validate_on_submit():
        # return redirect(url_for('cafes'))
        return render_template('index.html')
    return render_template('add.html', form=form)

if __name__ == "__main__":
    # application.run(host='0.0.0.0', port='8080')
    application.run(debug='on')
