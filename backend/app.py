from flask import Flask, request, jsonify
from flask_pymongo import PyMongo
from flask_cors import CORS

app = Flask(__name__)
CORS(app)

# 配置 MongoDB Atlas 連線
app.config["MONGO_URI"] = "mongodb+srv://<username>:<password>@cluster0.mongodb.net/mydatabase?retryWrites=true&w=majority"
mongo = PyMongo(app)

# 接收並儲存使用者資料
@app.route('/api/save-user', methods=['POST'])
def save_user():
    data = request.json
    if not data:
        return jsonify({"error": "No data provided"}), 400

    # 將資料存入 MongoDB
    mongo.db.users.insert_one(data)
    return jsonify({"message": "User saved successfully!"}), 201

if __name__ == '__main__':
    app.run(debug=True)
