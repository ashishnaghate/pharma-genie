import { Routes } from '@angular/router';
import { NlpChatComponent } from './features/nlp-chat/nlp-chat.component';
import { GenAIChatComponent } from './features/genai-chat/genai-chat.component';

export const routes: Routes = [
  {
    path: '',
    redirectTo: '/nlp',
    pathMatch: 'full'
  },
  {
    path: 'nlp',
    component: NlpChatComponent,
    title: 'NLP Chatbot - PharmaGenie'
  },
  {
    path: 'genai',
    component: GenAIChatComponent,
    title: 'GenAI Chatbot - PharmaGenie'
  },
  {
    path: '**',
    redirectTo: '/nlp'
  }
];
