from flask import Flask, render_template, request, jsonify
import json

app = Flask(__name__)

# Загружаем базу знаний при старте
with open('knowledge_base.json', 'r', encoding='utf-8') as f:
    knowledge_base = json.load(f)


@app.route('/')
def index():
    """Главная страница с чат-ботом"""
    return render_template(
        'index.html',
        faq=knowledge_base['faq'],
        links=knowledge_base['useful_links']
    )


@app.route('/ask', methods=['POST'])
def ask_question():
    """Обработка вопроса от пользователя"""
    user_question = request.form.get('question', '').lower().strip()

    # Простой поиск по базе знаний
    for item in knowledge_base['faq']:
        if user_question in item['question'].lower():
            return jsonify({'answer': item['answer']})

    return jsonify({
        'answer': 'Извините, я пока не знаю ответ на этот вопрос. Обратитесь в деканат или студсовет.'
    })


@app.route('/map')
def show_map():
    """Страница с интерактивной картой"""
    return render_template('map.html')


@app.route('/faq_full')
def faq_full():
    """Полный список вопросов"""
    return render_template(
        "faq_full.html",
        faq=knowledge_base['faq']
    )


if __name__ == '__main__':
    print("=== Сервер запускается ===")
    print("Откройте в браузере: http://localhost:5000")
    print("Для остановки нажмите Ctrl+C")
    print("==========================")
    app.run(
        host='0.0.0.0',
        debug=True,
        port = 5000)
