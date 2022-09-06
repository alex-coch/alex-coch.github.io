import pickle
from flask import Flask, render_template, redirect, url_for
from flask_bootstrap import Bootstrap
from flask_wtf import FlaskForm
from wtforms import StringField, SubmitField, SelectField
from wtforms.validators import DataRequired, URL

application = Flask(__name__)
application.config['SECRET_KEY'] = '8BYkEfBA6O6donzWlSihBXox7C0sKR6b'
Bootstrap(application)

class MForm(FlaskForm):
    data1 = StringField('Cafe name1', validators=[DataRequired()])
    data2 = StringField('Cafe name2', validators=[DataRequired()])
    data3 = StringField('Cafe name3', validators=[DataRequired()])
    submit = SubmitField('Submit')

@application.route("/", methods=["GET", "POST"])
def index():
    form = MForm()
    ret = ""
    if form.validate_on_submit():
        with open('boston_housing_model.pkl', 'rb') as f:
            reg = pickle.load(f)
        # Produce a matrix for client data
        print(form.data1, form.data2, form.data3) // todo(alex): <input id="data1" name="data1" required type="text" value="1"> <input id="data2" name="data2" required type="text" value="2"> <input id="data3" name="data3" required type="text" value="3">
        client_data = list(map(float, [form.data1, form.data2, form.data3]))

        # for i, price in enumerate(reg.predict(client_data)):
        price = reg.predict(client_data)
        ret = "Predicted selling price for Client's home: ${pp:.2f}".format(pp=price)
        # return ret
        # return render_template('index.html')
    # return redirect(url_for('index'))
    return render_template('index.html', form=form, ret=ret)
    # return render_template('add.html', form=form)


if __name__ == "__main__":
    # application.run(host='0.0.0.0', port='8080')
    application.run(debug='on')
