import sys
import json
import torch
from transformers import AutoTokenizer, AutoModelForSequenceClassification
import joblib
import re
import os
import pandas as pd
from sklearn.metrics.pairwise import cosine_similarity


sys.stdout.reconfigure(encoding="utf-8")
sys.stderr.reconfigure(encoding="utf-8")

BASE_DIR = os.path.dirname(os.path.abspath(__file__))

# global variables to hold models, vectorizer, dataset, tfidf matrix
tfidf_vectorizer = None
tfidf_model = None
tokenizer = None
phobert_model = None
dataset = None
tfidf_matrix = None

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# load tfidf model va vectorizer, neu co loi thi bo qua phan nay
try:

    vec_path = os.path.join(BASE_DIR, "tfidf_vectorizer.pkl")
    model_path = os.path.join(BASE_DIR, "tfidf_fake_news_model.pkl")

    if os.path.exists(vec_path) and os.path.exists(model_path):

        tfidf_vectorizer = joblib.load(vec_path)
        tfidf_model = joblib.load(model_path)

    else:
        print("TFIDF model files not found", file=sys.stderr)

except Exception as e:
    print(f"TFIDF load error: {e}", file=sys.stderr)

# load dataset va tinh tfidf matrix de tim link lien quan nhanh hon, neu co loi thi bo qua phan nay
try:

    fake_path = os.path.join(BASE_DIR, "all_fake_news.csv")
    real_path = os.path.join(BASE_DIR, "all_real_news.csv")

    if os.path.exists(fake_path) and os.path.exists(real_path):

        fake_df = pd.read_csv(fake_path)
        real_df = pd.read_csv(real_path)

        fake_df["label"] = 1
        real_df["label"] = 0

        dataset = pd.concat([fake_df, real_df], ignore_index=True)

        if tfidf_vectorizer is not None:
            tfidf_matrix = tfidf_vectorizer.transform(dataset["text"].astype(str))

    else:
        print("Dataset files not found", file=sys.stderr)

except Exception as e:
    print(f"Dataset load error: {e}", file=sys.stderr)


# load phobert model 
try:

    phobert_path = os.path.join(BASE_DIR, "phobert_fake_news_final")

    if os.path.exists(phobert_path):

        tokenizer = AutoTokenizer.from_pretrained(phobert_path)
        phobert_model = AutoModelForSequenceClassification.from_pretrained(phobert_path)

        phobert_model.to(device)
        phobert_model.eval()

    else:
        print("PhoBERT folder not found", file=sys.stderr)

except Exception as e:
    print(f"PhoBERT load error: {e}", file=sys.stderr)


# ham tien xu ly text don gian, loai bo ky tu dac biet, chuyen ve thuong, xoa khoang trang thua
def clean_text(text):

    if not isinstance(text, str):
        text = str(text)

    text = re.sub(r"[^\w\s:/?=&%.-]", "", text)
    text = re.sub(r"\s+", " ", text).strip().lower()

    return text


# tìm link liên quan dựa trên cosine similarity của tfidf, trả về top_k link nếu có
def find_related_links(text, top_k=3):

    if dataset is None or tfidf_matrix is None:
        return []

    try:

        vec = tfidf_vectorizer.transform([text])

        sim = cosine_similarity(vec, tfidf_matrix)

        idx = sim.argsort()[0][-top_k:][::-1]

        links = []

        for i in idx:

            if "url" in dataset.columns:
                links.append(dataset.iloc[i]["url"])

        return links

    except:
        return []

# predict tfidf du doan xem co phai tin gia hay khong, tra ve ket qua va xac suat
def predict_tfidf(text):

    if tfidf_model is None or tfidf_vectorizer is None:
        return {"error": "TFIDF model not loaded"}

    try:

        cleaned = clean_text(text)

        vec = tfidf_vectorizer.transform([cleaned])

        pred = int(tfidf_model.predict(vec)[0])

        prob = float(tfidf_model.predict_proba(vec)[0][1])

        return {
            "prediction": pred,
            "probability_fake": prob
        }

    except Exception as e:
        return {"error": str(e)}


# predict phobert du doan xem co phai tin gia hay khong, tra ve ket qua va xac suat
def predict_phobert(text):

    if phobert_model is None or tokenizer is None:
        return {"error": "PhoBERT model not loaded"}

    try:

        inputs = tokenizer(
            text,
            return_tensors="pt",
            truncation=True,
            padding=True,
            max_length=256
        )

        inputs = {k: v.to(device) for k, v in inputs.items()}

        with torch.no_grad():
            outputs = phobert_model(**inputs)

        probs = torch.softmax(outputs.logits, dim=1)

        pred = int(torch.argmax(probs, dim=1).item())

        prob_fake = float(probs[0][1].item())

        return {
            "prediction": pred,
            "probability_fake": prob_fake
        }

    except Exception as e:
        return {"error": str(e)}


# ham chinh de chay tu command line 
if __name__ == "__main__":

    try:

        if len(sys.argv) < 3:
            raise Exception("Usage: python predict.py <text> <model_type>")

        text = sys.argv[1]
        model_type = sys.argv[2].lower()

        result = {
            "input_text": text
        }

        if model_type in ["tfidf", "both"]:
            result["tfidf"] = predict_tfidf(text)

        if model_type in ["phobert", "both"]:
            result["phobert"] = predict_phobert(text)

        # tìm link liên quan
        result["related_links"] = find_related_links(text)

        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:

        print(json.dumps({
            "error": str(e)
        }, ensure_ascii=False))