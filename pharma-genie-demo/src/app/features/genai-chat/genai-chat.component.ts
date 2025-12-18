import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GenAIChatbotComponent } from './genai-chatbot/genai-chatbot.component';

@Component({
  selector: 'app-genai-chat',
  standalone: true,
  imports: [CommonModule, GenAIChatbotComponent],
  templateUrl: './genai-chat.component.html',
  styleUrls: ['./genai-chat.component.css']
})
export class GenAIChatComponent {
  exampleQueries = [
    'Tell me about Phase III clinical trials for diabetes',
    'What drugs are currently in our database?',
    'Show me information about trial CT-2024-001',
    'What are the most common adverse events reported?',
    'Explain the trial site capabilities',
    'How many participants are enrolled in active trials?'
  ];
}
