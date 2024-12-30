# 🤖 Luna AI Assistant

![Luna AI Assistant](https://avatars.mds.yandex.net/get-shedevrum/11270697/img_35562168f51811ee9c9f02ef0e3e4bf4/orig?auto=format&fit=crop&q=80&w=2000&h=400)

A sophisticated AI assistant powered by the Llama 70B model, featuring voice interaction, continuous learning, and real-time conversation logging. Luna is designed to be an intelligent, feminine AI companion with natural language understanding and generation capabilities.

## ✨ Features

- 🧠 **Advanced Language Model**: Powered by Llama 70B for human-like interactions
- 🎯 **Real-time Voice Interaction**: Natural speech recognition and synthesis
- 📚 **Continuous Learning**: Self-improving capabilities through interaction
- 💾 **Persistent Memory**: Conversation and learning data storage
- 📊 **Real-time Logging**: Comprehensive activity tracking
- 🎨 **Modern UI**: Clean, responsive interface with dark mode

## 🛠️ Technology Stack

- **Frontend**: React + TypeScript + Vite
- **Styling**: Tailwind CSS
- **AI Model**: Llama 70B (via @xenova/transformers)
- **Storage**: IndexedDB (via Dexie.js)
- **Speech**: Web Speech API
- **Threading**: Web Workers + Comlink

## 🚀 Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:

```bash
git clone https://github.com/Drago-03/Luna-App.git
cd Luna-App
```

2. Install dependencies:

```bash
npm install
```

3. Start the development server:

```bash
npm run dev
```

## 🏗️ Architecture

Luna is built with a modular architecture focusing on maintainability and scalability:

```
src/
├── services/          # Core service implementations
│   ├── lunaCore.ts   # Main AI processing logic
│   ├── modelService.ts    # LLM integration
│   └── speechService.ts   # Voice interaction
├── workers/          # Web Worker implementations
│   └── model.worker.ts    # Background AI processing
├── db/              # Database schemas and setup
│   └── database.ts
├── utils/           # Utility functions
│   ├── logger.ts    # Logging system
│   └── tokenizer.ts # Text processing
└── App.tsx         # Main UI component
```

## 🎯 Core Features

### Voice Interaction

Luna uses the Web Speech API for natural voice interactions, supporting both speech recognition and synthesis with a feminine voice profile.

### Continuous Learning

The system implements a training pipeline that allows Luna to learn from conversations and improve over time. Learning data is stored persistently and can be used for model fine-tuning.

### Real-time Logging

Comprehensive logging system tracks all interactions, model responses, and system events for monitoring and debugging.

## 🔒 Privacy & Security

- All processing happens locally in the browser
- Conversation data is stored in IndexedDB on the user's device
- No data is sent to external servers without explicit permission

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request. For major changes, please open an issue first to discuss what you would like to change.

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Llama](https://github.com/facebookresearch/llama) by Meta AI
- [Transformers.js](https://github.com/xenova/transformers.js)
- [Lucide Icons](https://lucide.dev/)

---

<div align="center">Made by Drago</div>
