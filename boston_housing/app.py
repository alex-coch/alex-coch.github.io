from flask import Flask
import pickle


application = Flask(__name__)


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
        ret += f"Predicted selling price for Client {i+1}'s home: ${price:.2f}<br>"
    return ret


if __name__ == "__main__":
    application.run(host='0.0.0.0', port='8080')
