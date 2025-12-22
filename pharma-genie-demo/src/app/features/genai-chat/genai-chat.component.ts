import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from 'pharma-genie-chatbot';

@Component({
  selector: 'app-genai-chat',
  standalone: true,
  imports: [CommonModule, ChatbotComponent],
  templateUrl: './genai-chat.component.html',
  styleUrls: ['./genai-chat.component.css']
})
export class GenAIChatComponent implements OnInit {
  chatConfig = {
    apiUrl: 'http://localhost:3000',
    mode: 'genai' as const,
    theme: 'light' as const,
    position: 'bottom-right' as const,
    enableExport: true,  // ✅ Enable export for GenAI mode
    welcomeMessage: 'Hello! I\'m PharmaGenie\'s GenAI assistant, powered by HCL AI Cafe. Ask me anything!',
    clearOnInit: true  // Clear chat history when component loads
  };
  exampleQueries = [
    'Tell me about Phase III clinical trials for diabetes',
    'What drugs are currently in our database?',
    'Show me information about trial CT-2024-001',
    'What are the most common adverse events reported?',
    'Explain the trial site capabilities',
    'How many participants are enrolled in active trials?'
  ];

  ngOnInit(): void {
    // Component initialized - chatbot will handle clearing based on clearOnInit flag
  }
}
