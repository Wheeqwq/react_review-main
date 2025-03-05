const express = require("express");
const cors = require("cors");
const { spawn } = require("child_process");
const path = require("path");

const app = express();
app.use(cors()); 
app.use(express.json());

app.use(express.static(path.join(__dirname, "../dist")));

app.get("/chat", (req, res) => {
  res.setHeader("Content-Type", "text/event-stream");
  res.setHeader("Cache-Control", "no-cache");
  res.setHeader("Connection", "keep-alive");

  const userMessage = req.query.message;
  if (!userMessage) {
    res.write("data: 請輸入內容\n\n");
    res.write("data: [END]\n\n");
    res.end();
    return;
  }

  console.log(`收到使用者訊息: ${userMessage}`);

  const ollamaProcess = spawn("ollama", ["run", "ycchen/breeze-7b-instruct-v1_0:latest"], {
    shell: true,
    stdio: ["pipe", "pipe", "pipe"],
  });

  ollamaProcess.stdin.write(userMessage + "\n");
  ollamaProcess.stdin.end();

  // ✅ 讓回應逐步顯示
  ollamaProcess.stdout.on("data", (data) => {
    const response = data.toString().trim();
    if (response) {
      console.log(`AI 回應: ${response}`);
      res.write(`data: ${response}\n\n`);
    }
  });

  // 錯誤處理
  // ollamaProcess.stderr.on("data", (data) => {
  //   console.error("Ollama 錯誤:", data.toString());
  //   res.write(`data: [ERROR] ${data.toString()}\n\n`);
  // });

  ollamaProcess.stderr.on("data", (data) => {
    console.error("Ollama 錯誤:", data.toString());
    // 不回傳錯誤訊息給前端，只在伺服器端記錄錯誤
  });
  

  // 當 Ollama 結束時，發送 [END] 標記給前端
  ollamaProcess.on("close", (code) => {
    console.log(`Ollama 結束，代碼: ${code}`);
    res.write("data: [END]\n\n");
    res.end();
  });

  ollamaProcess.on("error", (err) => {
    console.error("無法啟動 Ollama:", err);
    res.write("data: [ERROR] 伺服器錯誤，無法啟動 AI\n\n");
    res.write("data: [END]\n\n");
    res.end();
  });
});

app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "../dist/index.html"));
});

app.listen(5000, () => {
  console.log("Server is running on http://localhost:5000");
});
