import os
import pandas as pd
import joblib
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# Load Excel
df = pd.read_excel(os.path.join(BASE_DIR, "wwfnd_cleaned_dataset.xlsx"))

X = df["clean_text"]
y = df["Label"]

tfidf = TfidfVectorizer(max_features=5000, stop_words="english")
X_tfidf = tfidf.fit_transform(X)

model = LogisticRegression(max_iter=1000)
model.fit(X_tfidf, y)

# Lưu ĐÚNG vào backend/python
joblib.dump(tfidf, os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))
joblib.dump(model, os.path.join(BASE_DIR, "fake_news_model.pkl"))

print("✅ Model & TF-IDF đã lưu vào backend/python")
