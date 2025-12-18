import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatbotComponent } from 'pharma-genie-chatbot';

@Component({
  selector: 'app-nlp-chat',
  standalone: true,
  imports: [CommonModule, ChatbotComponent],
  templateUrl: './nlp-chat.component.html',
  styleUrls: ['./nlp-chat.component.css']
})
export class NlpChatComponent {
  chatConfig = {
    apiUrl: 'http://localhost:3000',
    theme: 'light' as const,
    position: 'bottom-right' as const,
    enableExport: true,
    welcomeMessage: 'Hello! I\'m PharmaGenie. Ask me about clinical trials, drug studies, and research data.'
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
}
