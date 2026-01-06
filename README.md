# Dressmatch - AI 穿搭建议网站

本项目允许用户上传帽子、上衣、裤子、鞋四种单品的图片，选择风格（上班族、日韩风、休闲、商务、聚会），系统通过 OpenAI 大模型识别图片内容并给出另外三件单品的穿搭建议。

## 技术栈
- 后端：Flask + OpenAI API
- 前端：React

## 启动方式

### 1. 后端（Flask）
```bash
# 进入项目根目录
python -m venv venv
# Windows 激活虚拟环境
venv\Scripts\activate
pip install flask flask-cors openai
# 设置 OpenAI API Key（建议用环境变量）
set OPENAI_API_KEY=sk-你的APIKEY
python app.py
```

### 2. 前端（React）
```bash
cd frontend
npm install
npm start
```

前端默认端口为 3000，后端为 5000。

## 注意事项
- 需自备 OpenAI API Key，建议用环境变量管理。
- 若需跨端口访问，已在 Flask 端启用 CORS。
- 若遇到端口冲突，请自行调整。

## 目录结构
```
├── app.py           # Flask 后端主程序
├── frontend/        # React 前端
├── uploads/         # 图片上传临时目录
└── README.md
```
