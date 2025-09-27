import React, { useState } from 'react';
// Importe a biblioteca UI para <Button> (ex.: shadcn/ui - instale com npm install @shadcn/ui ou similar)
import { Button } from '@/components/ui/button'; // Ajuste o caminho conforme sua setup (ex.: shadcn, MUI, etc.)

// Função de exemplo para getSummaryByEmployee() - SUBSTITUA PELA SUA VERSÃO REAL
const getSummaryByEmployee = () => {
  // Exemplo de retorno: array de objetos com name, totalItems, itemCount, totalAdvances, advanceCount, grandTotal
  return [
    { name: 'João', totalItems: 100.50, itemCount: 5, totalAdvances: 50.00, advanceCount: 2, grandTotal: 150.50 },
    { name: 'Maria', totalItems: 200.00, itemCount: 10, totalAdvances: 100.00, advanceCount: 3, grandTotal: 300.00 },
  ];
};

// Estados de exemplo - SUBSTITUA PELOS SEUS (ex.: de useState, props ou API)
const initialStoreItems = [
  { value: 10, quantity: 5 }, // Exemplo
  { value: 20, quantity: 3 },
];
const initialAdvances = [
  { amount: 50 },
  { amount: 100 },
];

export default function TLSystemComponent() {
  const [showInterface, setShowInterface] = useState(false);
  const [storeItems, setStoreItems] = useState(initialStoreItems); // Seu estado real aqui
  const [advances, setAdvances] = useState(initialAdvances); // Seu estado real aqui

  // Função de exportação para PNG - ENVOLVI SEU TRY {} NESSA FUNÇÃO
  const exportToPNG = () => {
    try {
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (!ctx) return;
      canvas.width = 800;
      canvas.height = 1200;
      const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
      gradient.addColorStop(0, '#10b981');
      gradient.addColorStop(0.5, '#ffffff');
      gradient.addColorStop(1, '#10b981');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      ctx.fillStyle = '#000000';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'top';
      ctx.font = 'bold 32px Arial';
      ctx.fillText('TL SISTEMA DE AUTOMAÇÃO', canvas.width / 2, 40);
      ctx.font = 'bold 28px Arial';
      ctx.fillText('CONTROLE COLABORADORES', canvas.width / 2, 80);
      ctx.font = '18px Arial';
      ctx.fillText('Resumo Mensal', canvas.width / 2, 110);
      const summary = getSummaryByEmployee();
      const totalGeral = storeItems.reduce((sum, item) => sum + (item.value * item.quantity), 0) + advances.reduce((sum, adv) => sum + adv.amount, 0);
      let y = 150;
      ctx.font = 'bold 24px Arial';
      ctx.fillText(`TOTAL GERAL: R$ ${totalGeral.toFixed(2)}`, canvas.width / 2, y);
      y += 50;
      ctx.font = '18px Arial';
      ctx.fillText(`Itens: ${storeItems.length} | Adiantamentos: ${advances.length}`, canvas.width / 2, y);
      y += 60;
      ctx.font = 'bold 20px Arial';
      ctx.fillText('RESUMO POR COLABORADOR', canvas.width / 2, y);
      y += 50;
      summary.forEach((emp, i) => {
        if (y > 1000) return;
        ctx.font = 'bold 18px Arial';
        ctx.fillText(`${i+1}. ${emp.name}`, canvas.width / 2, y);
        y += 30;
        ctx.font = '16px Arial';
        ctx.fillText(`Itens: R$ ${emp.totalItems.toFixed(2)} (${emp.itemCount})`, canvas.width / 2, y);
        y += 25;
        ctx.fillText(`Adiant.: R$ ${emp.totalAdvances.toFixed(2)} (${emp.advanceCount})`, canvas.width / 2, y);
        y += 25;
        ctx.fillText(`Total: R$ ${emp.grandTotal.toFixed(2)}`, canvas.width / 2, y);
        y += 40;
      });
      ctx.font = '14px Arial';
      ctx.fillText(`Gerado: ${new Date().toLocaleString('pt-BR')}`, canvas.width / 2, canvas.height - 40);
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `resumo-tl-${new Date().toISOString().split('T')[0]}.png`;
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          URL.revokeObjectURL(url);
          const msg = encodeURIComponent('📊 Resumo TL Sistema - Veja anexo!');
          window.open(`https://web.whatsapp.com/send?text=${msg}`, '_blank');
        }
      });
    } catch (e) {
      console.error('Erro na exportação PNG:', e); // Log para debug
      alert('Erro ao exportar. Tente novamente.');
    }
  };

  if (!showInterface) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-emerald-900 via-white to-emerald-900">
        <div className="text-center p-8 rounded-xl bg-white/10 backdrop-blur-sm shadow-2xl">
          <h1 className="text-6xl font-bold text-white mb-4 bg-gradient-to-r from-blue-400 to-purple-600 bg-clip-text text-transparent animate-pulse">
            TL SISTEMA DE AUTOMAÇÃO
          </h1>
          <h2 className="text-3xl font-semibold text-white mb-8">
            CONTROLE COLABORADORES
          </h2>
          {/* Botão para acessar o sistema */}
          <Button 
            onClick={() => setShowInterface(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg mr-4"
          >
            Acessar Sistema
          </Button>
          {/* Botão ADICIONAL para exportar PNG diretamente do splash - OPCIONAL, mova se quiser */}
          <Button 
            onClick={exportToPNG}
            className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            Exportar Resumo PNG
          </Button>
        </div>
      </div>
    );
  }

  // Se showInterface for true, renderize a interface principal aqui
  return (
    <div className="p-8">
      <h2 className="text-2xl font-bold mb-4">Interface Principal do Sistema</h2>
      {/* Seu conteúdo principal aqui: listas de itens, adiantamentos, etc. */}
      <p>Exemplo: Total de itens: {storeItems.length}</p>
      <Button onClick={exportToPNG} className="mr-4">Exportar Resumo PNG</Button>
      <Button onClick={() => setShowInterface(false)}>Voltar ao Splash</Button>
    </div>
  );
}