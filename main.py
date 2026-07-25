import os
import joblib
import pandas as pd

from flask import Flask, render_template, request

from sklearn.model_selection import StratifiedShuffleSplit
from sklearn.pipeline import Pipeline
from sklearn.compose import ColumnTransformer
from sklearn.impute import SimpleImputer
from sklearn.preprocessing import StandardScaler, OneHotEncoder
from sklearn.linear_model import LogisticRegression

app = Flask(__name__)

MODEL_FILE = 'model.pkl'
PIPELINE_FILE = 'pipeline.pkl'

if ((not os.path.exists(MODEL_FILE)) or (not os.path.exists(PIPELINE_FILE))):
    df = pd.read_csv("Loan_Approval.csv")
    X = df.drop("LoanApproved", axis=1)
    y = df["LoanApproved"]

    split = StratifiedShuffleSplit(n_splits=1, test_size=0.2, random_state=42)

    for train_idx, test_idx in split.split(X, y):
        X_train, y_train = X.loc[train_idx], y.loc[train_idx]

    num_attribs = X_train.drop(['EmploymentStatus', 'EducationLevel', 'MaritalStatus', 'HomeOwnershipStatus', 'LoanPurpose'], axis=1).columns.tolist()
    cat_attribs = ['EmploymentStatus', 'EducationLevel', 'MaritalStatus', 'HomeOwnershipStatus', 'LoanPurpose']

    num_pipeline = Pipeline([
        ('imputer', SimpleImputer(strategy='median')),
        ('scaler', StandardScaler())
    ])
    cat_pipeline = Pipeline([
        ('onehot', OneHotEncoder(handle_unknown='ignore'))
    ])
    full_pipeline = ColumnTransformer([
        ("num", num_pipeline, num_attribs),
        ("cat", cat_pipeline, cat_attribs)
    ])

    features_prepared = full_pipeline.fit_transform(X_train)
    model = LogisticRegression(
        solver='newton-cg',
        max_iter=500,
        C=100
    )
    model.fit(features_prepared, y_train)

    joblib.dump(model, MODEL_FILE)
    joblib.dump(full_pipeline, PIPELINE_FILE)
else:
    model = joblib.load(MODEL_FILE)
    full_pipeline = joblib.load(PIPELINE_FILE)

@app.route("/")
def home():
    return render_template("index.html")

@app.route("/predict", methods=["GET", "POST"])
def predict():
    if (request.method == "POST"):
        print(request.form)
        user_data = {
            "Age": int(request.form["Age"]),
            "CreditScore": int(request.form["CreditScore"]),
            "EmploymentStatus": request.form["EmploymentStatus"],
            "EducationLevel": request.form["EducationLevel"],
            "Experience": int(request.form["Experience"]),
            "LoanAmount": int(request.form["LoanAmount"]),
            "LoanDuration": int(request.form["LoanDuration"]),
            "MaritalStatus": request.form["MaritalStatus"],
            "NumberOfDependents": int(request.form["NumberOfDependents"]),
            "HomeOwnershipStatus": request.form["HomeOwnershipStatus"],
            "MonthlyDebtPayments": int(request.form["MonthlyDebtPayments"]),
            "CreditCardUtilizationRate": float(request.form["CreditCardUtilizationRate"]),
            "NumberOfOpenCreditLines": int(request.form["NumberOfOpenCreditLines"]),
            "NumberOfCreditInquiries": int(request.form["NumberOfCreditInquiries"]),
            "BankruptcyHistory": int(request.form["BankruptcyHistory"]),
            "LoanPurpose": request.form["LoanPurpose"],
            "PreviousLoanDefaults": int(request.form["PreviousLoanDefaults"]),
            "PaymentHistory": int(request.form["PaymentHistory"]),
            "LengthOfCreditHistory": int(request.form["LengthOfCreditHistory"]),
            "SavingsAccountBalance": int(request.form["SavingsAccountBalance"]),
            "CheckingAccountBalance": int(request.form["CheckingAccountBalance"]),
            "TotalAssets": int(request.form["TotalAssets"]),
            "TotalLiabilities": int(request.form["TotalLiabilities"]),
            "MonthlyIncome": float(request.form["MonthlyIncome"]),
            "UtilityBillsPaymentHistory": float(request.form["UtilityBillsPaymentHistory"]),
            "JobTenure": int(request.form["JobTenure"])
        }

        data = pd.DataFrame([user_data])
        prepared_data = full_pipeline.transform(data)
        prediction = model.predict(prepared_data)[0]

        if (prediction == 1):
            result = "Loan Approved"
        else:
            result = "Loan Rejected"
        return render_template("predict.html", prediction=result)
    return render_template("predict.html")

@app.route("/dashboard")
def dashboard():
    return render_template("dashboard.html")

if __name__ == "__main__":
    app.run(debug=True)
