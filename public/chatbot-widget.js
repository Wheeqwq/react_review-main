const ChatbotWidget = () => {
    const [isOpen, setIsOpen] = React.useState(false);
    const [position, setPosition] = React.useState({ x: window.innerWidth - 70, y: window.innerHeight - 70 });
    const [dragging, setDragging] = React.useState(false);
    const [offset, setOffset] = React.useState({ x: 0, y: 0 });
  
    const handleMouseDown = (e) => {
      setDragging(true);
      setOffset({ x: e.clientX - position.x, y: e.clientY - position.y });
    };
  
    const handleMouseMove = (e) => {
      if (!dragging) return;
      setPosition({ x: e.clientX - offset.x, y: e.clientY - offset.y });
    };
  
    const handleMouseUp = () => {
      setDragging(false);
    };
  
    React.useEffect(() => {
      window.addEventListener("mousemove", handleMouseMove);
      window.addEventListener("mouseup", handleMouseUp);
      return () => {
        window.removeEventListener("mousemove", handleMouseMove);
        window.removeEventListener("mouseup", handleMouseUp);
      };
    }, [dragging]);
  
    return (
      <div>
        {/* 拖曳的 icon */}
        <div
          style={{
            position: "fixed",
            left: `${position.x}px`,
            top: `${position.y}px`,
            width: "50px",
            height: "50px",
            backgroundColor: "#007bff",
            borderRadius: "50%",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            color: "white",
            cursor: "grab",
            userSelect: "none",
            zIndex: 1000,
          }}
          onMouseDown={handleMouseDown}
          onClick={() => setIsOpen(!isOpen)}
        >
          💬
        </div>
  
        {/* 聊天室窗 */}
        {isOpen && (
          <div
            style={{
              position: "fixed",
              bottom: "80px",
              right: "20px",
              width: "300px",
              height: "400px",
              backgroundColor: "white",
              boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
              borderRadius: "8px",
              overflow: "hidden",
              zIndex: 999,
            }}
          >
            <iframe
              src="http://localhost:5000/chat"
              style={{ width: "100%", height: "100%", border: "none" }}
            ></iframe>
          </div>
        )}
      </div>
    );
  };
  
  const container = document.getElementById("chatbot-container");
  const root = ReactDOM.createRoot(container);
  root.render(React.createElement(ChatbotWidget));
  