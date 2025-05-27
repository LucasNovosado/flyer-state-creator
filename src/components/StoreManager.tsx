import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, MapPin, Phone, Loader2 } from 'lucide-react';
import { Store } from '@/types/store';
import { useStores } from '@/hooks/useStores';

const StoreManager: React.FC = () => {
  const { stores, createStore, updateStore, deleteStore, isCreating, isUpdating, isDeleting } = useStores();
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Omit<Store, 'id' | 'created_at' | 'updated_at'>>({
    cidade: '',
    estado: 'PR',
    endereco: '',
    telefone: '',
    whatsapp: ''
  });

  const prStores = stores.filter(store => store.estado === 'PR');
  const spStores = stores.filter(store => store.estado === 'SP');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Auto-fill telefone if empty
    const finalFormData = {
      ...formData,
      telefone: formData.telefone.trim() || "0800 718 0896"
    };

    if (editingStore) {
      updateStore({ id: editingStore.id, ...finalFormData });
      setEditingStore(null);
    } else {
      createStore(finalFormData);
      setIsAdding(false);
    }

    setFormData({
      cidade: '',
      estado: 'PR',
      endereco: '',
      telefone: '',
      whatsapp: ''
    });
  };

  const handleEdit = (store: Store) => {
    setEditingStore(store);
    setFormData({
      cidade: store.cidade,
      estado: store.estado,
      endereco: store.endereco,
      telefone: store.telefone,
      whatsapp: store.whatsapp
    });
    setIsAdding(true);
  };

  const handleDelete = (store: Store) => {
    if (window.confirm(`Tem certeza que deseja excluir a loja de ${store.cidade}?`)) {
      deleteStore(store.id);
    }
  };

  const cancelEdit = () => {
    setEditingStore(null);
    setIsAdding(false);
    setFormData({
      cidade: '',
      estado: 'PR',
      endereco: '',
      telefone: '',
      whatsapp: ''
    });
  };

  const StoreCard = ({ store }: { store: Store }) => (
    <Card className="hover:shadow-lg transition-shadow font-poppins">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-blue-900 font-poppins">{store.cidade}</h3>
          <Badge variant={store.estado === 'PR' ? 'default' : 'secondary'} className="font-poppins">
            {store.estado}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span className="font-poppins">{store.endereco}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span className="font-poppins">{store.telefone || "0800 718 0896"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold font-poppins">W</span>
            </div>
            <span className="font-poppins">{store.whatsapp}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(store)}
            className="flex-1 font-poppins"
            disabled={isUpdating}
          >
            {isUpdating && editingStore?.id === store.id ? (
              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
            ) : (
              <Edit className="h-4 w-4 mr-1" />
            )}
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(store)}
            disabled={isDeleting}
            className="font-poppins"
          >
            {isDeleting ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4" />
            )}
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6 font-poppins">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900 font-poppins">Gerenciar Lojas</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700 font-poppins"
          disabled={isCreating}
        >
          {isCreating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <Plus className="h-4 w-4 mr-2" />
          )}
          Nova Loja
        </Button>
      </div>

      {isAdding && (
        <Card className="font-poppins">
          <CardHeader>
            <CardTitle className="font-poppins">
              {editingStore ? 'Editar Loja' : 'Adicionar Nova Loja'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade" className="font-poppins">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    required
                    className="font-poppins"
                  />
                </div>
                
                <div>
                  <Label htmlFor="estado" className="font-poppins">Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value: 'PR' | 'SP') => setFormData({...formData, estado: value})}
                  >
                    <SelectTrigger className="font-poppins">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="font-poppins">
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="endereco" className="font-poppins">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  required
                  className="font-poppins"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone" className="font-poppins">Telefone Fixo</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="0800 718 0896 (padrão)"
                    className="font-poppins"
                  />
                  <p className="text-xs text-gray-500 mt-1 font-poppins">
                    Se vazio, será preenchido automaticamente com 0800 718 0896
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="whatsapp" className="font-poppins">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    required
                    className="font-poppins"
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button 
                  type="submit" 
                  className="bg-green-600 hover:bg-green-700 font-poppins"
                  disabled={isCreating || isUpdating}
                >
                  {(isCreating || isUpdating) ? (
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                  ) : null}
                  {editingStore ? 'Atualizar' : 'Adicionar'} Loja
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit} className="font-poppins">
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pr" className="w-full">
        <TabsList className="grid w-full grid-cols-2 font-poppins">
          <TabsTrigger value="pr" className="font-poppins">
            Paraná ({prStores.length} lojas)
          </TabsTrigger>
          <TabsTrigger value="sp" className="font-poppins">
            São Paulo ({spStores.length} lojas)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pr" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spStores.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManager;