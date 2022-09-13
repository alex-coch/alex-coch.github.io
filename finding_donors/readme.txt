capital-loss 0.0
age 31
capital-gain 14084.0
hours-per-week 40.0
education-num 13.0

# Import sklearn.preprocessing.StandardScaler
from sklearn.preprocessing import MinMaxScaler

# Initialize a scaler, then apply it to the features
scaler = MinMaxScaler()
numerical = ['age', 'education-num', 'capital-gain', 'capital-loss', 'hours-per-week']
features_raw = pd.DataFrame(scaler.fit_transform(data[numerical]))
features_raw.columns = numerical

# Show an example of a record with scaling applied
features_raw.head(n = 10)


X1 = X_test_reduced.head(10)
clf.predict(X1) 
