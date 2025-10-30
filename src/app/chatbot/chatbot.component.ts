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
export class ChatbotComponent implements AfterViewChecked {
  @ViewChild('messagesContainer') private messagesContainer!: ElementRef;
  
  isOpen = false;
  question = '';
  isLoading = false;
  messages: ChatMessage[] = [];
  private shouldScroll = false;
  
  private readonly RENDER_API_BASE_URL = 'https://deepthought-4ywi.onrender.com';
  private readonly API_ENDPOINT = `${this.RENDER_API_BASE_URL}/ask`;

  constructor(private http: HttpClient) {
    console.log('ChatbotComponent initialized');
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
      if (this.messagesContainer && this.messagesContainer.nativeElement) {
        setTimeout(() => {
          this.messagesContainer.nativeElement.scrollTop = 
            this.messagesContainer.nativeElement.scrollHeight;
        }, 100);
      }
    } catch (err) {
      console.error('Errore durante lo scroll:', err);
    }
  }

  toggleChat(): void {
    console.log('Toggle chat clicked, isOpen:', this.isOpen);
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      setTimeout(() => {
        this.shouldScroll = true;
      }, 100);
    }
  }

  sendMessage(): void {
    console.log('sendMessage called');
    console.log('Question:', this.question);
    console.log('isLoading:', this.isLoading);
    
    const trimmedQuestion = this.question.trim();
    
    if (!trimmedQuestion) {
      console.log('Question is empty, returning');
      return;
    }
    
    if (this.isLoading) {
      console.log('Already loading, returning');
      return;
    }

    console.log('Adding user message');
    // Aggiungi il messaggio dell'utente
    this.messages.push({
      text: trimmedQuestion,
      isUser: true,
      timestamp: new Date()
    });

    this.shouldScroll = true;

    const currentQuestion = trimmedQuestion;
    this.question = '';
    this.isLoading = true;

    console.log('Starting HTTP request to:', this.API_ENDPOINT);
    console.log('Request payload:', { question: currentQuestion });

    this.http.post<ApiResponse>(this.API_ENDPOINT, { question: currentQuestion })
      .subscribe({
        next: (response) => {
          console.log('Response received:', response);
          
          let answerText = response.answer || 'Risposta vuota ricevuta.';
          
          if (response.source_documents && response.source_documents.length > 0) {
            answerText += '\n\n📚 Fonti:\n';
            response.source_documents.forEach((doc, index) => {
              const title = doc.metadata?.title || `Fonte ${index + 1}`;
              const source = doc.metadata?.source || 'Fonte non specificata';
              answerText += `\n• ${title}: ${source}`;
            });
          }

          console.log('Adding bot message');
          this.messages.push({
            text: answerText,
            isUser: false,
            timestamp: new Date()
          });

          this.shouldScroll = true;
          this.isLoading = false;
          console.log('isLoading set to false');
        },
        error: (error: any) => {
          console.error('HTTP Error occurred:', error);
          console.error('Error status:', error.status);
          console.error('Error message:', error.message);
          console.error('Full error object:', JSON.stringify(error, null, 2));
          
          let errorMessage = 'Si è verificato un errore durante la richiesta.';
          
          if (error instanceof HttpErrorResponse) {
            if (error.status === 503) {
              errorMessage = 'Servizio non pronto (503). Il RAG non è ancora inizializzato.';
            } else if (error.status === 404) {
              errorMessage = `Errore 404. L'endpoint non è stato trovato.`;
            } else if (error.status === 0) {
              errorMessage = 'Impossibile connettersi al server. Controlla la connessione.';
            } else {
              const errorData = error.error?.detail || error.error?.error || error.statusText;
              errorMessage = `Errore dal server (${error.status}): ${errorData}`;
            }
          }

          console.log('Adding error message');
          this.messages.push({
            text: `❌ ERRORE: ${errorMessage}`,
            isUser: false,
            timestamp: new Date()
          });

          this.shouldScroll = true;
          this.isLoading = false;
          console.log('isLoading set to false after error');
        },
        complete: () => {
          console.log('HTTP request completed');
        }
      });
    
    console.log('Subscribe called, waiting for response...');
  }

  onKeyPress(event: KeyboardEvent): void {
    console.log('Key pressed:', event.key);
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      console.log('Enter pressed, calling sendMessage');
      this.sendMessage();
    }
  }
}