import React, { useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Download, Phone } from 'lucide-react';
import { Store } from '@/types/store';
import { toast } from '@/hooks/use-toast';
import { useStores } from '@/hooks/useStores';

interface FlyerPreviewProps {
  stores: Store[];
  state: 'PR' | 'SP';
}



const FlyerPreview: React.FC<FlyerPreviewProps> = ({ stores, state }) => {
  const { stores: allStores } = useStores();
  const flyerRef = useRef<HTMLDivElement>(null);

  // Configuração dinâmica do layout baseada no número de lojas
  const getLayoutConfig = (storeCount: number) => {
    if (storeCount <= 4) {
      return { 
        columns: 2, 
        rows: 2,
        fontSize: 'text-xl',        // Fonte bem grande para poucos cards
        titleSize: 'text-2xl',      // Título ainda maior
        contactSize: 'text-lg',     // Contatos maiores
        gap: 'gap-6', 
        padding: 'p-8',
        cardPadding: 'p-6',
        minHeight: 'min-h-[200px]', // Cards bem altos
        iconSize: 'h-5 w-5',
        addressToContactSpacing: 'mb-4' // Espaçamento mínimo

      };
    } else if (storeCount <= 8) {
      return { 
        columns: 2, 
        rows: 4,
        fontSize: 'text-lg',        // Fonte grande
        titleSize: 'text-xl',
        contactSize: 'text-base',
        gap: 'gap-5', 
        padding: 'p-6',
        cardPadding: 'p-5',
        minHeight: 'min-h-[150px]',
        iconSize: 'h-4 w-4',
        addressToContactSpacing: 'mb-3' // Espaçamento mínimo

      };
    } else if (storeCount <= 12) {
      return { 
        columns: 3, 
        rows: 4,
        fontSize: 'text-base',      // Fonte média-grande
        titleSize: 'text-lg',
        contactSize: 'text-sm',
        gap: 'gap-4', 
        padding: 'p-5',
        cardPadding: 'p-4',
        minHeight: 'min-h-[120px]',
        iconSize: 'h-4 w-4',
        addressToContactSpacing: 'mb-3' // Espaçamento mínimo

      };
    } else if (storeCount <= 20) {
      return { 
        columns: 3, 
        rows: 6,
        fontSize: 'text-[17px]',        // Fonte média
        titleSize: 'text-[22px]',
        contactSize: 'text-[18px]',
        gap: 'gap-3', 
        padding: 'p-4',
        cardPadding: 'p-3',
        minHeight: 'min-h-[100px]',
        iconSize: 'h-7 w-7',
        addressToContactSpacing: 'mb-3' // Espaçamento mínimo

      };
    } else if (storeCount <= 30) {
      return { 
        columns: 5, 
        rows: 6,
        fontSize: 'text-xs',        // Fonte pequena
        titleSize: 'text-sm',
        contactSize: 'text-xs',
        gap: 'gap-2', 
        padding: 'p-3',
        cardPadding: 'p-2',
        minHeight: 'min-h-[85px]',
        iconSize: 'h-3 w-3',
        addressToContactSpacing: 'mb-1' // Espaçamento mínimo

      };
    } else {
      return { 
        columns: 5, 
        rows: Math.ceil(storeCount / 7),
        fontSize: 'text-[13px]',     // 10px
        titleSize: 'text-[15.5px]',     // 9px  
        contactSize: 'text-[13.5px]',   // 8px
        gap: 'gap-2', 
        padding: 'p-4',
        cardPadding: 'p-2',
        minHeight: 'min-h-[175px]',
        iconSize: 'h-4 w-4',
        addressToContactSpacing: 'mb-3' // Espaçamento mínimo

      };
    }
  };

  const config = getLayoutConfig(stores.length);

  const getStateName = (stateCode: string) => {
    return stateCode === 'PR' ? 'Paraná' : 'São Paulo';
  };

  const handleExportPDF = async () => {
  try {
    const html2canvas = (await import('html2canvas')).default;
    const jsPDF = (await import('jspdf')).default;

    if (!flyerRef.current) return;

    toast({
      title: "Gerando PDF...",
      description: "Aguarde enquanto preparamos seu panfleto.",
    });

    // Obter as dimensões reais do elemento
    const element = flyerRef.current;
    
    // Capturar o elemento com suas dimensões reais
    const canvas = await html2canvas(element, {
      scale: 2, // Alta qualidade
      useCORS: true,
      allowTaint: true,
      backgroundColor: '#FFE600',
      scrollX: 0,
      scrollY: 0,
      // Garantir que capture todo o conteúdo
      height: element.scrollHeight,
      width: element.scrollWidth
    });

    const imgData = canvas.toDataURL('image/png', 1.0); // Máxima qualidade
    
    // Usar as dimensões originais do canvas para manter proporções
    const canvasWidth = canvas.width;
    const canvasHeight = canvas.height;
    
    // Converter pixels para mm (aproximadamente 1px = 0.264583mm)
    const pdfWidth = canvasWidth * 0.264583;
    const pdfHeight = canvasHeight * 0.264583;
    
    // Criar PDF com as dimensões proporcionais ao preview
    const pdf = new jsPDF({
      orientation: pdfHeight > pdfWidth ? 'portrait' : 'landscape',
      unit: 'mm',
      format: [pdfWidth, pdfHeight]
    });
    
    // Adicionar a imagem mantendo as proporções originais
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    
    // Salvar o PDF
    pdf.save(`panfleto-rede-unica-${state.toLowerCase()}.pdf`);

    toast({
      title: "PDF gerado com sucesso!",
      description: `Panfleto do ${state} foi exportado mantendo as proporções originais.`,
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
    <div className="space-y-6 font-poppins">
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
          className="bg-yellow-400 aspect-[210/297] w-full max-w-[904px] mx-auto relative flex flex-col font-poppins"
          style={{ 
            backgroundColor: '#FFE600',
            fontFamily: 'Poppins, system-ui, -apple-system, sans-serif'
          }}
        >
          {/* Header fixo */}
          <div className="relative bg-gradient-to-r from-blue-900 via-blue-800 to-blue-900 text-white overflow-hidden flex-shrink-0">
            <div className="absolute top-0 left-0 w-full h-full">
              <div className="absolute top-0 left-0 w-16 h-full bg-gradient-to-r from-blue-600 to-transparent transform -skew-x-12"></div>
              <div className="absolute top-0 right-0 w-16 h-full bg-gradient-to-l from-blue-600 to-transparent transform skew-x-12"></div>
            </div>
            
            <div className="relative flex items-center justify-between px-8 py-6 min-h-[120px]">
              <div className="flex items-center space-x-4 flex-1 min-w-0">
                <img 
                  src="/logo1.png" 
                  alt="Rede Única Logo" 
                  className="h-16 w-auto object-contain flex-shrink-0"
                />
                <div className="text-left flex-1 min-w-0">
                  <h1 className="text-3xl font-black tracking-wider leading-tight font-poppins">
                    Lojas no {getStateName(state)}
                  </h1>
                  <p className="text-sm font-semibold text-blue-200 uppercase tracking-wide mt-1 font-poppins">
                    Para mais Lojas consulte nosso site: www.redeunicadebaterias.com.br
                  </p>
                </div>
              </div>
              
              <div className="flex-shrink-0 ml-6">
                <div className="bg-yellow-400 rounded-lg px-4 py-3 border border-yellow-500 shadow-sm min-w-[160px]">
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-900 leading-none font-poppins" style={{ lineHeight: '0.6' }}>
                      {allStores.length} Lojas
                    </div>
                    <div className="text-xs font-bold text-blue-800 uppercase tracking-wide mt-1 font-poppins" style={{ lineHeight: '2.5' }}>
                      para lhe atender melhor!
                    </div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="absolute bottom-0 left-0 w-full h-1 bg-gradient-to-r from-yellow-400 via-yellow-300 to-yellow-400"></div>
          </div>

          {/* Área de conteúdo principal - EXPANDIDA */}
          <div className={`${config.padding} flex-1 flex flex-col`}>
            {/* Grid de lojas que ocupa todo o espaço disponível */}
            <div 
              className={`grid ${config.gap} flex-1`}
              style={{ 
                gridTemplateColumns: `repeat(${config.columns}, 1fr)`,
                gridTemplateRows: `repeat(auto-fit, minmax(${config.minHeight.replace('min-h-[', '').replace(']', '')}, 1fr))`,
                alignContent: 'stretch'
              }}
            >
              {stores.map((store, index) => (
                <div 
                  key={index} 
                  className={`bg-yellow-200 bg-opacity-80 rounded-lg shadow-lg ${config.cardPadding} border-2 border-yellow-300 backdrop-blur-sm flex flex-col justify-between transition-all hover:bg-opacity-90 hover:shadow-xl ${config.minHeight}`}
                >
                  <div className="flex-1">
  <h3 className={`font-black text-blue-900 ${config.titleSize} uppercase mb-0.5 leading-tight font-poppins`}>
    {store.cidade}
  </h3>
  <p className={`text-gray-700 leading-relaxed font-poppins ${config.fontSize} ${config.addressToContactSpacing}`}>
    {store.endereco}
  </p>
</div>
                  
                  

                  <div className="space-y-2 flex-shrink-0">
                    {/* Container de telefone com alinhamento aprimorado */}
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 pt-0.5">
                        <Phone className={`text-blue-600 ${config.iconSize}`} />
                      </div>
                      <span className={`text-blue-900 font-semibold leading-tight font-poppins ${config.contactSize} flex-1`} style={{ lineHeight: '0.5' }}>
                        {normalizePhone(store.telefone)}
                      </span>
                    </div>
                    
                    {/* Container de WhatsApp com alinhamento aprimorado */}
                    <div className="flex items-start gap-2">
                      <div className="flex-shrink-0 pt-0.5">
                        <img 
                          src="/wpp.webp" 
                          alt="WhatsApp" 
                          className={`${config.iconSize}`}
                        />
                      </div>
                      <span className={`text-green-700 font-semibold leading-tight font-poppins ${config.contactSize} flex-1`} style={{ lineHeight: '0.5' }}>
                        {store.whatsapp}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Footer fixo na parte inferior */}
            <div className="text-center mt-4 pt-3 border-t-2 border-blue-900 flex-shrink-0">
              <p className="text-blue-900 font-bold text-[23px] leading-tight font-poppins">
A MAIOR REDE DE LOJAS DE BATERIAS AUTOMOTIVAS DO BRASIL             </p>
              <br></br>
            </div>
          </div>
        </div>
      </Card>

      <div className="text-center text-gray-600 font-poppins">
        <p>Visualização do panfleto A4 - {stores.length} lojas do {state}</p>
        <p className="text-sm">
          Layout otimizado: {config.columns} colunas × {config.rows} linhas estimadas
        </p>
      </div>
    </div>
  );
};

export default FlyerPreview;