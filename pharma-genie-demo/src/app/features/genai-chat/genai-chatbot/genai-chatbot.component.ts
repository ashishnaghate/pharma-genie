import { Component, OnInit, signal, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { GenAIChatService } from '../genai-chat.service';
import { Nl2brPipe } from '../../../shared/pipes/nl2br.pipe';

@Component({
  selector: 'app-genai-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule, Nl2brPipe],
  templateUrl: './genai-chatbot.component.html',
  styleUrls: ['./genai-chatbot.component.css']
})
export class GenAIChatbotComponent implements OnInit, AfterViewChecked {
  @ViewChild('messagesContainer') messagesContainer?: ElementRef;
  
  isOpen = false;
  userInput = signal('');
  private shouldScroll = false;

  // Expose service signals
  messages = this.chatService.messages;
  loading = this.chatService.loading;
  error = this.chatService.error;

  constructor(public chatService: GenAIChatService) {}

  ngOnInit(): void {
    console.log('🤖 GenAI Chatbot Initialized - Direct HCL AI Cafe integration');
  }

  ngAfterViewChecked(): void {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    const message = this.userInput().trim();
    if (!message) return;

    this.shouldScroll = true;
    this.chatService.sendMessage(message);
    this.userInput.set('');
  }

  clearChat(): void {
    this.chatService.clearMessages();
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  formatTimestamp(date: Date): string {
    return new Date(date).toLocaleTimeString('en-US', {
      hour: '2-digit',
      minute: '2-digit'
    });
  }

  private scrollToBottom(): void {
    if (this.messagesContainer) {
      const element = this.messagesContainer.nativeElement;
      element.scrollTop = element.scrollHeight;
    }
  }
}
