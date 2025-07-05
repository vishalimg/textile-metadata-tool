
document.getElementById('imageUpload').addEventListener('change', function (e) {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (evt) {
      document.getElementById('preview').src = evt.target.result;
      generateMetadata(evt.target.result);
    };
    reader.readAsDataURL(file);
  }
});

function generateMetadata(base64Image) {
  const apiKey = localStorage.getItem('openai_api_key') || prompt("Enter your OpenAI API Key:");
  if (apiKey) localStorage.setItem('openai_api_key', apiKey);
  else return alert("API key is required");

  fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": "Bearer " + apiKey
    },
    body: JSON.stringify({
      model: "gpt-4-vision-preview",
      messages: [
        {
          role: "user",
          content: [
            { type: "text", text: "Analyze this textile design and give Headline, Title, Details, Keywords in English." },
            { type: "image_url", image_url: { url: base64Image } }
          ]
        }
      ],
      max_tokens: 500
    })
  })
  .then(res => res.json())
  .then(data => {
    const content = data.choices?.[0]?.message?.content || "";
    const lines = content.split("\n").filter(Boolean);
    lines.forEach(line => {
      if (line.toLowerCase().startsWith("headline")) document.getElementById('headline').textContent = line.split(":")[1]?.trim();
      if (line.toLowerCase().startsWith("title")) document.getElementById('title').textContent = line.split(":")[1]?.trim();
      if (line.toLowerCase().startsWith("details")) document.getElementById('details').textContent = line.split(":")[1]?.trim();
      if (line.toLowerCase().startsWith("keywords")) document.getElementById('keywords').textContent = line.split(":")[1]?.trim();
    });
  })
  .catch(err => alert("API Error: " + err.message));
}

function copyText(id) {
  const text = document.getElementById(id).textContent;
  navigator.clipboard.writeText(text).then(() => alert(id + " copied!"));
}
