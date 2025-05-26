
export interface Store {
  id: string;
  cidade: string;
  estado: 'PR' | 'SP';
  endereco: string;
  telefone: string;
  whatsapp: string;
  created_at?: string;
  updated_at?: string;
}
