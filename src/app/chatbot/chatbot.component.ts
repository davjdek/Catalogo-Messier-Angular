import { Component, ViewChild, ElementRef, AfterViewChecked } from '@angular/core';
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
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  isOpen = false;
  question = '';
  isLoading = false;
  messages: ChatMessage[] = [];
  private shouldScroll = false;
  
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

  ngAfterViewChecked() {
    if (this.shouldScroll) {
      this.scrollToBottom();
      this.shouldScroll = false;
    }
  }

  private scrollToBottom(): void {
    try {
      if (this.messagesContainer) {
        this.messagesContainer.nativeElement.scrollTop = 
          this.messagesContainer.nativeElement.scrollHeight;
      }
    } catch (err) {
      console.error('Errore durante lo scroll:', err);
    }
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