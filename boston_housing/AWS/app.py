import pickle

import numpy as np
from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import SubmitField, IntegerField
from wtforms.validators import DataRequired, URL, NumberRange

application = Flask(__name__)
application.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap(application)


class MForm(FlaskForm):
    data1 = IntegerField("'RM' is the average number of rooms among homes in the neighborhood (Ex 5)",
                         validators=[DataRequired(), NumberRange(min=1)])
    data2 = IntegerField("'LSTAT' is the percentage of homeowners in the neighborhood considered 'lower class' (Ex 17)",
                         [DataRequired(), NumberRange(min=1)])
    data3 = IntegerField(
        "'PTRATIO' is the ratio of students to teachers in primary and secondary schools in the neighborhood (Ex 15)",
        [DataRequired(), NumberRange(min=1)])
    submit = SubmitField('Submit')


@application.route("/", methods=["GET", "POST"])
def index():
    form = MForm()
    ret = ""
    if form.validate_on_submit():
        with open('boston_housing_model.pkl', 'rb') as f:
            reg = pickle.load(f)
        client_data = np.array([form.data1.data, form.data2.data, form.data3.data]).reshape(1, -1)
        price = reg.predict(client_data)
        ret = f"Predicted selling price for the home: ${float(price[0]):.2f}"

    return render_template('index.html', form=form, ret=ret)


if __name__ == "__main__":
    application.run(host='0.0.0.0', port='8080')
    # application.run(debug='on')
