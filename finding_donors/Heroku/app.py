import pickle

import numpy as np
import pandas as pd
from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import SubmitField, IntegerField
from wtforms.validators import NumberRange

application = Flask(__name__)
application.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap(application)


class MForm(FlaskForm):
    data1 = IntegerField("Capital-loss (Ex 0)", validators=[NumberRange(min=0, max=4346)])
    data2 = IntegerField("Age (Ex 31)", validators=[NumberRange(min=1, max=90)])
    data3 = IntegerField("Capital-gain (Ex 14000)", validators=[NumberRange(min=1, max=99999)])
    data4 = IntegerField("Hours per week (Ex 40)", validators=[NumberRange(min=1, max=99)])
    data5 = IntegerField("Education num (Ex 13)", validators=[NumberRange(min=1, max=16)])
    submit = SubmitField('Submit')


@application.route("/", methods=["GET", "POST"])
def index():
    form = MForm()
    ret = ""
    if form.validate_on_submit():
        with open('finding_donors.pkl', 'rb') as f:
            reg = pickle.load(f)
        client_data = np.array(
            [form.data1.data / 4356, form.data2.data / 73, form.data3.data / 99999, form.data4.data / 98,
             form.data5.data / 15]).reshape(1, -1)
        print(client_data)
        # scaler = MinMaxScaler()
        # df = scaler.fit_transform(client_data)
        # df.columns = ['age', 'education-num', 'capital-gain', 'capital-loss', 'hours-per-week']
        # print(df)
        res = reg.predict(client_data)
        ret = f"An individual makes more than $50,000: {'Yes' if res[0] == 1 else 'No'}"

    return render_template('index.html', form=form, ret=ret)


if __name__ == "__main__":
    application.run(host='0.0.0.0', port='8080')
    # application.run(debug='on')
