import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';

interface ChatMessage {
  id: string;
  sender_id: string;
  body: string;
  created_at: string;
  sender?: {
    id: string;
    name: string;
  };
}

interface ChatContact {
  id: string;
  name: string;
  type: string;
  last_message?: string;
  last_message_at?: string;
  users?: any[];
}

@Component({
  selector: 'app-chat-widget',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './chat-widget.component.html',
  styleUrls: ['./chat-widget.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ChatWidgetComponent implements AfterViewChecked, OnInit, OnDestroy {
  @ViewChild('scrollMe') private myScrollContainer!: ElementRef;

  isOpen = false;
  currentUserId: string = ''; // Debería sacarse del auth service
  newMessage = '';
  
  activeContact: ChatContact | null = null;
  contacts: ChatContact[] = [];
  messages: ChatMessage[] = [];
  private echoInstance: any = null;

  constructor(private cdr: ChangeDetectorRef, private http: HttpClient) {}

  ngOnInit() {
    this.loadConversations();
    this.initWebSockets();
  }

  ngOnDestroy() {
    if (this.echoInstance && this.activeContact) {
      this.echoInstance.leave('chat.' + this.activeContact.id);
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  loadConversations() {
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
    this.http.get<ChatContact[]>(`${environment.urlApi}chat/conversations`, { headers }).subscribe({
      next: (data) => {
        this.contacts = data;
        this.cdr.detectChanges();
      },
      error: (err) => console.warn('No se pudo cargar conversaciones', err)
    });
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.loadConversations();
      if (!this.activeContact && this.contacts.length > 0) {
        this.selectContact(this.contacts[0]);
      }
    }
    this.cdr.detectChanges();
  }

  selectContact(contact: ChatContact) {
    if (this.echoInstance && this.activeContact) {
      this.echoInstance.leave('chat.' + this.activeContact.id);
    }

    this.activeContact = contact;
    this.messages = [];
    
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
    this.http.get<ChatMessage[]>(`${environment.urlApi}chat/conversations/${contact.id}/messages`, { headers }).subscribe({
      next: (data) => {
        this.messages = data;
        this.cdr.detectChanges();
        this.scrollToBottom();
        this.listenForMessages(contact.id);
      }
    });
  }

  sendMessage() {
    if (!this.newMessage.trim() || !this.activeContact) return;
    
    const body = { body: this.newMessage.trim() };
    const headers = new HttpHeaders().set('Authorization', `Bearer ${localStorage.getItem('token') || ''}`);
    this.newMessage = '';
    
    // Optimizacion: Mensaje optimista
    // ...

    this.http.post<ChatMessage>(`${environment.urlApi}chat/conversations/${this.activeContact.id}/messages`, body, { headers }).subscribe({
      next: (msg) => {
        this.messages.push(msg);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  private initWebSockets() {
    (window as any).Pusher = Pusher;
    this.echoInstance = new Echo({
      broadcaster: 'reverb',
      key: 'app-key', // Asegúrate de que esto coincida con REVERB_APP_KEY
      wsHost: window.location.hostname,
      wsPort: 8080,
      forceTLS: false,
      disableStats: true,
      authEndpoint: `${environment.urlApi}broadcasting/auth`,
      auth: { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } }
    });
  }

  private listenForMessages(conversationId: string) {
    if (!this.echoInstance) return;
    
    this.echoInstance.private('chat.' + conversationId)
      .listen('MessageSent', (e: any) => {
        if (e.message.sender_id.toString() !== this.currentUserId) {
          this.messages.push(e.message);
          this.cdr.detectChanges();
          this.scrollToBottom();
        }
      });
  }

  private scrollToBottom(): void {
    try {
      if (this.myScrollContainer) {
        this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
      }
    } catch(err) { }
  }
}
