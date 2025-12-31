// This script will be run within the webview itself
// It cannot access the main VS Code APIs directly.

(function () {
    const vscode = acquireVsCodeApi();

    const settingsButton = /** @type {HTMLElement} */ (document.getElementById('settings-button'));
    const todoList = /** @type {HTMLElement} */ (document.getElementById('todo-items'));
    const chatHistory = /** @type {HTMLElement} */ (document.getElementById('chat-history'));
    const chatInput = /** @type {HTMLInputElement} */ (document.getElementById('chat-input'));

    const oldState = vscode.getState() || { chat: '', todo: '' };
    if (chatHistory) {
      chatHistory.innerHTML = oldState.chat;
    }
    if (todoList) {
      todoList.innerHTML = oldState.todo;
    }

    if (settingsButton) {
      settingsButton.addEventListener('click', () => {
        vscode.postMessage({
          command: 'camber.openSettings'
        });
      });
    }

    if (chatInput && todoList && chatHistory) {
      // Handle chat input
      chatInput.addEventListener('keydown', (event) => {
          if (event.key === 'Enter') {
              const message = chatInput.value;
              chatInput.value = '';
  
              // Add user message to chat history
              const userMessage = document.createElement('div');
              userMessage.textContent = `You: ${message}`;
              chatHistory.appendChild(userMessage);
  
              // Send message to extension
              vscode.postMessage({
                  command: 'newChatMessage',
                  text: message
              });
              vscode.setState({ chat: chatHistory.innerHTML, todo: todoList.innerHTML });
          }
      });
  
      // Handle messages from the extension
      window.addEventListener('message', event => {
          const message = event.data;
          switch (message.command) {
              case 'aiResponse':
                  const aiMessage = document.createElement('div');
                  aiMessage.textContent = `AI: ${message.text}`;
                  chatHistory.appendChild(aiMessage);
                  break;
              case 'updateTodo':
                  const todoItem = document.createElement('li');
                  todoItem.textContent = message.text;
                  todoList.appendChild(todoItem);
                  break;
          }
          vscode.setState({ chat: chatHistory.innerHTML, todo: todoList.innerHTML });
      });
    }
}());
