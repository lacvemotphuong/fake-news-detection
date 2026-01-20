import os
import sys
import json
import joblib

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# LOAD TF-IDF
vectorizer = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))
model = joblib.load(os.path.join(BASE_DIR, "fake_news_model.pkl"))

# Nhận text từ NodeJS
text = sys.argv[1]

# Transform text
vec = vectorizer.transform([text])

# Predict label
prediction = model.predict(vec)[0]

# Predict probability (QUAN TRỌNG)
probability = model.predict_proba(vec)[0][prediction]

# Mapping
label = "REAL NEWS" if prediction == 1 else "FAKE NEWS"

# Trả JSON cho NodeJS
result = {
    "label": label,
    "probability": round(float(probability), 4)
}

print(json.dumps(result))
