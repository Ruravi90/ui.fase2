import { Component, ChangeDetectionStrategy, ChangeDetectorRef, ViewChild, ElementRef, AfterViewChecked, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import Echo from 'laravel-echo';
import Pusher from 'pusher-js';
import { UserService } from '../../services/user.service';

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
  other_user_id?: number;
  isOnline?: boolean;
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
  currentUserId: string = ''; 
  newMessage = '';
  unreadCount = 0;
  
  activeContact: ChatContact | null = null;
  contacts: ChatContact[] = [];
  messages: ChatMessage[] = [];
  private echoInstance: any = null;
  
  onlineUsers = new Set<number>();

  constructor(
    private cdr: ChangeDetectorRef, 
    private http: HttpClient,
    private userService: UserService
  ) {}

  ngOnInit() {
    // Nos suscribimos al usuario actual para obtener su ID de forma reactiva
    this.userService.currentUser$.subscribe(user => {
      if (user && user.id) {
        this.currentUserId = user.id.toString();
        this.cdr.detectChanges();
      }
    });
    
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
        this.updatePresence(); // <--- IMPORTANTE: Actualizar presencia por si los WebSockets terminaron antes
      },
      error: (err) => console.warn('No se pudo cargar conversaciones', err)
    });
  }

  toggleWidget() {
    this.isOpen = !this.isOpen;
    if (this.isOpen) {
      this.unreadCount = 0;
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

    // Restablecer la altura del textarea si existe
    try {
      const textareas = document.getElementsByClassName('chat-textarea');
      if (textareas.length > 0) {
        (textareas[0] as HTMLElement).style.height = '44px'; // altura base
      }
    } catch(e) {}

    this.http.post<any>(`${environment.urlApi}chat/conversations/${this.activeContact.id}/messages`, body, { headers }).subscribe({
      next: (msg) => {
        // Si era un contacto nuevo, el backend devuelve el ID real de la conversación creada
        if (msg.new_conversation_id && this.activeContact) {
          const newId = msg.new_conversation_id.toString();
          if (this.activeContact.id !== newId) {
            if (this.echoInstance) {
              this.echoInstance.leave('chat.' + this.activeContact.id);
            }
            this.activeContact.id = newId;
            this.listenForMessages(newId);
          }
        }
        this.messages.push(msg);
        this.cdr.detectChanges();
        this.scrollToBottom();
      }
    });
  }

  onEnter(event: Event) {
    event.preventDefault(); // Evita que se inserte un salto de línea
    this.sendMessage();
  }

  autoGrow(event: any) {
    const el = event.target;
    // Si no hay texto, forzamos altura inicial
    if (!el.value) {
      el.style.height = '44px';
      return;
    }
    el.style.height = '44px'; // Volvemos al mínimo temporalmente para medir
    const newHeight = Math.min(el.scrollHeight, 120); // Max 120px de alto
    el.style.height = newHeight + 'px';
  }

  private initWebSockets() {
    console.log('Iniciando WebSockets con Reverb...');
    Pusher.logToConsole = true;
    (window as any).Pusher = Pusher;
    this.echoInstance = new Echo({
      broadcaster: 'reverb',
      key: environment.reverb.key,
      wsHost: environment.reverb.host,
      wsPort: environment.reverb.port,
      wssPort: environment.reverb.port,
      forceTLS: environment.reverb.scheme === 'https',
      disableStats: true,
      enabledTransports: ['ws', 'wss'],
      authEndpoint: `${environment.urlApi}broadcasting/auth`,
      channelAuthorization: {
        customHandler: (params: any, callback: any) => {
          console.log('[Pusher v8 CustomHandler] Autenticando canal...', params.channelName);
          
          fetch(`${environment.urlApi}broadcasting/auth`, {
            method: 'POST',
            credentials: 'include', // <--- ¡CRUCIAL PARA SESIONES SPA!
            headers: {
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            body: JSON.stringify({
              socket_id: params.socketId,
              channel_name: params.channelName
            })
          })
          .then(response => {
            if (!response.ok) {
              console.error('[Pusher v8 CustomHandler] Error de servidor:', response.status);
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            callback(null, data); // Error nulo, pasamos la data de auth
          })
          .catch(error => {
            console.error('[Pusher v8 CustomHandler] Error de fetch o parseo JSON:', error);
            callback(error, null); // Pasamos el error
          });
        }
      }
    });

    (window as any).Echo = this.echoInstance;
    console.log('Echo instance creada:', this.echoInstance);

    this.echoInstance.join('online')
      .here((users: any[]) => {
        console.log('[Presence] Currently here:', users);
        this.onlineUsers = new Set(users.map(u => Number(u.id)));
        this.updatePresence();
      })
      .joining((user: any) => {
        console.log('[Presence] User joining:', user);
        this.onlineUsers.add(Number(user.id));
        this.updatePresence();
        this.playDingSound();
      })
      .leaving((user: any) => {
        console.log('[Presence] User leaving:', user);
        this.onlineUsers.delete(Number(user.id));
        this.updatePresence();
      })
      .error((error: any) => {
        console.error('[Presence] Error:', error);
      });

    // Monitorear el estado de la conexión
    if (this.echoInstance.connector && this.echoInstance.connector.pusher) {
      this.echoInstance.connector.pusher.connection.bind('state_change', (states: any) => {
        console.log('[Pusher State]', states.previous, '->', states.current);
      });
      this.echoInstance.connector.pusher.connection.bind('error', (err: any) => {
        console.error('[Pusher Error]', err);
      });
    }
  }

  private updatePresence() {
    this.contacts.forEach(c => {
      if (c.type === 'direct' && c.other_user_id) {
        c.isOnline = this.onlineUsers.has(Number(c.other_user_id));
      }
    });
    this.cdr.detectChanges();
  }

  private listenForMessages(conversationId: string) {
    if (!this.echoInstance) return;
    
    this.echoInstance.private('chat.' + conversationId)
      .listen('MessageSent', (e: any) => {
        if (e.message.sender_id.toString() !== this.currentUserId) {
          this.messages.push(e.message);
          this.cdr.detectChanges();
          this.scrollToBottom();
          this.playPopSound();
          if (!this.isOpen) {
            this.unreadCount++;
            this.cdr.detectChanges();
          }
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

  private playPopSound() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(600, audioCtx.currentTime);
      oscillator.frequency.exponentialRampToValueAtTime(200, audioCtx.currentTime + 0.1);
      
      gainNode.gain.setValueAtTime(0.2, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.1);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.1);
    } catch (e) { }
  }

  private playDingSound() {
    try {
      const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContext) return;
      const audioCtx = new AudioContext();
      const oscillator = audioCtx.createOscillator();
      const gainNode = audioCtx.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(1200, audioCtx.currentTime);
      
      gainNode.gain.setValueAtTime(0.1, audioCtx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.01, audioCtx.currentTime + 0.4);

      oscillator.connect(gainNode);
      gainNode.connect(audioCtx.destination);

      oscillator.start();
      oscillator.stop(audioCtx.currentTime + 0.4);
    } catch (e) { }
  }
}
