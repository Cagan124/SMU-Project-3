# Import the dependencies.
from flask import Flask, jsonify, render_template
import pandas as pd
from sqlHelper import SQLHelper

#################################################
# Flask Setup
#################################################
app = Flask(__name__)
sqlHelper = SQLHelper() # initialize the database helper

@app.route("/")
def home_page():
    return render_template("landing_page.html")

@app.route("/dashboard")
def dash_page():
    return render_template("index.html")

@app.route("/api/v1.0/<house_type>/<price>/<num_beds>/<num_baths>/<price_by_sqft>/<distance>")
def get_data(house_type, price, num_beds, num_baths, price_by_sqft, distance):
    print(house_type, price, num_beds, num_baths, price_by_sqft, distance)

    price = int(price)
    num_beds = int(num_beds)
    num_baths = int(num_baths)
    price_by_sqft = int(price_by_sqft)
    distance = int(distance)

    # execute the queries
    data_map = sqlHelper.getMapData(house_type, price, num_beds, num_baths, price_by_sqft, distance)
    data_bar = sqlHelper.getBarData(house_type, price, num_beds, num_baths, price_by_sqft, distance)
    data_scatter = sqlHelper.getScatterData(house_type, price, num_beds, num_baths, price_by_sqft, distance)

    data = {"map_data": data_map,
            "bar_data": data_bar,
            "scatter_data": data_scatter }

    return jsonify(data)

@app.route("/about_us")
def about_us():
    return render_template("about_us.html")




#################################################
# Execute the App
#################################################
if __name__ == "__main__":
    app.run(debug=True)