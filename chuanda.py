import os
from flask import Flask, request, jsonify
from flask_cors import CORS
import openai
import logging
import traceback

app = Flask(__name__)
CORS(app)

# 配置 OpenAI API Key（建议用环境变量管理）
openai.api_key = os.getenv('OPENAI_API_KEY')  # TODO: 替换为你的API Key 或用环境变量

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif'}

STYLE_OPTIONS = ["上班族", "日韩风", "欧美范","休闲", "商务", "聚会"]

UPLOAD_FOLDER = 'uploads'
os.makedirs(UPLOAD_FOLDER, exist_ok=True)

logging.basicConfig(level=logging.INFO, format='%(asctime)s %(levelname)s %(message)s')


def allowed_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_EXTENSIONS

@app.route('/api/suggest', methods=['POST'])
def suggest():
    logging.info(f"收到请求: files={request.files}, form={request.form}")
    if 'image' not in request.files:
        logging.warning('未上传图片')
        return jsonify({'error': 'No image uploaded'}), 400
    image = request.files['image']
    style = request.form.get('style')
    gender = request.form.get('gender', '男')
    if not style or style not in STYLE_OPTIONS:
        logging.warning(f'风格参数无效: {style}')
        return jsonify({'error': 'Invalid style'}), 400
    if gender not in ['男', '女']:
        logging.warning(f'性别参数无效: {gender}')
        return jsonify({'error': 'Invalid gender'}), 400
    if image and allowed_file(image.filename):
        image_path = os.path.join(UPLOAD_FOLDER, image.filename)
        image.save(image_path)
        try:
            with open(image_path, 'rb') as img_file:
                response = openai.chat.completions.create(
                    model="gpt-4.1",
                    messages=[
                        {"role": "system", "content": "你是一个时尚穿搭顾问。"},
                        {"role": "user", "content": [
                            {"type": "text", "text": f"请识别这张图片是什么单品（帽子/上衣/裤子/鞋），性别为'{gender}'，并根据风格'{style}'，给出另外三件单品的详细穿搭建议，务必考虑性别因素。"},
                            {"type": "image_url", "image_url": {"url": f"data:image/jpeg;base64,{image_to_base64(image_path)}"}}
                        ]}
                    ],
                    max_tokens=500
                )
            suggestion = response.choices[0].message.content
            # 新增：判断识别结果是否为帽子、上衣、裤子、鞋
            valid_items = ['帽子', '上衣', '裤子', '鞋']
            import re
            match = re.search(r'(帽子|上衣|裤子|鞋)', suggestion)
            if not match:
                logging.warning('未识别为帽子、上衣、裤子或鞋')
                return jsonify({'error': '未识别为帽子、上衣、裤子或鞋，请上传正确的时尚单品照片。'}), 400

            logging.info('AI建议生成成功')
            return jsonify({'suggestion': suggestion})
        except Exception as e:
            logging.error("发生异常: %s", traceback.format_exc())
            return jsonify({'error': str(e)}), 500
    else:
        logging.warning('文件类型无效')
        return jsonify({'error': 'Invalid file type'}), 400

def image_to_base64(image_path):
    import base64
    with open(image_path, 'rb') as img_f:
        return base64.b64encode(img_f.read()).decode('utf-8')

if __name__ == '__main__':
    ## app.run(debug=True, host='0.0.0.0', port=2688)
    app.run(debug=True, port=2688) 