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

# biến toàn cục để lưu model, vectorizer, dataset và tfidf matrix, tránh load lại nhiều lần khi predict nhiều lần
tfidf_vectorizer = None
tfidf_models = {}   # ✅ sửa: lưu nhiều model
tokenizer = None
phobert_model = None
dataset = None
tfidf_matrix = None

device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# load tfidf model va vectorizer
try:

    vec_path = os.path.join(BASE_DIR, "vectorizer.pkl")

    if os.path.exists(vec_path):

        tfidf_vectorizer = joblib.load(vec_path)

        # load nhiều model
        model_files = {
            "lr": "model_lr.pkl",
            "nb": "model_nb.pkl",
            "svm": "model_svm.pkl",
            "rf": "model_rf.pkl"
        }

        for key, file_name in model_files.items():
            path = os.path.join(BASE_DIR, file_name)
            if os.path.exists(path):
                tfidf_models[key] = joblib.load(path)
            else:
                print(f"{file_name} not found", file=sys.stderr)

    else:
        print("TFIDF vectorizer not found", file=sys.stderr)

except Exception as e:
    print(f"TFIDF load error: {e}", file=sys.stderr)

# load dataset va tinh tfidf matrix de tim link lien quan nhanh hon
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

# ham tien xu ly text don gian
def clean_text(text):

    if not isinstance(text, str):
        text = str(text)

    text = re.sub(r"[^\w\s:/?=&%.-]", "", text)
    text = re.sub(r"\s+", " ", text).strip().lower()

    return text

# tìm link liên quan
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

# predict tfidf nhiều model
def predict_tfidf(text):

    if not tfidf_models or tfidf_vectorizer is None:
        return {"error": "TFIDF models not loaded"}

    results = {}

    try:

        cleaned = clean_text(text)
        vec = tfidf_vectorizer.transform([cleaned])

        for name, model in tfidf_models.items():

            pred = int(model.predict(vec)[0])

            if hasattr(model, "predict_proba"):
                prob = float(model.predict_proba(vec)[0][1])
            else:
                prob = None

            results[name] = {
                "prediction": pred,
                "probability_fake": prob
            }

        return results

    except Exception as e:
        return {"error": str(e)}

# predict phobert
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

# main
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

        result["related_links"] = find_related_links(text)

        print(json.dumps(result, ensure_ascii=False))

    except Exception as e:

        print(json.dumps({
            "error": str(e)
        }, ensure_ascii=False))