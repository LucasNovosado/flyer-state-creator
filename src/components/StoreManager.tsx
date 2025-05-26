
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Trash2, Edit, Plus, MapPin, Phone } from 'lucide-react';
import { Store } from '@/types/store';
import { toast } from '@/hooks/use-toast';

interface StoreManagerProps {
  stores: Store[];
  onStoresUpdate: (stores: Store[]) => void;
}

const StoreManager: React.FC<StoreManagerProps> = ({ stores, onStoresUpdate }) => {
  const [editingStore, setEditingStore] = useState<Store | null>(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState<Store>({
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
      const updatedStores = stores.map(store => 
        store === editingStore ? finalFormData : store
      );
      onStoresUpdate(updatedStores);
      toast({
        title: "Loja atualizada!",
        description: `${finalFormData.cidade} foi atualizada com sucesso.`,
      });
      setEditingStore(null);
    } else {
      onStoresUpdate([...stores, finalFormData]);
      toast({
        title: "Loja adicionada!",
        description: `${finalFormData.cidade} foi adicionada com sucesso.`,
      });
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
    setFormData(store);
    setIsAdding(true);
  };

  const handleDelete = (storeToDelete: Store) => {
    const updatedStores = stores.filter(store => store !== storeToDelete);
    onStoresUpdate(updatedStores);
    toast({
      title: "Loja removida!",
      description: `${storeToDelete.cidade} foi removida com sucesso.`,
    });
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
    <Card className="hover:shadow-lg transition-shadow">
      <CardContent className="p-4">
        <div className="flex justify-between items-start mb-2">
          <h3 className="font-bold text-lg text-blue-900">{store.cidade}</h3>
          <Badge variant={store.estado === 'PR' ? 'default' : 'secondary'}>
            {store.estado}
          </Badge>
        </div>
        
        <div className="space-y-2 text-sm">
          <div className="flex items-center gap-2 text-gray-600">
            <MapPin className="h-4 w-4" />
            <span>{store.endereco}</span>
          </div>
          
          <div className="flex items-center gap-2 text-gray-600">
            <Phone className="h-4 w-4" />
            <span>{store.telefone || "0800 718 0896"}</span>
          </div>
          
          <div className="flex items-center gap-2 text-green-600">
            <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-bold">W</span>
            </div>
            <span>{store.whatsapp}</span>
          </div>
        </div>

        <div className="flex gap-2 mt-4">
          <Button
            variant="outline"
            size="sm"
            onClick={() => handleEdit(store)}
            className="flex-1"
          >
            <Edit className="h-4 w-4 mr-1" />
            Editar
          </Button>
          <Button
            variant="destructive"
            size="sm"
            onClick={() => handleDelete(store)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-blue-900">Gerenciar Lojas</h2>
        <Button 
          onClick={() => setIsAdding(true)}
          className="bg-blue-600 hover:bg-blue-700"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Loja
        </Button>
      </div>

      {isAdding && (
        <Card>
          <CardHeader>
            <CardTitle>
              {editingStore ? 'Editar Loja' : 'Adicionar Nova Loja'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="cidade">Cidade *</Label>
                  <Input
                    id="cidade"
                    value={formData.cidade}
                    onChange={(e) => setFormData({...formData, cidade: e.target.value})}
                    required
                  />
                </div>
                
                <div>
                  <Label htmlFor="estado">Estado *</Label>
                  <Select
                    value={formData.estado}
                    onValueChange={(value: 'PR' | 'SP') => setFormData({...formData, estado: value})}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="PR">Paraná</SelectItem>
                      <SelectItem value="SP">São Paulo</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="endereco">Endereço *</Label>
                <Input
                  id="endereco"
                  value={formData.endereco}
                  onChange={(e) => setFormData({...formData, endereco: e.target.value})}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefone">Telefone Fixo</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({...formData, telefone: e.target.value})}
                    placeholder="0800 718 0896 (padrão)"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Se vazio, será preenchido automaticamente com 0800 718 0896
                  </p>
                </div>
                
                <div>
                  <Label htmlFor="whatsapp">WhatsApp *</Label>
                  <Input
                    id="whatsapp"
                    value={formData.whatsapp}
                    onChange={(e) => setFormData({...formData, whatsapp: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="flex gap-2 pt-4">
                <Button type="submit" className="bg-green-600 hover:bg-green-700">
                  {editingStore ? 'Atualizar' : 'Adicionar'} Loja
                </Button>
                <Button type="button" variant="outline" onClick={cancelEdit}>
                  Cancelar
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Tabs defaultValue="pr" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="pr">
            Paraná ({prStores.length} lojas)
          </TabsTrigger>
          <TabsTrigger value="sp">
            São Paulo ({spStores.length} lojas)
          </TabsTrigger>
        </TabsList>

        <TabsContent value="pr" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {prStores.map((store, index) => (
              <StoreCard key={index} store={store} />
            ))}
          </div>
        </TabsContent>

        <TabsContent value="sp" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {spStores.map((store, index) => (
              <StoreCard key={index} store={store} />
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default StoreManager;
