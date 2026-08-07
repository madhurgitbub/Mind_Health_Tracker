# 🧠 Mind Health Tracker

An AI-powered Mental Health Tracker that helps users monitor their mental well-being through machine learning. The application analyzes user responses and predicts the mental health condition, providing an easy-to-use dashboard for tracking results.

---

## 🚀 Features

- 🔐 User Authentication (Login & Registration)
- 🧠 AI-based Mental Health Prediction
- 📊 Real-time Prediction Results
- 📈 Mental Health Progress Tracking
- 👤 User Dashboard
- 📜 Prediction History
- 📱 Responsive User Interface
- ⚡ FastAPI Backend
- 🤖 Machine Learning Model Integration

---



> Replace these images with your own screenshots.

---

## 🛠️ Tech Stack

### Frontend
- React.js
- HTML5
- CSS3
- JavaScript
- Axios

### Backend
- FastAPI
- Python
- Uvicorn

### Machine Learning
- Scikit-learn
- Pandas
- NumPy
- Joblib

### Database
- SQLite / MongoDB *(Update according to your project)*

---

## 📂 Project Structure

```
Mind_Health_Tracker/
│
├── frontend/
│   ├── src/
│   ├── public/
│   └── package.json
│
├── backend/
│   ├── main.py
│   ├── model/
│   ├── routes/
│   ├── requirements.txt
│   └── saved_model.pkl
│
├── dataset/
├── screenshots/
└── README.md
```

---

## ⚙️ Installation

### Clone Repository

```bash
git clone https://github.com/madhurgitbub/Mind_Health_Tracker.git

cd Mind_Health_Tracker
```

---

## Backend Setup

Create Virtual Environment

```bash
python -m venv venv
```

Activate Environment

Windows

```bash
venv\Scripts\activate
```

Linux / Mac

```bash
source venv/bin/activate
```

Install Dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI

```bash
uvicorn main:app --reload
```

Backend URL

```
http://127.0.0.1:8000
```

Swagger API

```
http://127.0.0.1:8000/docs
```

---

## Frontend Setup

```bash
cd frontend
npm install
npm start
```

---

## Machine Learning Model

The prediction model is trained using **Scikit-learn**.

Libraries used:

- Pandas
- NumPy
- Scikit-learn
- Joblib

Model Workflow:

```
Dataset
      ↓
Data Cleaning
      ↓
Feature Engineering
      ↓
Model Training
      ↓
Model Saving (.pkl)
      ↓
FastAPI Integration
      ↓
Prediction API
```

---

## API Endpoints

| Method | Endpoint | Description |
|---------|----------|-------------|
| POST | /predict | Predict Mental Health |
| GET | /history | User Prediction History |
| POST | /login | User Login |
| POST | /register | User Registration |

---

## Future Improvements

- 📊 Prediction Analytics Dashboard
- 🌙 Dark Mode
- 📱 Mobile Application
- 🤖 AI Chatbot Support
- 📈 Weekly & Monthly Reports
- 📄 PDF Report Download
- 📧 Email Notifications

---

## Requirements

```
fastapi
uvicorn
pydantic
pandas
numpy
scikit-learn
joblib
python-multipart
```

Install

```bash
pip install -r requirements.txt
```

---

## Contributing

Contributions are welcome!

1. Fork the repository
2. Create a feature branch

```bash
git checkout -b feature-name
```

3. Commit changes

```bash
git commit -m "Added new feature"
```

4. Push

```bash
git push origin feature-name
```

5. Open a Pull Request

---

## Author

**Madhur Pratap Singh**

GitHub:
https://github.com/madhurgitbub

LinkedIn:
(Add your LinkedIn URL)

---

## License

This project is licensed under the MIT License.

---

⭐ If you found this project useful, don't forget to **Star** the repository!
