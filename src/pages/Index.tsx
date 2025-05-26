
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';
import StoreManager from '@/components/StoreManager';
import FlyerPreview from '@/components/FlyerPreview';
import { useStores } from '@/hooks/useStores';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { stores, isLoading, error } = useStores();
  const [selectedState, setSelectedState] = useState<'PR' | 'SP'>('PR');

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-blue-600 mx-auto mb-4" />
          <p className="text-blue-700 text-lg">Carregando dados das lojas...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50 flex items-center justify-center">
        <div className="text-center">
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <p className="font-bold">Erro ao carregar dados</p>
            <p>Ocorreu um erro ao conectar com o banco de dados.</p>
          </div>
        </div>
      </div>
    );
  }

  const storesByState = stores.filter(store => store.estado === selectedState);
  const prStores = stores.filter(store => store.estado === 'PR');
  const spStores = stores.filter(store => store.estado === 'SP');

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-yellow-50">
      <div className="container mx-auto px-4 py-6">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-blue-600 to-blue-800 rounded-xl mb-4">
            <span className="text-white font-bold text-xl">RU</span>
          </div>
          <h1 className="text-4xl font-bold text-blue-900 mb-2">
            Sistema de Panfletos
          </h1>
          <p className="text-blue-700 text-lg">
            Rede Única de Baterias - Gerador de Material Gráfico
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 mb-6">
          <Card className="p-4 bg-blue-600 text-white">
            <h3 className="font-semibold text-lg">Total de Lojas</h3>
            <p className="text-3xl font-bold">{stores.length}</p>
          </Card>
          <Card className="p-4 bg-blue-700 text-white">
            <h3 className="font-semibold text-lg">Paraná</h3>
            <p className="text-3xl font-bold">{prStores.length}</p>
          </Card>
          <Card className="p-4 bg-blue-800 text-white">
            <h3 className="font-semibold text-lg">São Paulo</h3>
            <p className="text-3xl font-bold">{spStores.length}</p>
          </Card>
          <Card className="p-4 bg-yellow-500 text-blue-900">
            <h3 className="font-semibold text-lg">Estado Ativo</h3>
            <p className="text-3xl font-bold">{selectedState}</p>
          </Card>
        </div>

        <Tabs defaultValue="preview" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="preview" className="text-lg py-3">
              📄 Preview do Panfleto
            </TabsTrigger>
            <TabsTrigger value="management" className="text-lg py-3">
              ⚙️ Gerenciar Lojas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="preview" className="space-y-6">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-center">
              <div className="flex gap-2">
                <button
                  onClick={() => setSelectedState('PR')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedState === 'PR'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  Paraná ({prStores.length} lojas)
                </button>
                <button
                  onClick={() => setSelectedState('SP')}
                  className={`px-4 py-2 rounded-md font-medium transition-colors ${
                    selectedState === 'SP'
                      ? 'bg-blue-600 text-white'
                      : 'bg-white text-blue-600 border border-blue-600 hover:bg-blue-50'
                  }`}
                >
                  São Paulo ({spStores.length} lojas)
                </button>
              </div>
            </div>
            
            <FlyerPreview stores={storesByState} state={selectedState} />
          </TabsContent>

          <TabsContent value="management">
            <StoreManager />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default Index;
