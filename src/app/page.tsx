"use client";

import React, { useState, useEffect } from "react";

// Logo TL SISTEMAS (Componente Reutilizável)
function TLLogo({ size = 'normal', position = 'center' }: { size?: 'small' | 'normal' | 'large'; position?: 'center' | 'top-left' }) {
  const logoSizes = {
    small: 'text-xl',
    normal: 'text-3xl',
    large: 'text-6xl'
  };

  const positions = {
    center: 'flex items-center justify-center',
    'top-left': 'flex items-center'
  };

  return (
    <div className={`${positions[position]} space-x-3`}>
      <div className="relative">
        <div className="bg-gradient-to-br from-blue-500 to-purple-600 p-3 rounded-xl shadow-lg">
          <span className="text-white font-bold text-xl">TL</span>
        </div>
      </div>
      <div>
        <h1 className={`font-bold text-white ${logoSizes[size]} tracking-wide`}>TL SISTEMAS</h1>
        <p className="text-white/80 text-sm">DE AUTOMAÇÃO</p>
      </div>
    </div>
  );
}

// Tab Colaboradores
function ColaboradoresTab({ employees, setEmployees, texts }: { 
  employees: { name: string; role: string }[]; 
  setEmployees: React.Dispatch<React.SetStateAction<{ name: string; role: string }[]>>; 
  texts: any 
}) {
  const [newEmployee, setNewEmployee] = useState('');
  const [newRole, setNewRole] = useState('');

  const addEmployee = () => {
    if (newEmployee.trim() && newRole.trim()) {
      setEmployees([...employees, { name: newEmployee.trim(), role: newRole.trim() }]);
      setNewEmployee('');
      setNewRole('');
    }
  };

  const removeEmployee = (index: number) => {
    setEmployees(employees.filter((_, i) => i !== index));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">{texts.addEmployees}</h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-white/80 mb-2 font-medium">{texts.employeeName}</label>
            <input
              value={newEmployee}
              onChange={(e) => setNewEmployee(e.target.value)}
              placeholder={texts.employeeNamePlaceholder}
              className="w-full p-4 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 font-medium">{texts.companyRole}</label>
            <input
              value={newRole}
              onChange={(e) => setNewRole(e.target.value)}
              placeholder={texts.companyRolePlaceholder}
              className="w-full p-4 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <button
            onClick={addEmployee}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>+</span>
            <span>{texts.addEmployee}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">{texts.employeeList}</h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{texts.total}: {employees.length} {texts.employees}</h3>
          {employees.length === 0 ? (
            <p className="text-white/70 text-center py-8">{texts.noEmployees}</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {employees.map((emp, index) => (
                <div key={index} className="flex justify-between items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div>
                    <span className="text-white font-medium text-lg">{emp.name}</span>
                    <p className="text-blue-300 text-sm">{emp.role}</p>
                  </div>
                  <button
                    onClick={() => removeEmployee(index)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                  >
                    <span>🗑️</span>
                    <span>{texts.remove}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// Tab Itens
function ItensTab({ employees, selectedEmployee, setSelectedEmployee, items, setItems, texts }: { 
  employees: { name: string; role: string }[];
  selectedEmployee: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
  items: { employee: string; itemName: string; quantity: number; value: number; date: string }[];
  setItems: React.Dispatch<React.SetStateAction<{ employee: string; itemName: string; quantity: number; value: number; date: string }[]>>;
  texts: any;
}) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');

  const addItem = () => {
    if (selectedEmployee && itemName.trim() && quantity && value) {
      setItems([...items, { 
        employee: selectedEmployee, 
        itemName: itemName.trim(), 
        quantity: parseInt(quantity), 
        value: parseFloat(value),
        date: new Date().toLocaleString('pt-BR')
      }]);
      setItemName('');
      setQuantity('');
      setValue('');
    }
  };

  const removeItem = (index: number) => {
    setItems(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">{texts.selectForItems}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {employees.map((emp, index) => (
            <button
              key={index}
              onClick={() => setSelectedEmployee(emp.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedEmployee === emp.name
                  ? 'bg-green-500 border-green-400 text-white shadow-lg'
                  : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <p className="font-medium">{emp.name}</p>
                <p className="text-xs opacity-80">{emp.role}</p>
              </div>
            </button>
          ))}
        </div>
        {selectedEmployee && (
          <p className="text-green-300 mt-4 text-center font-medium">
            {texts.selectedEmployee}: {selectedEmployee}
          </p>
        )}
      </div>

      {selectedEmployee && (
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">{texts.addStoreItems}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.itemName}</label>
              <input
                value={itemName}
                onChange={(e) => setItemName(e.target.value)}
                placeholder={texts.itemPlaceholder}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-white/80 mb-2 font-medium">{texts.quantity}</label>
                <input
                  type="number"
                  value={quantity}
                  onChange={(e) => setQuantity(e.target.value)}
                  placeholder="1"
                  className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 font-medium">{texts.value}</label>
                <input
                  type="number"
                  step="0.01"
                  value={value}
                  onChange={(e) => setValue(e.target.value)}
                  placeholder="0.00"
                  className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>
            </div>
            <button
              onClick={addItem}
              className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              📦 {texts.addItem}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">{selectedEmployee} {texts.itemsOf}</h3>
            {items.filter(item => item.employee === selectedEmployee).length === 0 ? (
              <p className="text-white/70 text-center py-4">{texts.noItems}</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {items.filter(item => item.employee === selectedEmployee).map((item, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.itemName}</p>
                        <p className="text-green-300 text-sm">Qtd: {item.quantity} | Valor: R$ {item.value.toFixed(2)} | Total: R$ {(item.quantity * item.value).toFixed(2)}</p>
                        <p className="text-white/60 text-xs">{item.date}</p>
                      </div>
                      <button
                        onClick={() => removeItem(items.findIndex(i => i === item))}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedEmployee && employees.length > 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">{texts.selectEmployeeItems}</p>
        </div>
      )}
    </div>
  );
}

// Tab Vales
function ValesTab({ employees, selectedEmployee, setSelectedEmployee, advances, setAdvances, texts }: { 
  employees: { name: string; role: string }[];
  selectedEmployee: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
  advances: { employee: string; amount: number; reason: string; date: string }[];
  setAdvances: React.Dispatch<React.SetStateAction<{ employee: string; amount: number; reason: string; date: string }[]>>;
  texts: any;
}) {
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('');

  const addAdvance = () => {
    if (selectedEmployee && advanceAmount && advanceReason.trim()) {
      setAdvances([...advances, { 
        employee: selectedEmployee, 
        amount: parseFloat(advanceAmount), 
        reason: advanceReason.trim(),
        date: new Date().toLocaleString('pt-BR')
      }]);
      setAdvanceAmount('');
      setAdvanceReason('');
    }
  };

  const removeAdvance = (index: number) => {
    setAdvances(advances.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">{texts.selectForAdvance}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {employees.map((emp, index) => (
            <button
              key={index}
              onClick={() => setSelectedEmployee(emp.name)}
              className={`p-4 rounded-lg border-2 transition-all duration-300 transform hover:scale-105 ${
                selectedEmployee === emp.name
                  ? 'bg-purple-500 border-purple-400 text-white shadow-lg'
                  : 'bg-white/10 border-white/30 text-white hover:bg-white/20'
              }`}
            >
              <div className="text-center">
                <p className="font-medium">{emp.name}</p>
                <p className="text-xs opacity-80">{emp.role}</p>
              </div>
            </button>
          ))}
        </div>
        {selectedEmployee && (
          <p className="text-purple-300 mt-4 text-center font-medium">
            {texts.selectedEmployee}: {selectedEmployee}
          </p>
        )}
      </div>

      {selectedEmployee && (
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h3 className="text-xl font-bold text-white mb-4">{texts.registerAdvance}</h3>
          <div className="space-y-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.advanceValue}</label>
              <input
                type="number"
                step="0.01"
                value={advanceAmount}
                onChange={(e) => setAdvanceAmount(e.target.value)}
                placeholder="100.00"
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.reason}</label>
              <textarea
                value={advanceReason}
                onChange={(e) => setAdvanceReason(e.target.value)}
                placeholder={texts.reasonPlaceholder}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all"
                rows={3}
              />
            </div>
            <button
              onClick={addAdvance}
              className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              💰 {texts.registerAdvanceBtn}
            </button>
          </div>

          <div className="mt-6">
            <h3 className="text-lg font-semibold text-white mb-4">{selectedEmployee} {texts.advancesOf}</h3>
            {advances.filter(adv => adv.employee === selectedEmployee).length === 0 ? (
              <p className="text-white/70 text-center py-4">{texts.noAdvances}</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {advances.filter(adv => adv.employee === selectedEmployee).map((adv, index) => (
                  <div key={index} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-300 font-medium">R$ {adv.amount.toFixed(2)}</p>
                        <p className="text-white/70 text-sm">{adv.reason}</p>
                        <p className="text-white/60 text-xs">{adv.date}</p>
                      </div>
                      <button
                        onClick={() => removeAdvance(advances.findIndex(a => a === adv))}
                        className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600 text-xs"
                      >
                        ✕
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {!selectedEmployee && employees.length > 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">{texts.selectEmployeeAdvance}</p>
        </div>
      )}
    </div>
  );
}

// Tab Relatórios
function RelatoriosTab({ employees, items, advances, texts }: { 
  employees: { name: string; role: string }[]; 
  items: { employee: string; itemName: string; quantity: number; value: number; date: string }[];
  advances: { employee: string; amount: number; reason: string; date: string }[];
  texts: any;
}) {
  const [filterEmployee, setFilterEmployee] = useState('all');

  const getEmployeeSummary = () => {
    const filteredEmployees = filterEmployee === 'all' ? employees : employees.filter(emp => emp.name === filterEmployee);
    return filteredEmployees.map(emp => {
      const empItems = items.filter(item => item.employee === emp.name);
      const empAdvances = advances.filter(adv => adv.employee === emp.name);
      const totalItems = empItems.reduce((sum, item) => sum + (item.quantity * item.value), 0);
      const totalAdvances = empAdvances.reduce((sum, adv) => sum + adv.amount, 0);
      return {
        ...emp,
        totalItems,
        totalAdvances,
        grandTotal: totalItems + totalAdvances,
        itemCount: empItems.length,
        advanceCount: empAdvances.length
      };
    });
  };

  const getFilteredItems = () => filterEmployee === 'all' ? items : items.filter(item => item.employee === filterEmployee);
  const getFilteredAdvances = () => filterEmployee === 'all' ? advances : advances.filter(adv => adv.employee === filterEmployee);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{texts.finalReports}</h2>
      
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <label className="text-white font-medium">{texts.filterEmployee}</label>
          <select
            value={filterEmployee}
            onChange={(e) => setFilterEmployee(e.target.value)}
            className="p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            <option value="all">{texts.allEmployees}</option>
            {employees.map((emp, index) => (
              <option key={index} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.employeesCard}</h3>
          <p className="text-4xl font-bold text-white">{filterEmployee === 'all' ? employees.length : 1}</p>
          <p className="text-blue-100">{filterEmployee === 'all' ? texts.totalRegistered : texts.selected}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.itemsCard}</h3>
          <p className="text-4xl font-bold text-white">{getFilteredItems().length}</p>
          <p className="text-green-100">{filterEmployee === 'all' ? texts.totalItems : `${texts.from} ${filterEmployee}`}</p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.advancesCard}</h3>
          <p className="text-4xl font-bold text-white">{getFilteredAdvances().length}</p>
          <p className="text-purple-100">{filterEmployee === 'all' ? texts.totalAdvances : `${texts.from} ${filterEmployee}`}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.grandTotal}</h3>
          <p className="text-4xl font-bold text-white">
            R$ {(getFilteredItems().reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                 getFilteredAdvances().reduce((sum, adv) => sum + adv.amount, 0)).toFixed(2)}
          </p>
          <p className="text-yellow-100">{texts.sumItemsAdvances}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.summaryByEmployee}</h3>
        {getEmployeeSummary().length === 0 ? (
          <p className="text-white/70 text-center py-4">{texts.noEmployeesRegistered}</p>
        ) : (
          <div className="space-y-4">
            {getEmployeeSummary().map((emp, index) => (
              <div key={index} className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-white">{emp.name}</h4>
                    <p className="text-blue-300 text-sm">{emp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-300">R$ {emp.grandTotal.toFixed(2)}</p>
                    <p className="text-white/60 text-sm">{texts.totalToDeduct}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-300">{texts.itemsCard}: R$ {emp.totalItems.toFixed(2)}</p>
                    <p className="text-white/60">{emp.itemCount} {texts.itemsCard.toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-purple-300">{texts.advancesCard}: R$ {emp.totalAdvances.toFixed(2)}</p>
                    <p className="text-white/60">{emp.advanceCount} {texts.advancesCard.toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// Tab Configurações - CORRIGIDA
function ConfiguracoesTab({ companyName, setCompanyName, texts, employees, items, advances }: { 
  companyName: string; 
  setCompanyName: React.Dispatch<React.SetStateAction<string>>; 
  texts: any; 
  employees: any[]; 
  items: any[]; 
  advances: any[] 
}) {
  const [theme, setTheme] = useState('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState('BRL');
  const [timeFormat, setTimeFormat] = useState('24h');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  // TODAS AS FUNÇÕES DEFINIDAS AQUI DENTRO
  const exportData = () => {
    const data = JSON.stringify({ 
      company: { name: companyName, address: companyAddress, phone: companyPhone },
      employees, 
      items, 
      advances,
      exportDate: new Date().toISOString(),
      version: '1.0'
    }, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tl-sistema-backup-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    alert('Backup exportado com sucesso!');
  };

  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const data = JSON.parse(e.target?.result as string);
          if (confirm('Deseja importar os dados? Isso substituirá todos os dados atuais.')) {
            alert('Importação concluída! Recarregue a página.');
          }
        } catch (error) {
          alert('Erro ao importar arquivo. Verifique se é um backup válido.');
        }
      };
      reader.readAsText(file);
    }
  };

  const generateReport = () => {
    const reportData = {
      totalEmployees: employees.length,
      totalItems: items.length,
      totalAdvances: advances.length,
      totalValue: items.reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                  advances.reduce((sum, adv) => sum + adv.amount, 0),
      generatedAt: new Date().toLocaleString('pt-BR')
    };
    
    const report = `
RELATÓRIO TL SISTEMAS
=====================
Data: ${reportData.generatedAt}
Total de Colaboradores: ${reportData.totalEmployees}
Total de Itens: ${reportData.totalItems}
Total de Vales: ${reportData.totalAdvances}
Valor Total: R$ ${reportData.totalValue.toFixed(2)}
=====================
Gerado automaticamente pelo TL Sistema de Automação
    `;
    
    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-tl-${new Date().toISOString().split('T')[0]}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita!')) {
      localStorage.clear();
      alert('Todos os dados foram removidos. Recarregue a página.');
    }
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{texts.systemSettings}</h2>
      
      {/* Configurações da Empresa */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.companyInfo}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.companyName}</label>
              <input
                value={companyName}
                onChange={(e) => setCompanyName(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder={texts.companyPlaceholder}
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 font-medium">Telefone</label>
              <input
                value={companyPhone}
                onChange={(e) => setCompanyPhone(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div>
            <label className="block text-white/80 mb-2 font-medium">Endereço</label>
            <input
              value={companyAddress}
              onChange={(e) => setCompanyAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              placeholder="Digite o endereço da empresa..."
            />
          </div>
          <button
            onClick={() => alert(`Configurações salvas para: ${companyName}`)}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            💾 {texts.saveSettings}
          </button>
        </div>
      </div>

      {/* Backup e Restauração */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.backupData}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={exportData}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              📥 {texts.exportData}
            </button>
            <label className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center">
              📤 Importar Dados
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={generateReport}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            📊 Gerar Relatório (TXT)
          </button>
          <button
            onClick={clearAllData}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            🗑️ {texts.clearData}
          </button>
        </div>
      </div>

      {/* Configurações do Sistema */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Configurações do Sistema</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.systemTheme}</label>
              <select
                value={theme}
                onChange={(e) => setTheme(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              >
                <option value="dark">{texts.darkTheme}</option>
                <option value="light">{texts.lightTheme}</option>
                <option value="auto">{texts.autoTheme}</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-2 font-medium">Moeda</label>
              <select
                value={currency}
                onChange={(e) => setCurrency(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              >
                <option value="BRL">Real (R$)</option>
                <option value="USD">Dólar ($)</option>
                <option value="EUR">Euro (€)</option>
                <option value="CNY">Yuan (¥)</option>
              </select>
            </div>
          </div>
          <div className="flex items-center space-x-8">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e) => setAutoSave(e.target.checked)}
                className="rounded"
              />
              <span>Auto-salvar dados</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e) => setNotifications(e.target.checked)}
                className="rounded"
              />
              <span>Notificações do sistema</span>
            </label>
          </div>
        </div>
      </div>

      {/* Estatísticas do Sistema */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Estatísticas do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-300">{employees.length}</p>
            <p className="text-white/70 text-sm">Colaboradores</p>
          </div>
          <div className="bg-green-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-300">{items.length}</p>
            <p className="text-white/70 text-sm">Itens Registrados</p>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-300">{advances.length}</p>
            <p className="text-white/70 text-sm">Vale-Adiantamentos</p>
          </div>
          <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-300">
              R$ {(items.reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                   advances.reduce((sum, adv) => sum + adv.amount, 0)).toFixed(2)}
            </p>
            <p className="text-white/70 text-sm">Valor Total</p>
          </div>
        </div>
      </div>

      {/* Informações do Sistema */}
      <div className="bg-white/5 p-4 rounded">
        <h4 className="text-lg font-semibold text-white mb-2">{texts.systemInfo}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-white/70">
          <p>• {texts.version}: TL Sistemas v1.0</p>
          <p>• {texts.type}: {texts.systemType}</p>
          <p>• {texts.developers}: TL Team</p>
          <p>• {texts.creationDate}: {new Date().toLocaleDateString('pt-BR')}</p>
          <p>• Status: {autoSave ? 'Auto-save Ativo' : 'Auto-save Desativado'}</p>
          <p>• Notificações: {notifications ? 'Ativas' : 'Desativadas'}</p>
        </div>
      </div>
    </div>
  );
}

// Componente Principal
export default function Home() {
  const [showSystem, setShowSystem] = useState(false);
  const [activeTab, setActiveTab] = useState('colaboradores');
  const [employees, setEmployees] = useState<{ name: string; role: string }[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState('');
  const [items, setItems] = useState<{ employee: string; itemName: string; quantity: number; value: number; date: string }[]>([]);
  const [advances, setAdvances] = useState<{ employee: string; amount: number; reason: string; date: string }[]>([]);
  const [companyName, setCompanyName] = useState('TL Empresa');
  const [language, setLanguage] = useState<'pt' | 'zh'>('pt');

  // Persistência de dados
  useEffect(() => {
    const savedEmployees = localStorage.getItem('tl-employees');
    const savedItems = localStorage.getItem('tl-items');
    const savedAdvances = localStorage.getItem('tl-advances');
    const savedCompany = localStorage.getItem('tl-company');
    
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedItems) setItems(JSON.parse(savedItems));
    if (savedAdvances) setAdvances(JSON.parse(savedAdvances));
    if (savedCompany) setCompanyName(savedCompany);
  }, []);

  useEffect(() => {
    localStorage.setItem('tl-employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('tl-items', JSON.stringify(items));
  }, [items]);

  useEffect(() => {
    localStorage.setItem('tl-advances', JSON.stringify(advances));
  }, [advances]);

  useEffect(() => {
    localStorage.setItem('tl-company', companyName);
  }, [companyName]);

  const toggleLanguage = () => {
    setLanguage(language === 'pt' ? 'zh' : 'pt');
  };

  const texts = {
    pt: {
      addEmployees: 'Adicionar Colaboradores',
      employeeName: 'Nome do Colaborador',
      employeeNamePlaceholder: 'Digite o nome completo...',
      companyRole: 'Função na Empresa',
      companyRolePlaceholder: 'Ex: Vendedor, Gerente, Assistente...',
      addEmployee: 'Adicionar Colaborador',
      employeeList: 'Lista de Colaboradores',
      total: 'Total',
      employees: 'colaboradores',
      noEmployees: 'Nenhum colaborador adicionado.',
      remove: 'Remover',
      selectForItems: 'Selecionar Colaborador para Itens',
      selectedEmployee: 'Colaborador selecionado',
      addStoreItems: 'Adicionar Itens da Loja',
      itemName: 'Nome do Item',
      itemPlaceholder: 'Ex: Caneta, Notebook...',
      quantity: 'Quantidade',
      value: 'Valor (R$)',
      addItem: 'Adicionar Item',
      itemsOf: 'Itens de',
      noItems: 'Nenhum item registrado.',
      selectEmployeeItems: 'Selecione um colaborador acima para registrar itens',
      selectForAdvance: 'Selecionar Colaborador para Vale-Adiantamento',
      registerAdvance: 'Registrar Vale-Adiantamento',
      advanceValue: 'Valor do Adiantamento (R$)',
      reason: 'Motivo',
      reasonPlaceholder: 'Ex: Emergência familiar, conta médica...',
      registerAdvanceBtn: 'Registrar Vale-Adiantamento',
      advancesOf: 'Vales de',
      noAdvances: 'Nenhum vale registrado.',
      selectEmployeeAdvance: 'Selecione um colaborador acima para registrar vale-adiantamento',
      finalReports: 'Relatórios Finais',
      filterEmployee: 'Filtrar por Colaborador:',
      allEmployees: 'Todos os Colaboradores',
      employeesCard: 'Colaboradores',
      totalRegistered: 'Total cadastrados',
      selected: 'Selecionado',
      itemsCard: 'Itens',
      totalItems: 'Total registrados',
      from: 'De',
      advancesCard: 'Vales',
      totalAdvances: 'Total concedidos',
      grandTotal: 'Total Geral',
      sumItemsAdvances: 'Soma de Itens + Vales',
      summaryByEmployee: 'Resumo por Colaborador',
      noEmployeesRegistered: 'Nenhum colaborador cadastrado.',
      totalToDeduct: 'Total a descontar',
      systemSettings: 'Configurações do Sistema',
      companyInfo: 'Informações da Empresa',
      companyName: 'Nome da Empresa',
      companyPlaceholder: 'Digite o nome da empresa...',
      saveSettings: 'Salvar Configurações',
      backupData: 'Backup e Dados',
      exportData: 'Exportar Dados (JSON)',
      clearData: 'Limpar Todos os Dados',
      appearance: 'Aparência',
      systemTheme: 'Tema do Sistema',
      darkTheme: 'Escuro (Futurista)',
      lightTheme: 'Claro',
      autoTheme: 'Automático',
      systemInfo: 'Informações do Sistema',
      version: 'Versão',
      type: 'Tipo',
      systemType: 'Sistema de Automação',
      developers: 'Desenvolvedores',
      creationDate: 'Data de Criação',
      backToHome: 'Voltar ao Início',
      tabs: {
        employees: 'Colaboradores',
        items: 'Itens da Loja',
        advances: 'Vale-Adiantamento',
        reports: 'Relatórios',
        settings: 'Configurações'
      }
    },
    zh: {
      addEmployees: '添加员工',
      employeeName: '员工姓名',
      employeeNamePlaceholder: '输入全名...',
      companyRole: '公司职位',
      companyRolePlaceholder: '例如：销售员、经理、助理...',
      addEmployee: '添加员工',
      employeeList: '员工列表',
      total: '总计',
      employees: '员工',
      noEmployees: '尚未添加员工',
      remove: '删除',
      selectForItems: '选择员工添加物品',
      selectedEmployee: '已选择员工',
      addStoreItems: '添加商店物品',
      itemName: '物品名称',
      itemPlaceholder: '例如：钢笔、笔记本电脑...',
      quantity: '数量',
      value: '价值 (R$)',
      addItem: '添加物品',
      itemsOf: '的物品',
      noItems: '暂无物品记录',
      selectEmployeeItems: '请在上方选择一名员工来记录物品',
      selectForAdvance: '选择员工发放预支工资',
      registerAdvance: '登记预支工资',
      advanceValue: '预支金额 (R$)',
      reason: '原因',
      reasonPlaceholder: '例如：家庭紧急情况、医疗费用...',
      registerAdvanceBtn: '登记预支工资',
      advancesOf: '的预支工资',
      noAdvances: '暂无预支记录',
      selectEmployeeAdvance: '请在上方选择一名员工来记录预支工资',
      finalReports: '最终报告',
      filterEmployee: '按员工筛选:',
      allEmployees: '所有员工',
      employeesCard: '员工',
      totalRegistered: '总计注册',
      selected: '已选择',
      itemsCard: '物品',
      totalItems: '总计登记',
      from: '来自',
      advancesCard: '预支工资',
      totalAdvances: '总计发放',
      grandTotal: '总计',
      sumItemsAdvances: '物品+预支工资总和',
      summaryByEmployee: '员工汇总',
      noEmployeesRegistered: '暂无员工注册',
      totalToDeduct: '应扣除总额',
      systemSettings: '系统配置',
      companyInfo: '公司信息',
      companyName: '公司名称',
      companyPlaceholder: '输入公司名称...',
      saveSettings: '保存配置',
      backupData: '备份和数据',
      exportData: '导出数据',
      clearData: '清除所有数据',
      appearance: '外观',
      systemTheme: '系统主题',
      darkTheme: '深色主题（未来风格）',
      lightTheme: '浅色主题',
      autoTheme: '自动',
      systemInfo: '系统信息',
      version: '版本',
      type: '类型',
      systemType: '自动化系统',
      developers: '开发者',
      creationDate: '创建日期',
      backToHome: '返回首页',
      tabs: {
        employees: '员工',
        items: '商店物品',
        advances: '预支工资',
        reports: '报告',
        settings: '配置'
      }
    }
  };

  const t = texts[language];

  if (!showSystem) {
    return (
      <main className="min-h-screen flex flex-col items-center justify-center p-8 bg-gradient-to-br from-blue-900 via-indigo-800 to-blue-900 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-500/30 via-indigo-500/20 to-cyan-500/30 animate-pulse"></div>
        <div className="absolute top-20 left-20 w-40 h-40 bg-blue-400/40 rounded-full blur-3xl animate-bounce"></div>
        <div className="absolute bottom-20 right-20 w-32 h-32 bg-indigo-400/40 rounded-full blur-2xl animate-pulse"></div>
        <div className="absolute top-1/3 right-1/4 w-20 h-20 bg-cyan-400/40 rounded-full blur-xl animate-ping"></div>
        <div className="absolute bottom-1/3 left-1/3 w-28 h-28 bg-blue-300/30 rounded-full blur-2xl animate-bounce"></div>
        
        <div className="text-center space-y-16 max-w-5xl mx-auto relative z-10">
          <div className="flex items-center justify-center">
            <div className="relative">
              <div className="bg-gradient-to-br from-blue-400 via-indigo-500 to-cyan-400 p-12 rounded-3xl shadow-2xl border-2 border-blue-300/50 backdrop-blur-sm">
                <div className="flex items-center space-x-8">
                  <div className="relative">
                    <div className="w-24 h-24 bg-gradient-to-br from-white to-blue-50 rounded-2xl flex items-center justify-center shadow-2xl">
                      <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 to-indigo-700 bg-clip-text text-transparent">TL</span>
                    </div>
                    <div className="absolute -top-2 -right-2 w-6 h-6 bg-cyan-400 rounded-full animate-ping shadow-lg"></div>
                    <div className="absolute -bottom-2 -left-2 w-5 h-5 bg-blue-400 rounded-full animate-pulse shadow-lg"></div>
                  </div>
                  <div>
                    <h1 className="text-5xl font-bold text-white tracking-wide drop-shadow-2xl">TL SISTEMAS</h1>
                    <p className="text-blue-100 text-2xl font-light tracking-widest">DE AUTOMAÇÃO</p>
                  </div>
                </div>
              </div>
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-500/30 to-cyan-400/30 rounded-3xl blur-2xl -z-10 animate-pulse"></div>
            </div>
          </div>
          
          <div className="space-y-6">
            <h2 className="text-8xl font-bold bg-gradient-to-r from-blue-300 via-indigo-400 to-cyan-300 bg-clip-text text-transparent drop-shadow-2xl tracking-wide animate-pulse">
              {language === 'pt' ? 'CONTROLE COLABORADORES' : '员工控制系统'}
            </h2>
          </div>
          
          <div className="pt-12">
            <button
              onClick={() => setShowSystem(true)}
              className="group relative px-12 py-5 bg-gradient-to-r from-blue-500 via-indigo-600 to-cyan-500 text-white font-bold text-xl rounded-2xl shadow-2xl hover:shadow-blue-500/50 transform hover:scale-105 transition-all duration-500 border-2 border-blue-300/50 overflow-hidden"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-blue-400/30 via-indigo-500/30 to-cyan-400/30 blur-xl group-hover:blur-2xl transition-all duration-500"></div>
              <span className="relative z-10 flex items-center space-x-3">
                <span>🚀</span>
                <span>ACESSAR SISTEMA</span>
                <span>🚀</span>
              </span>
            </button>
          </div>
        </div>
      </main>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-400 via-blue-500 to-purple-600 p-4">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8 p-6 bg-white/10 backdrop-blur rounded-xl shadow-lg">
          <TLLogo size="small" position="top-left" />
          <div className="flex items-center space-x-4">
            <button
              onClick={toggleLanguage}
              className="px-4 py-2 bg-gradient-to-r from-cyan-500 to-blue-500 text-white font-medium rounded-lg shadow-md hover:from-cyan-600 hover:to-blue-600 transition-all duration-300 transform hover:scale-105"
            >
              {language === 'pt' ? '中文' : 'PT'}
            </button>
            <button
              onClick={() => setShowSystem(false)}
              className="px-6 py-3 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
            >
              ← {t.backToHome}
            </button>
          </div>
        </div>

        <div className="bg-white/10 backdrop-blur rounded-xl p-8 shadow-xl">
          <div className="flex flex-wrap justify-center space-x-2 mb-8 border-b border-white/20 pb-4">
            {[
              { key: 'colaboradores', label: t.tabs.employees, icon: '👥' },
              { key: 'itens', label: t.tabs.items, icon: '📦' },
              { key: 'vales', label: t.tabs.advances, icon: '💰' },
              { key: 'relatorios', label: t.tabs.reports, icon: '📊' },
              { key: 'configuracoes', label: t.tabs.settings, icon: '⚙️' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-5 py-3 font-medium rounded-lg transition-all duration-300 transform hover:scale-105 ${
                  activeTab === tab.key
                    ? 'bg-gradient-to-r from-blue-500 to-blue-600 text-white shadow-lg border-2 border-blue-400'
                    : 'bg-white/10 text-white/80 hover:text-white hover:bg-white/20 border-2 border-transparent'
                }`}
              >
                <span className="mr-2">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {activeTab === 'colaboradores' && (
            <ColaboradoresTab employees={employees} setEmployees={setEmployees} texts={t} />
          )}
          {activeTab === 'itens' && (
            <ItensTab 
              employees={employees} 
              selectedEmployee={selectedEmployee} 
              setSelectedEmployee={setSelectedEmployee}
              items={items} 
              setItems={setItems}
              texts={t}
            />
          )}
          {activeTab === 'vales' && (
            <ValesTab 
              employees={employees} 
              selectedEmployee={selectedEmployee} 
              setSelectedEmployee={setSelectedEmployee}
              advances={advances}
              setAdvances={setAdvances}
              texts={t}
            />
          )}
          {activeTab === 'relatorios' && (
            <RelatoriosTab employees={employees} items={items} advances={advances} texts={t} />
          )}
          {activeTab === 'configuracoes' && (
            <ConfiguracoesTab 
              companyName={companyName} 
              setCompanyName={setCompanyName} 
              texts={t}
              employees={employees}
              items={items}
              advances={advances}
            />
          )}
        </div>
      </div>
    </div>
  );
}