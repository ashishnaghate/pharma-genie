import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from 'pharma-genie-chatbot';

@Component({
  selector: 'app-nlp-chat',
  standalone: true,
  imports: [CommonModule, ChatbotComponent],
  templateUrl: './nlp-chat.component.html',
  styleUrls: ['./nlp-chat.component.css']
})
export class NlpChatComponent implements OnInit {
  chatConfig = {
    apiUrl: 'http://localhost:3000',
    mode: 'nlp' as const,  // Explicitly set NLP mode
    theme: 'light' as const,
    position: 'bottom-right' as const,
    enableExport: true,
    welcomeMessage: 'Hello! I\'m PharmaGenie. Ask me about clinical trials, drug studies, and research data.',
    clearOnInit: true  // Clear chat history when component loads
  };

  exampleQueries = [
    'Show all active clinical trials',
    'Find Phase III diabetes studies',
    'List recruiting trials',
    'Trials for drug ABC123',
    'How many trials are recruiting?',
    'Show me CT-2024-001',
    'Active phase 3 diabetes trials',
    'Completed COVID-19 studies',
    'Hypertension trials',
    'Cancer research phase 1'
  ];

  ngOnInit(): void {
    // Component initialized - chatbot will handle clearing based on clearOnInit flag
  }
}
