import sqlalchemy
from sqlalchemy import create_engine, func, inspect, text
import pandas as pd

class SQLHelper():

    def __init__(self):
        self.engine = create_engine("sqlite:///Resources/NYC_House_db.sqlite")

    def getWhereClause(self, house_type, price, num_beds, num_baths, price_by_sqft, distance):
        # allow the user to select ALL or a specific house type
        if house_type == "All":
            where_clause1 = "1=1"
        else:
            where_clause1 = f"House_Type = '{house_type}'"
        # Allow the user to select ALL or specify a maximum price
        if price is not None:
            where_clause2 = f"PRICE <= {price}"
        else:
            where_clause2 = "1=1"
        # Allow the user to select ALL or specify a maximum number of bedrooms
        if num_beds is not None:
            where_clause3 = f"BEDS <= {num_beds}"
        else:
            where_clause3 = "1=1"
        # Allow the user to select ALL or specify a maximum number of bathrooms
        if num_baths is not None:
            where_clause4 = f"BATH <= {num_baths}"
        else:
            where_clause4 = "1=1"
        # Allow the user to select ALL or specify a maximum price per square foot
        if price_by_sqft is not None:
            where_clause5 = f"PRICE_BY_SQFT <= {price_by_sqft}"
        else:
            where_clause5 = "1=1"
        # Allow the user to select ALL or specify a maximum distance
        if distance is not None:
            where_clause6 = f"Distance <= {distance}"
        else:
            where_clause6 = "1=1"

        where_clause = f"{where_clause1} AND {where_clause2} AND {where_clause3} AND {where_clause4} AND {where_clause5} AND {where_clause6}"

        return(where_clause)

    def getMapData(self, house_type, price, num_beds, num_baths, price_by_sqft, distance):
    
        where_clause = self.getWhereClause(house_type, price, num_beds, num_baths, price_by_sqft, distance)

        query = f"""
                SELECT
                    *
                FROM
                    NYC_Houses
                WHERE
                    {where_clause};
        """
        print(query)

        df_map = pd.read_sql(text(query), con=self.engine)
        data_map = df_map.to_dict(orient="records")

        return(data_map)
    
    def getBarData(self, house_type, price, num_beds, num_baths, price_by_sqft, distance):
         
        where_clause = self.getWhereClause(house_type, price, num_beds, num_baths, price_by_sqft, distance)
            
        query = f"""
                SELECT
                    *
                FROM
                    NYC_Houses
                WHERE
                    {where_clause}
                ORDER BY
                    PRICE desc
                LIMIT 10;
        """

        df_bar = pd.read_sql(text(query), con=self.engine)
        data_bar = df_bar.to_dict(orient="records")

        return(data_bar)
    
    def getScatterData(self, house_type, price, num_beds, num_baths, price_by_sqft, distance):
        
        where_clause = self.getWhereClause(house_type, price, num_beds, num_baths, price_by_sqft, distance)
            
        query = f"""
                SELECT
                    *
                FROM
                    NYC_Houses
                WHERE
                    {where_clause};
        """

        df_scatter = pd.read_sql(text(query), con=self.engine)
        data_scatter = df_scatter.to_dict(orient="records")

        return(data_scatter)
