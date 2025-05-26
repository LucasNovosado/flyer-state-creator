
import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Phone } from 'lucide-react';
import { Store } from '@/types/store';
import { toast } from '@/hooks/use-toast';

interface FlyerPreviewProps {
  stores: Store[];
  state: 'PR' | 'SP';
}

const FlyerPreview: React.FC<FlyerPreviewProps> = ({ stores, state }) => {
  const flyerRef = useRef<HTMLDivElement>(null);

  // Calculate adaptive layout based on number of stores
  const getLayoutConfig = (storeCount: number, state: string) => {
    if (state === 'PR') {
      // Paraná has more stores - optimize for space
      if (storeCount > 20) {
        return { columns: 4, fontSize: 'text-xs', spacing: 'gap-1', padding: 'p-2' };
      } else if (storeCount > 15) {
        return { columns: 3, fontSize: 'text-sm', spacing: 'gap-2', padding: 'p-3' };
      } else {
        return { columns: 3, fontSize: 'text-base', spacing: 'gap-3', padding: 'p-4' };
      }
    } else {
      // São Paulo has fewer stores - optimize for visual appeal
      if (storeCount > 10) {
        return { columns: 3, fontSize: 'text-sm', spacing: 'gap-3', padding: 'p-4' };
      } else {
        return { columns: 2, fontSize: 'text-base', spacing: 'gap-4', padding: 'p-6' };
      }
    }
  };

  const config = getLayoutConfig(stores.length, state);

  const handleExportPDF = async () => {
    try {
      // Dynamic import for html2canvas and jsPDF
      const html2canvas = (await import('html2canvas')).default;
      const jsPDF = (await import('jspdf')).default;

      if (!flyerRef.current) return;

      toast({
        title: "Gerando PDF...",
        description: "Aguarde enquanto preparamos seu panfleto.",
      });

      const canvas = await html2canvas(flyerRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#FFE600',
        width: 794, // A4 width in pixels at 96 DPI
        height: 1123, // A4 height in pixels at 96 DPI
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
      // A4 dimensions in mm
      const pdfWidth = 210;
      const pdfHeight = 297;
      
      pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
      pdf.save(`panfleto-rede-unica-${state.toLowerCase()}.pdf`);

      toast({
        title: "PDF gerado com sucesso!",
        description: `Panfleto do ${state} foi exportado e está pronto para impressão.`,
      });
    } catch (error) {
      console.error('Error generating PDF:', error);
      toast({
        title: "Erro ao gerar PDF",
        description: "Ocorreu um erro durante a exportação. Tente novamente.",
        variant: "destructive",
      });
    }
  };

  const normalizePhone = (phone: string) => {
    return phone.trim() || "0800 718 0896";
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button 
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-lg"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Exportar como PDF A4
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
        <div 
          ref={flyerRef}
          className="bg-yellow-400 aspect-[210/297] w-full max-w-[794px] mx-auto relative"
          style={{ 
            backgroundColor: '#FFE600',
            fontFamily: 'system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Header with logo area */}
          <div className="text-center py-6 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
            <h1 className="text-4xl font-black tracking-wider">
              REDE ÚNICA
            </h1>
            <p className="text-xl font-bold mt-1">DE BATERIAS</p>
          </div>

          {/* Main content area */}
          <div className={`${config.padding} h-full`}>
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-blue-900 mb-2">
                NOSSAS LOJAS - {state}
              </h2>
              <div className="w-32 h-1 bg-blue-900 mx-auto"></div>
            </div>

            {/* Stores grid */}
            <div 
              className={`grid gap-${config.spacing.split('-')[1]} h-full`}
              style={{ 
                gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                alignContent: 'start'
              }}
            >
              {stores.map((store, index) => (
                <div key={index} className="bg-white rounded-lg shadow-md p-3 border-2 border-blue-200">
                  <h3 className={`font-black text-blue-900 ${config.fontSize} uppercase mb-1 leading-tight`}>
                    {store.cidade}
                  </h3>
                  <p className={`text-gray-700 mb-2 ${config.fontSize === 'text-xs' ? 'text-xs' : 'text-sm'} leading-tight`}>
                    {store.endereco}
                  </p>
                  
                  <div className="space-y-1">
                    <div className="flex items-center gap-1">
                      <Phone className="h-3 w-3 text-blue-600 flex-shrink-0" />
                      <span className={`text-blue-900 font-semibold ${config.fontSize === 'text-xs' ? 'text-xs' : 'text-sm'}`}>
                        {normalizePhone(store.telefone)}
                      </span>
                    </div>
                    
                    <div className="flex items-center gap-1">
                      <div className="h-3 w-3 bg-green-500 rounded-full flex-shrink-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">W</span>
                      </div>
                      <span className={`text-green-700 font-semibold ${config.fontSize === 'text-xs' ? 'text-xs' : 'text-sm'}`}>
                        {store.whatsapp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer */}
            <div className="text-center mt-6 pt-4 border-t-2 border-blue-900">
              <p className="text-blue-900 font-bold text-lg">
                QUALIDADE E CONFIANÇA EM BATERIAS
              </p>
              <p className="text-blue-800 font-semibold">
                www.redeunica.com.br
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-gray-600">
        <p>Visualização do panfleto A4 - {stores.length} lojas do {state}</p>
        <p className="text-sm">Layout otimizado automaticamente para {config.columns} colunas</p>
      </div>
    </div>
  );
};

export default FlyerPreview;
