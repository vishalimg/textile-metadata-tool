
document.getElementById('imageUpload').addEventListener('change', async function (e) {
  const file = e.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = function (event) {
    const img = document.createElement('img');
    img.src = event.target.result;
    document.getElementById('imagePreview').innerHTML = '';
    document.getElementById('imagePreview').appendChild(img);
  };
  reader.readAsDataURL(file);

  const formData = new FormData();
  formData.append('file', file);

  const apiKey = 'sk-proj-YOUR_KEY_HERE';

  try {
    const response = await fetch('https://api.openai.com/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: "gpt-4-vision-preview",
        messages: [
          {
            role: "user",
            content: [
              { type: "text", text: "Generate textile design headline, title, details, and keywords." },
              { type: "image_url", image_url: { url: URL.createObjectURL(file) } }
            ]
          }
        ],
        max_tokens: 500
      })
    });

    const result = await response.json();
    const text = result.choices[0].message.content;
    const lines = text.split('\n');

    const output = {
      headline: lines[0] || '',
      title: lines[1] || '',
      details: lines[2] || '',
      keywords: lines[3] || ''
    };

    for (let key in output) {
      document.getElementById(key).textContent = output[key];
    }
  } catch (err) {
    alert('Error: ' + err.message);
  }
});

function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text);
}
