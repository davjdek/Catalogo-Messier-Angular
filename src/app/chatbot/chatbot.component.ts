import { Component } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';

interface ChatMessage {
  text: string;
  isUser: boolean;
  timestamp: Date;
}

interface ApiResponse {
  answer: string;
  source_documents?: Array<{
    metadata?: {
      title?: string;
      source?: string;
    };
  }>;
}

@Component({
  selector: 'app-chatbot',
  templateUrl: './chatbot.component.html',
  styleUrls: ['./chatbot.component.css']
})
export class ChatbotComponent {
  isOpen = false;
  question = '';
  isLoading = false;
  messages: ChatMessage[] = [];
  
  private readonly RENDER_API_BASE_URL = 'https://deepthought-4ywi.onrender.com';
  private readonly API_ENDPOINT = `${this.RENDER_API_BASE_URL}/ask`;

  constructor(private http: HttpClient) {
    // Messaggio di benvenuto
    this.messages.push({
      text: 'Ciao! Sono il tuo assistente RAG. Chiedi qualcosa sui cataloghi stellari o su Andromeda...',
      isUser: false,
      timestamp: new Date()
    });
  }

  toggleChat(): void {
    this.isOpen = !this.isOpen;
  }

  async sendMessage(): Promise<void> {
    const trimmedQuestion = this.question.trim();
    
    if (!trimmedQuestion || this.isLoading) {
      return;
    }

    // Aggiungi il messaggio dell'utente
    this.messages.push({
      text: trimmedQuestion,
      isUser: true,
      timestamp: new Date()
    });

    const currentQuestion = trimmedQuestion;
    this.question = '';
    this.isLoading = true;

    try {
      const response = await this.http.post<ApiResponse>(
        this.API_ENDPOINT,
        { question: currentQuestion }
      ).toPromise();

      if (response) {
        // Formatta la risposta con le fonti se disponibili
        let answerText = response.answer || 'Risposta vuota ricevuta.';
        
        if (response.source_documents && response.source_documents.length > 0) {
          answerText += '\n\n📚 Fonti:\n';
          response.source_documents.forEach((doc, index) => {
            const title = doc.metadata?.title || `Fonte ${index + 1}`;
            const source = doc.metadata?.source || 'Fonte non specificata';
            answerText += `\n• ${title}: ${source}`;
          });
        }

        this.messages.push({
          text: answerText,
          isUser: false,
          timestamp: new Date()
        });
      }
    } catch (error) {
      let errorMessage = 'Si è verificato un errore durante la richiesta.';
      
      if (error instanceof HttpErrorResponse) {
        if (error.status === 503) {
          errorMessage = 'Servizio non pronto (503). Il RAG non è ancora inizializzato.';
        } else if (error.status === 404) {
          errorMessage = `Errore 404. L'endpoint non è stato trovato.`;
        } else {
          const errorData = error.error?.detail || error.error?.error || error.statusText;
          errorMessage = `Errore dal server (${error.status}): ${errorData}`;
        }
      }

      this.messages.push({
        text: `❌ ERRORE: ${errorMessage}`,
        isUser: false,
        timestamp: new Date()
      });
    } finally {
      this.isLoading = false;
    }
  }

  onKeyPress(event: KeyboardEvent): void {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      this.sendMessage();
    }
  }
}