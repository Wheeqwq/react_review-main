(function () {
    if (document.getElementById("chatbot-container")) return;
  
    const chatbotContainer = document.createElement("div");
    chatbotContainer.id = "chatbot-container";
    document.body.appendChild(chatbotContainer);
  
    const reactScript = document.createElement("script");
    reactScript.src = "https://unpkg.com/react@18/umd/react.production.min.js";
    document.body.appendChild(reactScript);
  
    const reactDomScript = document.createElement("script");
    reactDomScript.src = "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js";
    document.body.appendChild(reactDomScript);
  
    reactDomScript.onload = () => {
      const chatbotScript = document.createElement("script");
      chatbotScript.src = "http://localhost:5000/chatbot-widget.js";
      document.body.appendChild(chatbotScript);
    };
  })();
  