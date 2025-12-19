import { Component, OnInit, OnDestroy, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { PharmaGenieService } from '../services/pharma-genie.service';
import { ChatMessage, PharmaGenieConfig } from '../models/chat.models';

@Component({
  selector: 'app-chatbot',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent implements OnInit, OnDestroy {
  @Input() config?: Partial<PharmaGenieConfig>;

  messages: ChatMessage[] = [];
  userInput: string = '';
  isOpen: boolean = false;
  isLoading: boolean = false;
  private destroy$ = new Subject<void>();

  constructor(private pharmaGenieService: PharmaGenieService) {}

  ngOnInit(): void {
    if (this.config) {
      this.pharmaGenieService.setConfig(this.config);
    }

    this.pharmaGenieService.messages$
      .pipe(takeUntil(this.destroy$))
      .subscribe(messages => {
        this.messages = messages;
        setTimeout(() => this.scrollToBottom(), 100);
      });

    this.pharmaGenieService.loading$
      .pipe(takeUntil(this.destroy$))
      .subscribe(loading => {
        this.isLoading = loading;
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  sendMessage(): void {
    if (!this.userInput.trim()) return;
    
    this.pharmaGenieService.sendMessage(this.userInput);
    this.userInput = '';
  }

  handleKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }

  clearChat(): void {
    this.pharmaGenieService.clearMessages();
  }

  /**
   * Check if CSV export is allowed (only for single collection with >1 record)
   */
  canExportCSV(message: ChatMessage): boolean {
    if (!message.data || !message.data.summary) return false;
    
    const collections = ['trials', 'drugs', 'sites', 'participants', 'adverseEvents'];
    let nonEmptyCount = 0;
    
    collections.forEach(col => {
      if (message.data[col] && Array.isArray(message.data[col]) && message.data[col].length > 0) {
        nonEmptyCount++;
      }
    });
    
    // CSV only for single collection
    return nonEmptyCount === 1;
  }

  /**
   * Export message data (new consolidated format)
   */
  exportMessageData(message: ChatMessage, format: 'csv' | 'excel'): void {
    if (!message.data) return;

    this.pharmaGenieService.exportData(message.data, format).subscribe({
      next: (blob) => {
        const url = window.URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `pharma-data-${Date.now()}.${format === 'csv' ? 'csv' : 'xlsx'}`;
        document.body.appendChild(a);
        a.click();
        document.body.removeChild(a);
        window.URL.revokeObjectURL(url);
        console.log(`✅ Exported data as ${format.toUpperCase()}`);
      },
      error: (error) => {
        console.error(`❌ Export error:`, error);
      }
    });
  }

  /**
   * Legacy export for old data format
   */
  exportData(format: 'csv' | 'excel'): void {
    const lastMessage = this.messages[this.messages.length - 1];
    if (lastMessage?.data && Array.isArray(lastMessage.data)) {
      this.pharmaGenieService.exportData(lastMessage.data, format).subscribe({
        next: (blob) => {
          const url = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `clinical-trials.${format === 'csv' ? 'csv' : 'xlsx'}`;
          a.click();
          window.URL.revokeObjectURL(url);
        },
        error: (error) => {
          console.error('Export error:', error);
        }
      });
    }
  }

  private scrollToBottom(): void {
    const chatBody = document.querySelector('.pg-chat-body');
    if (chatBody) {
      chatBody.scrollTop = chatBody.scrollHeight;
    }
  }

  formatMessageContent(message: ChatMessage): string {
    if (message.type === 'detailed') {
      return message.text.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>').replace(/\n/g, '<br>');
    }
    return message.text.replace(/\n/g, '<br>');
  }
}
