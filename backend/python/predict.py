import os
import sys
import json
import joblib

# PATHS
BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# LOAD MODEL + VECTORIZER
vectorizer = joblib.load(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"))
model = joblib.load(os.path.join(BASE_DIR, "fake_news_model.pkl"))

# READ TEXT FROM STDIN (NODEJS)
text = sys.stdin.read().strip()

if not text:
    print(json.dumps({
        "label": "UNKNOWN",
        "fake_probability": 0.0,
        "real_probability": 0.0
    }))
    sys.exit(0)

# TRANSFORM
vec = vectorizer.transform([text])

# PREDICT
proba = model.predict_proba(vec)[0]
fake_prob = float(proba[0])
real_prob = float(proba[1])

# DECISION LOGIC 
THRESHOLD = 0.6

if fake_prob >= THRESHOLD:
    label = "FAKE"
elif real_prob >= THRESHOLD:
    label = "REAL"
else:
    label = "UNCERTAIN"

# RETURN JSON (ONLY JSON)
result = {
    "label": label,
    "fake_probability": round(fake_prob, 4),
    "real_probability": round(real_prob, 4)
}

print(json.dumps(result))
