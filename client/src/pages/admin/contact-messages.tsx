import { useState } from 'react';
import { useQuery, useMutation } from '@tanstack/react-query';
import { AdminLayout } from '@/components/layout/admin-layout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Mail, MailOpen, Trash2, Eye, Clock, User, MessageSquare } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import { es } from 'date-fns/locale';

type ContactMessage = {
  id: number;
  name: string;
  email: string;
  phone?: string;
  message: string;
  isRead: boolean;
  createdAt: string;
  respondedAt?: string;
};

export default function AdminContactMessages() {
  const [selectedMessage, setSelectedMessage] = useState<ContactMessage | null>(null);
  const [filter, setFilter] = useState<'all' | 'unread' | 'read'>('all');
  const { toast } = useToast();

  // Fetch contact messages
  const { data: messages = [], isLoading, error } = useQuery<ContactMessage[]>({
    queryKey: ['/api/contact-messages'],
    staleTime: 30000, // Cache for 30 seconds
  });

  // Fetch unread count
  const { data: unreadData } = useQuery<{ count: number }>({
    queryKey: ['/api/contact-messages/unread-count'],
    staleTime: 15000, // Cache for 15 seconds
  });

  // Mark as read mutation
  const markAsReadMutation = useMutation({
    mutationFn: async (messageId: number) => {
      return apiRequest('PATCH', `/api/contact-messages/${messageId}/read`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages'] });
      queryClient.invalidateQueries({ queryKey: ['/api/contact-messages/unread-count'] });
      toast({
        title: '¡Mensaje marcado como leído!',
        description: 'El mensaje ha sido marcado como leído exitosamente.',
      });
    },
    onError: () => {
      toast({
        title: 'Error',
        description: 'No se pudo marcar el mensaje como leído.',
        variant: 'destructive',
      });
    },
  });

  // Filter messages
  const filteredMessages = messages.filter((message: ContactMessage) => {
    if (filter === 'unread') return !message.isRead;
    if (filter === 'read') return message.isRead;
    return true;
  });

  // Group messages by read status
  const unreadMessages = messages.filter((m: ContactMessage) => !m.isRead);
  const readMessages = messages.filter((m: ContactMessage) => m.isRead);

  const handleMarkAsRead = async (messageId: number) => {
    await markAsReadMutation.mutateAsync(messageId);
    if (selectedMessage && selectedMessage.id === messageId) {
      setSelectedMessage({ ...selectedMessage, isRead: true, respondedAt: new Date().toISOString() });
    }
  };

  const MessageCard = ({ message }: { message: ContactMessage }) => (
    <Card 
      className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
        !message.isRead ? 'border-l-4 border-l-uniform-accent bg-yellow-50' : 'bg-white'
      } ${selectedMessage?.id === message.id ? 'ring-2 ring-uniform-primary' : ''}`}
      onClick={() => setSelectedMessage(message)}
      data-testid={`message-card-${message.id}`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle className="text-base flex items-center gap-2">
              <User className="h-4 w-4 text-uniform-secondary" />
              {message.name}
              {!message.isRead && (
                <Badge variant="secondary" className="ml-2">
                  <Mail className="h-3 w-3 mr-1" />
                  Nuevo
                </Badge>
              )}
            </CardTitle>
            <CardDescription className="flex items-center gap-2">
              <span>{message.email}</span>
              {message.phone && (
                <>
                  <span>•</span>
                  <span>{message.phone}</span>
                </>
              )}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2 text-xs text-uniform-secondary">
            <Clock className="h-3 w-3" />
            {formatDistanceToNow(new Date(message.createdAt), { 
              addSuffix: true, 
              locale: es 
            })}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-uniform-secondary line-clamp-2">
          {message.message}
        </p>
      </CardContent>
    </Card>
  );

  if (isLoading) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-gray-200 rounded"></div>
              ))}
            </div>
          </div>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="max-w-7xl mx-auto p-6">
          <Card>
            <CardContent className="p-6 text-center">
              <h2 className="text-lg font-semibold text-red-600 mb-2">Error al cargar mensajes</h2>
              <p className="text-uniform-secondary">
                No se pudieron cargar los mensajes de contacto. Por favor, intenta nuevamente.
              </p>
            </CardContent>
          </Card>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto p-6">
        <div className="space-y-6">
          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold text-uniform-primary" data-testid="page-title">
              Mensajes de Contacto
            </h1>
            <p className="text-uniform-secondary mt-1">
              Gestiona y responde los mensajes de contacto de los clientes
            </p>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-uniform-secondary">Total</p>
                    <p className="text-2xl font-bold text-uniform-primary" data-testid="total-messages">
                      {messages.length}
                    </p>
                  </div>
                  <MessageSquare className="h-8 w-8 text-uniform-secondary" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-uniform-secondary">Sin leer</p>
                    <p className="text-2xl font-bold text-uniform-accent" data-testid="unread-messages">
                      {unreadData?.count || unreadMessages.length}
                    </p>
                  </div>
                  <Mail className="h-8 w-8 text-uniform-accent" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-uniform-secondary">Leídos</p>
                    <p className="text-2xl font-bold text-green-600" data-testid="read-messages">
                      {readMessages.length}
                    </p>
                  </div>
                  <MailOpen className="h-8 w-8 text-green-600" />
                </div>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Messages List */}
            <div className="space-y-4">
              <Tabs value={filter} onValueChange={(value) => setFilter(value as typeof filter)}>
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="all" data-testid="filter-all">
                    Todos ({messages.length})
                  </TabsTrigger>
                  <TabsTrigger value="unread" data-testid="filter-unread">
                    Sin leer ({unreadMessages.length})
                  </TabsTrigger>
                  <TabsTrigger value="read" data-testid="filter-read">
                    Leídos ({readMessages.length})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={filter} className="space-y-3 mt-4">
                  {filteredMessages.length === 0 ? (
                    <Card>
                      <CardContent className="p-6 text-center">
                        <MessageSquare className="h-12 w-12 text-uniform-secondary mx-auto mb-4" />
                        <h3 className="font-semibold text-uniform-primary mb-2">
                          No hay mensajes
                        </h3>
                        <p className="text-uniform-secondary">
                          {filter === 'unread' && 'No tienes mensajes sin leer.'}
                          {filter === 'read' && 'No hay mensajes leídos.'}
                          {filter === 'all' && 'No has recibido ningún mensaje de contacto.'}
                        </p>
                      </CardContent>
                    </Card>
                  ) : (
                    <div className="space-y-3 max-h-[600px] overflow-y-auto">
                      {filteredMessages.map((message: ContactMessage) => (
                        <MessageCard key={message.id} message={message} />
                      ))}
                    </div>
                  )}
                </TabsContent>
              </Tabs>
            </div>

            {/* Message Detail */}
            <div>
              {selectedMessage ? (
                <Card className="sticky top-4">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="space-y-1">
                        <CardTitle className="flex items-center gap-2">
                          <User className="h-5 w-5 text-uniform-secondary" />
                          {selectedMessage.name}
                          {!selectedMessage.isRead && (
                            <Badge variant="secondary">
                              <Mail className="h-3 w-3 mr-1" />
                              Nuevo
                            </Badge>
                          )}
                        </CardTitle>
                        <CardDescription>
                          <div className="space-y-1">
                            <div>{selectedMessage.email}</div>
                            {selectedMessage.phone && <div>{selectedMessage.phone}</div>}
                            <div className="flex items-center gap-1 text-xs">
                              <Clock className="h-3 w-3" />
                              {formatDistanceToNow(new Date(selectedMessage.createdAt), { 
                                addSuffix: true, 
                                locale: es 
                              })}
                            </div>
                          </div>
                        </CardDescription>
                      </div>
                      
                      <div className="flex gap-2">
                        {!selectedMessage.isRead && (
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleMarkAsRead(selectedMessage.id)}
                            disabled={markAsReadMutation.isPending}
                            data-testid="mark-read-button"
                          >
                            <MailOpen className="h-4 w-4 mr-1" />
                            Marcar leído
                          </Button>
                        )}
                        
                        <Button size="sm" variant="outline" data-testid="close-detail-button" onClick={() => setSelectedMessage(null)}>
                          <Eye className="h-4 w-4 mr-1" />
                          Cerrar
                        </Button>
                      </div>
                    </div>
                  </CardHeader>
                  
                  <CardContent className="space-y-4">
                    <div>
                      <h4 className="font-semibold text-uniform-primary mb-2">Mensaje:</h4>
                      <div className="bg-uniform-neutral-50 p-4 rounded-lg">
                        <p className="text-uniform-secondary whitespace-pre-wrap leading-relaxed" data-testid="message-content">
                          {selectedMessage.message}
                        </p>
                      </div>
                    </div>

                    {selectedMessage.respondedAt && (
                      <div className="text-xs text-green-600 flex items-center gap-1">
                        <MailOpen className="h-3 w-3" />
                        Respondido {formatDistanceToNow(new Date(selectedMessage.respondedAt), { 
                          addSuffix: true, 
                          locale: es 
                        })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ) : (
                <Card>
                  <CardContent className="p-8 text-center">
                    <MessageSquare className="h-16 w-16 text-uniform-secondary mx-auto mb-4" />
                    <h3 className="font-semibold text-uniform-primary mb-2">
                      Selecciona un mensaje
                    </h3>
                    <p className="text-uniform-secondary">
                      Haz clic en cualquier mensaje de la lista para ver los detalles completos.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}