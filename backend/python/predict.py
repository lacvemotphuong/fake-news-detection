import os
import sys
import pickle

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# LOAD TF-IDF
with open(os.path.join(BASE_DIR, "tfidf_vectorizer.pkl"), "rb") as f:
    vectorizer = pickle.load(f)

with open(os.path.join(BASE_DIR, "fake_news_model.pkl"), "rb") as f:
    model = pickle.load(f)

# Nhận text từ NodeJS
text = sys.argv[1]

# Transform text
vec = vectorizer.transform([text])

# Predict
prediction = model.predict(vec)[0]

# Trả kết quả cho NodeJS
if prediction == 1:
    print("REAL NEWS")
else:
    print("FAKE NEWS")
