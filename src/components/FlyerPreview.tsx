
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

  const handleExportPDF = async () => {
    try {
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
        width: 794,
        height: 1123,
      });

      const imgData = canvas.toDataURL('image/png');
      const pdf = new jsPDF('portrait', 'mm', 'a4');
      
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

  // WhatsApp SVG Icon Component
  const WhatsAppIcon = ({ className }: { className?: string }) => (
    <svg
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.893 3.106"
        fill="#25D366"
      />
    </svg>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-center">
        <Button 
          onClick={handleExportPDF}
          className="bg-green-600 hover:bg-green-700 text-white font-bold px-8 py-3 text-lg font-poppins"
          size="lg"
        >
          <Download className="mr-2 h-5 w-5" />
          Exportar como PDF A4
        </Button>
      </div>

      <Card className="max-w-4xl mx-auto overflow-hidden shadow-2xl">
        <div 
          ref={flyerRef}
          className="bg-yellow-400 aspect-[210/297] w-full max-w-[794px] mx-auto relative font-poppins"
          style={{ 
            backgroundColor: '#FFE600',
            fontFamily: 'Poppins, system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Header with logo area */}
          <div className="text-center py-8 bg-gradient-to-r from-blue-900 to-blue-800 text-white">
            <h1 className="text-4xl font-black tracking-wider font-poppins">
              REDE ÚNICA
            </h1>
            <p className="text-xl font-bold mt-1 font-poppins">DE BATERIAS</p>
          </div>

          {/* Main content area with improved spacing */}
          <div className="px-6 py-6 min-h-0 flex flex-col">
            <div className="text-center mb-6">
              <h2 className="text-3xl font-bold text-blue-900 mb-3 font-poppins">
                NOSSAS LOJAS - {state}
              </h2>
              <div className="w-32 h-1 bg-blue-900 mx-auto"></div>
            </div>

            {/* Stores grid with improved responsive layout and spacing */}
            <div className="flex-1 pb-16">
              <div 
                className="grid gap-4 auto-rows-max"
                style={{ 
                  gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
                  alignContent: 'start'
                }}
              >
                {stores.map((store, index) => (
                  <div 
                    key={index} 
                    className="bg-yellow-300 bg-opacity-40 backdrop-blur-sm rounded-2xl shadow-lg p-5 border border-yellow-200 hover:transform hover:scale-102 hover:shadow-xl transition-all duration-300 ease-in-out break-words"
                    style={{
                      backgroundColor: 'rgba(255, 230, 0, 0.3)',
                      borderRadius: '16px',
                      boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
                      overflowWrap: 'break-word',
                      wordBreak: 'break-word'
                    }}
                  >
                    <h3 
                      className="font-semibold text-blue-900 text-base uppercase mb-3 leading-tight font-poppins" 
                      style={{ 
                        fontWeight: 600, 
                        color: '#0A1A5A',
                        fontSize: '16px',
                        textTransform: 'uppercase'
                      }}
                    >
                      {store.cidade}
                    </h3>
                    
                    <p 
                      className="text-gray-800 mb-4 text-sm leading-tight font-poppins break-words" 
                      style={{ 
                        fontSize: '13px', 
                        fontWeight: 400, 
                        color: '#333333',
                        overflowWrap: 'break-word'
                      }}
                    >
                      {store.endereco}
                    </p>
                    
                    <div className="space-y-2">
                      <div className="flex items-center gap-2">
                        <Phone className="h-5 w-5 text-blue-600 flex-shrink-0" style={{ width: '20px', height: '20px' }} />
                        <span className="text-blue-900 font-medium text-sm font-poppins break-words" style={{ fontSize: '13px' }}>
                          {normalizePhone(store.telefone)}
                        </span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <WhatsAppIcon className="flex-shrink-0" />
                        <span className="text-green-700 font-medium text-sm font-poppins break-words" style={{ fontSize: '13px' }}>
                          {store.whatsapp}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Footer with proper spacing and z-index */}
            <div 
              className="mt-auto pt-8 text-center bg-gradient-to-t from-yellow-500 to-transparent"
              style={{ 
                marginTop: '40px',
                zIndex: 10,
                position: 'relative'
              }}
            >
              <p className="text-blue-900 font-bold text-xl font-poppins mb-1">
                QUALIDADE E CONFIANÇA EM BATERIAS
              </p>
              <p className="text-blue-800 font-semibold font-poppins">
                www.redeunica.com.br
              </p>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-gray-600 font-poppins">
        <p>Visualização do panfleto A4 - {stores.length} lojas do {state}</p>
        <p className="text-sm">Layout responsivo com espaçamento otimizado</p>
      </div>
    </div>
  );
};

export default FlyerPreview;
