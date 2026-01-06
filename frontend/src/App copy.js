import React, { useState } from 'react';
import './App.css';

const STYLE_OPTIONS = ["上班族", "日韩风", "欧美范","休闲", "商务", "聚会"];

function App() {
  const [image, setImage] = useState(null);
  const [style, setStyle] = useState(STYLE_OPTIONS[0]);
  const [gender, setGender] = useState('男');
  const [suggestion, setSuggestion] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [previewUrl, setPreviewUrl] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setSuggestion('');
    setError('');
    if (file) {
      setPreviewUrl(URL.createObjectURL(file));
    } else {
      setPreviewUrl(null);
    }
  };

  const handleStyleChange = (e) => {
    setStyle(e.target.value);
    setSuggestion('');
    setError('');
  };

  const handleGenderChange = (e) => {
    setGender(e.target.value);
    setSuggestion('');
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!image) {
      setError('请先上传图片');
      return;
    }
    setLoading(true);
    setSuggestion('');
    setError('');
    const formData = new FormData();
    formData.append('image', image);
    formData.append('style', style);
    formData.append('gender', gender);
    try {
      //const res = await fetch('http://localhost:2688/api/suggest', {
      const res = await fetch('/api/suggest', {
        method: 'POST',
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setSuggestion(data.suggestion);
      } else {
        setError(data.error || '请求失败');
      }
    } catch (err) {
      setError('网络错误: ' + (err && err.message ? err.message : JSON.stringify(err)));
    }
    setLoading(false);
  };

  return (
    <div className="App">
      <h1>AI 穿搭建议</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>上传单品图片（帽子/上衣/裤子/鞋）：</label>
          <input type="file" accept="image/*" onChange={handleImageChange} />
        </div>
        {previewUrl && (
          <div style={{marginBottom: '18px'}}>
            <img src={previewUrl} alt="预览" style={{maxWidth: '100%', maxHeight: 220, borderRadius: 8, boxShadow: '0 1px 6px rgba(0,0,0,0.08)'}} />
          </div>
        )}
        <div style={{display: 'flex', alignItems: 'center', gap: '16px'}}>
          <div>
            <label>选择风格：</label>
            <select value={style} onChange={handleStyleChange}>
              {STYLE_OPTIONS.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
          </div>
          <div>
            <label>性别：</label>
            <select value={gender} onChange={handleGenderChange}>
              <option value="男">男</option>
              <option value="女">女</option>
            </select>
          </div>
        </div>
        <button type="submit" disabled={loading}>提交</button>
      </form>
      {loading && <p>正在分析，请稍候...</p>}
      {error && <p style={{color: 'red'}}>{error}</p>}
      {suggestion && (
        <div className="suggestion">
          <h2>AI 穿搭建议：</h2>
          <pre style={{textAlign: 'left', whiteSpace: 'pre-wrap'}}>{suggestion}</pre>
        </div>
      )}
    </div>
  );
}

export default App;
