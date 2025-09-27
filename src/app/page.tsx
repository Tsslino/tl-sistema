"use client";

import React, { useState, useEffect } from "react";

// Interfaces para tipos seguros (evita 'any' e melhora autocomplete)
interface Employee {
  name: string;
  role: string;
}

interface Item {
  employee: string;
  itemName: string;
  quantity: number;
  value: number;
  date: string;
}

interface Advance {
  employee: string;
  amount: number;
  reason: string;
  date: string;
}

interface SummaryEmployee extends Employee {
  totalItems: number;
  totalAdvances: number;
  grandTotal: number;
  itemCount: number;
  advanceCount: number;
}

type Texts = Record<string, string | { tabs: Record<string, string> }>;

// Logo TL SISTEMAS (Componente Reutilizável)
function TLLogo({ size = 'normal', position = 'center' }: { 
  size?: 'small' | 'normal' | 'large'; 
  position?: 'center' | 'top-left' 
}) {
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
function ColaboradoresTab({ 
  employees, 
  setEmployees, 
  texts 
}: { 
  employees: Employee[]; 
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>; 
  texts: Texts 
}) {
  const [newEmployee, setNewEmployee] = useState('');
  const [newRole, setNewRole] = useState('');

  const addEmployee = () => {
    if (newEmployee.trim() && newRole.trim()) {
      setEmployees(prev => [...prev, { name: newEmployee.trim(), role: newRole.trim() }]);
      setNewEmployee('');
      setNewRole('');
    }
  };

  const removeEmployee = (index: number) => {
    setEmployees(prev => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">{texts.addEmployees as string}</h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6 space-y-4">
          <div>
            <label className="block text-white/80 mb-2 font-medium">{texts.employeeName as string}</label>
            <input
              type="text"
              value={newEmployee}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewEmployee(e.target.value)}
              placeholder={texts.employeeNamePlaceholder as string}
              className="w-full p-4 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <div>
            <label className="block text-white/80 mb-2 font-medium">{texts.companyRole as string}</label>
            <input
              type="text"
              value={newRole}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNewRole(e.target.value)}
              placeholder={texts.companyRolePlaceholder as string}
              className="w-full p-4 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
            />
          </div>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => addEmployee()}
            className="w-full px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>+</span>
            <span>{texts.addEmployee as string}</span>
          </button>
        </div>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold text-white mb-6">{texts.employeeList as string}</h2>
        <div className="bg-white/10 backdrop-blur rounded-lg p-6">
          <h3 className="text-lg font-semibold text-white mb-4">{texts.total as string}: {employees.length} {texts.employees as string}</h3>
          {employees.length === 0 ? (
            <p className="text-white/70 text-center py-8">{texts.noEmployees as string}</p>
          ) : (
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {employees.map((emp, index) => (
                <div key={`${emp.name}-${index}`} className="flex justify-between items-center p-4 bg-white/10 rounded-lg hover:bg-white/20 transition-colors">
                  <div>
                    <span className="text-white font-medium text-lg">{emp.name}</span>
                    <p className="text-blue-300 text-sm">{emp.role}</p>
                  </div>
                  <button
                    onClick={(e: React.MouseEvent<HTMLButtonElement>) => removeEmployee(index)}
                    className="px-4 py-2 bg-gradient-to-r from-red-500 to-red-600 text-white rounded-lg hover:from-red-600 hover:to-red-700 hover:shadow-lg transform hover:scale-105 transition-all duration-300 flex items-center space-x-1"
                  >
                    <span>🗑️</span>
                    <span>{texts.remove as string}</span>
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}// Tab Itens
function ItensTab({ 
  employees, 
  selectedEmployee, 
  setSelectedEmployee, 
  items, 
  setItems, 
  texts 
}: { 
  employees: Employee[];
  selectedEmployee: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  texts: Texts;
}) {
  const [itemName, setItemName] = useState('');
  const [quantity, setQuantity] = useState('');
  const [value, setValue] = useState('');

  const addItem = () => {
    const q = parseInt(quantity);
    const v = parseFloat(value);
    if (selectedEmployee && itemName.trim() && !isNaN(q) && !isNaN(v) && q > 0 && v > 0) {
      setItems(prev => [...prev, { 
        employee: selectedEmployee, 
        itemName: itemName.trim(), 
        quantity: q, 
        value: v,
        date: new Date().toLocaleString('pt-BR')
      }]);
      setItemName('');
      setQuantity('');
      setValue('');
    }
  };

  const removeItem = (itemIndex: number) => {
    setItems(prev => prev.filter((_, i) => i !== itemIndex));
  };

  const employeeItems = items.filter(item => item.employee === selectedEmployee);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">{texts.selectForItems as string}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {employees.map((emp, index) => (
            <button
              key={`${emp.name}-${index}`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => setSelectedEmployee(emp.name)}
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
            {texts.selectedEmployee as string}: {selectedEmployee}
          </p>
        )}
      </div>

      {selectedEmployee && (
        <>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">{texts.addStoreItems as string}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 font-medium">{texts.itemName as string}</label>
                <input
                  type="text"
                  value={itemName}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setItemName(e.target.value)}
                  placeholder={texts.itemPlaceholder as string}
                  className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-white/80 mb-2 font-medium">{texts.quantity as string}</label>
                  <input
                    type="number"
                    min="1"
                    value={quantity}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setQuantity(e.target.value)}
                    placeholder="1"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>
                <div>
                  <label className="block text-white/80 mb-2 font-medium">{texts.value as string}</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0.01"
                    value={value}
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) => setValue(e.target.value)}
                    placeholder="0.00"
                    className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                  />
                </div>
              </div>
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => addItem()}
                className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                📦 {texts.addItem as string}
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{selectedEmployee} {texts.itemsOf as string}</h3>
            {employeeItems.length === 0 ? (
              <p className="text-white/70 text-center py-4">{texts.noItems as string}</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeItems.map((item, index) => (
                  <div key={`${item.itemName}-${item.date}-${index}`} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-white font-medium">{item.itemName}</p>
                        <p className="text-green-300 text-sm">
                          Qtd: {item.quantity} | Valor: R$ {item.value.toFixed(2)} | Total: R$ {(item.quantity * item.value).toFixed(2)}
                        </p>
                        <p className="text-white/60 text-xs">{item.date}</p>
                      </div>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => removeItem(items.findIndex(i => 
                          i.employee === item.employee && i.itemName === item.itemName && i.quantity === item.quantity && i.value === item.value
                        ))}
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
        </>
      )}

      {!selectedEmployee && employees.length > 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">{texts.selectEmployeeItems as string}</p>
        </div>
      )}
    </div>
  );
}

// Tab Vales
function ValesTab({ 
  employees, 
  selectedEmployee, 
  setSelectedEmployee, 
  advances, 
  setAdvances, 
  texts 
}: { 
  employees: Employee[];
  selectedEmployee: string;
  setSelectedEmployee: React.Dispatch<React.SetStateAction<string>>;
  advances: Advance[];
  setAdvances: React.Dispatch<React.SetStateAction<Advance[]>>;
  texts: Texts;
}) {
  const [advanceAmount, setAdvanceAmount] = useState('');
  const [advanceReason, setAdvanceReason] = useState('');

  const addAdvance = () => {
    const amt = parseFloat(advanceAmount);
    if (selectedEmployee && !isNaN(amt) && advanceReason.trim() && amt > 0) {
      setAdvances(prev => [...prev, { 
        employee: selectedEmployee, 
        amount: amt, 
        reason: advanceReason.trim(),
        date: new Date().toLocaleString('pt-BR')
      }]);
      setAdvanceAmount('');
      setAdvanceReason('');
    }
  };

  const removeAdvance = (advanceIndex: number) => {
    setAdvances(prev => prev.filter((_, i) => i !== advanceIndex));
  };

  const employeeAdvances = advances.filter(adv => adv.employee === selectedEmployee);

  return (
    <div className="space-y-6">
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h2 className="text-2xl font-bold text-white mb-4">{texts.selectForAdvance as string}</h2>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
          {employees.map((emp, index) => (
            <button
              key={`${emp.name}-${index}`}
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => setSelectedEmployee(emp.name)}
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
            {texts.selectedEmployee as string}: {selectedEmployee}
          </p>
        )}
      </div>

      {selectedEmployee && (
        <>
          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-xl font-bold text-white mb-4">{texts.registerAdvance as string}</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-white/80 mb-2 font-medium">{texts.advanceValue as string}</label>
                <input
                  type="number"
                  step="0.01"
                  min="0.01"
                  value={advanceAmount}
                  onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAdvanceAmount(e.target.value)}
                  placeholder="100.00"
                  className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 transition-all"
                />
              </div>
              <div>
                <label className="block text-white/80 mb-2 font-medium">{texts.reason as string}</label>
                <textarea
                  value={advanceReason}
                  onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setAdvanceReason(e.target.value)}
                  placeholder={texts.reasonPlaceholder as string}
                  className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-400 resize-none transition-all"
                  rows={3}
                />
              </div>
              <button
                onClick={(e: React.MouseEvent<HTMLButtonElement>) => addAdvance()}
                className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
              >
                💰 {texts.registerAdvanceBtn as string}
              </button>
            </div>
          </div>

          <div className="bg-white/10 backdrop-blur rounded-lg p-6">
            <h3 className="text-lg font-semibold text-white mb-4">{selectedEmployee} {texts.advancesOf as string}</h3>
            {employeeAdvances.length === 0 ? (
              <p className="text-white/70 text-center py-4">{texts.noAdvances as string}</p>
            ) : (
              <div className="space-y-3 max-h-64 overflow-y-auto">
                {employeeAdvances.map((adv, index) => (
                  <div key={`${adv.reason}-${adv.date}-${index}`} className="p-3 bg-white/10 rounded-lg">
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-purple-300 font-medium">R$ {adv.amount.toFixed(2)}</p>
                        <p className="text-white/70 text-sm">{adv.reason}</p>
                        <p className="text-white/60 text-xs">{adv.date}</p>
                      </div>
                      <button
                        onClick={(e: React.MouseEvent<HTMLButtonElement>) => removeAdvance(advances.findIndex(a => 
                          a.employee === adv.employee && a.amount === adv.amount && a.reason === adv.reason
                        ))}
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
        </>
      )}

      {!selectedEmployee && employees.length > 0 && (
        <div className="text-center py-12">
          <p className="text-white/70 text-lg">{texts.selectEmployeeAdvance as string}</p>
        </div>
      )}
    </div>
  );
}// Tab Relatórios
function RelatoriosTab({ 
  employees, 
  items, 
  advances, 
  texts 
}: { 
  employees: Employee[]; 
  items: Item[];
  advances: Advance[];
  texts: Texts;
}) {
  const [filterEmployee, setFilterEmployee] = useState('all');

  const getEmployeeSummary = (): SummaryEmployee[] => {
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

  const getFilteredItems = (): Item[] => filterEmployee === 'all' ? items : items.filter(item => item.employee === filterEmployee);
  const getFilteredAdvances = (): Advance[] => filterEmployee === 'all' ? advances : advances.filter(adv => adv.employee === filterEmployee);

  const filteredItemCount = getFilteredItems().length;
  const filteredAdvanceCount = getFilteredAdvances().length;
  const grandTotalValue = getFilteredItems().reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                          getFilteredAdvances().reduce((sum, adv) => sum + adv.amount, 0);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{texts.finalReports as string}</h2>
      
      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <div className="flex items-center space-x-4">
          <label className="text-white font-medium">{texts.filterEmployee as string}</label>
          <select
            value={filterEmployee}
            onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setFilterEmployee(e.target.value)}
            className="p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
          >
            <option value="all">{texts.allEmployees as string}</option>
            {employees.map((emp, index) => (
              <option key={`${emp.name}-${index}`} value={emp.name}>{emp.name}</option>
            ))}
          </select>
        </div>
      </div>
      
      <div className="grid md:grid-cols-4 gap-4">
        <div className="bg-gradient-to-r from-blue-500 to-blue-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.employeesCard as string}</h3>
          <p className="text-4xl font-bold text-white">{filterEmployee === 'all' ? employees.length : 1}</p>
          <p className="text-blue-100">{filterEmployee === 'all' ? texts.totalRegistered as string : texts.selected as string}</p>
        </div>
        <div className="bg-gradient-to-r from-green-500 to-green-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.itemsCard as string}</h3>
          <p className="text-4xl font-bold text-white">{filteredItemCount}</p>
          <p className="text-green-100">
            {filterEmployee === 'all' ? texts.totalItems as string : `${texts.from as string} ${filterEmployee}`}
          </p>
        </div>
        <div className="bg-gradient-to-r from-purple-500 to-purple-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.advancesCard as string}</h3>
          <p className="text-4xl font-bold text-white">{filteredAdvanceCount}</p>
          <p className="text-purple-100">
            {filterEmployee === 'all' ? texts.totalAdvances as string : `${texts.from as string} ${filterEmployee}`}
          </p>
        </div>
        <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 p-6 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold text-white mb-2">{texts.grandTotal as string}</h3>
          <p className="text-4xl font-bold text-white">R$ {grandTotalValue.toFixed(2)}</p>
          <p className="text-yellow-100">{texts.sumItemsAdvances as string}</p>
        </div>
      </div>

      <div className="bg-white/10 backdrop-blur rounded-lg p-6">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.summaryByEmployee as string}</h3>
        {getEmployeeSummary().length === 0 ? (
          <p className="text-white/70 text-center py-4">{texts.noEmployeesRegistered as string}</p>
        ) : (
          <div className="space-y-4">
            {getEmployeeSummary().map((emp, index) => (
              <div key={`${emp.name}-${index}`} className="bg-white/10 p-4 rounded-lg">
                <div className="flex justify-between items-start mb-3">
                  <div>
                    <h4 className="text-lg font-medium text-white">{emp.name}</h4>
                    <p className="text-blue-300 text-sm">{emp.role}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-2xl font-bold text-yellow-300">R$ {emp.grandTotal.toFixed(2)}</p>
                    <p className="text-white/60 text-sm">{texts.totalToDeduct as string}</p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-green-300">{texts.itemsCard as string}: R$ {emp.totalItems.toFixed(2)}</p>
                    <p className="text-white/60">{emp.itemCount} {(texts.itemsCard as string).toLowerCase()}</p>
                  </div>
                  <div>
                    <p className="text-purple-300">{texts.advancesCard as string}: R$ {emp.totalAdvances.toFixed(2)}</p>
                    <p className="text-white/60">{emp.advanceCount} {(texts.advancesCard as string).toLowerCase()}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}// Tab Configurações (Início: Estados, useEffects, Funções de Backup/Import/Relatório)
function ConfiguracoesTab({ 
  companyName, 
  setCompanyName, 
  texts, 
  employees, 
  setEmployees,
  items, 
  setItems,
  advances, 
  setAdvances
}: { 
  companyName: string; 
  setCompanyName: React.Dispatch<React.SetStateAction<string>>; 
  texts: Texts; 
  employees: Employee[];
  setEmployees: React.Dispatch<React.SetStateAction<Employee[]>>;
  items: Item[];
  setItems: React.Dispatch<React.SetStateAction<Item[]>>;
  advances: Advance[];
  setAdvances: React.Dispatch<React.SetStateAction<Advance[]>>;
}) {
  const [theme, setTheme] = useState<'dark' | 'light' | 'auto'>('dark');
  const [autoSave, setAutoSave] = useState(true);
  const [notifications, setNotifications] = useState(true);
  const [currency, setCurrency] = useState<'BRL' | 'USD' | 'EUR' | 'CNY'>('BRL');
  const [companyAddress, setCompanyAddress] = useState('');
  const [companyPhone, setCompanyPhone] = useState('');

  // Persistência para configurações do sistema
  useEffect(() => {
    const savedTheme = localStorage.getItem('tl-theme') as 'dark' | 'light' | 'auto' | null;
    const savedCurrency = localStorage.getItem('tl-currency') as 'BRL' | 'USD' | 'EUR' | 'CNY' | null;
    const savedAddress = localStorage.getItem('tl-address');
    const savedPhone = localStorage.getItem('tl-phone');
    if (savedTheme) setTheme(savedTheme);
    if (savedCurrency) setCurrency(savedCurrency);
    if (savedAddress) setCompanyAddress(savedAddress);
    if (savedPhone) setCompanyPhone(savedPhone);
  }, []);

  useEffect(() => {
    localStorage.setItem('tl-theme', theme);
  }, [theme]);

  useEffect(() => {
    localStorage.setItem('tl-currency', currency);
  }, [currency]);

  useEffect(() => {
    localStorage.setItem('tl-address', companyAddress);
  }, [companyAddress]);

  useEffect(() => {
    localStorage.setItem('tl-phone', companyPhone);
  }, [companyPhone]);

  // Função de Export (JSON completo)
  const exportData = () => {
    const exportDataObj = { 
      company: { name: companyName, address: companyAddress, phone: companyPhone },
      employees, 
      items, 
      advances,
      settings: { theme, currency, autoSave, notifications },
      exportDate: new Date().toISOString(),
      version: '1.0'
    };
    const data = JSON.stringify(exportDataObj, null, 2);
    const blob = new Blob([data], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `tl-sistema-backup-${new Date().toISOString().split('T')[0]}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Backup exportado com sucesso!');
  };

  // Função de Import (Aplica dados de verdade, com validação e error handling)
  const importData = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e: ProgressEvent<FileReader>) => {
      try {
        const result = e.target?.result;
        if (typeof result === 'string') {
          const importedData = JSON.parse(result) as {
            company: { name: string; address?: string; phone?: string };
            employees: Employee[];
            items: Item[];
            advances: Advance[];
            settings?: { theme?: 'dark' | 'light' | 'auto'; currency?: 'BRL' | 'USD' | 'EUR' | 'CNY'; autoSave?: boolean; notifications?: boolean };
          };

          if (confirm('Deseja importar os dados? Isso substituirá todos os dados atuais.')) {
            // Aplicar company
            setCompanyName(importedData.company?.name || 'TL Empresa');
            setCompanyAddress(importedData.company?.address || '');
            setCompanyPhone(importedData.company?.phone || '');

            // Aplicar dados principais
            setEmployees(importedData.employees || []);
            setItems(importedData.items || []);
            setAdvances(importedData.advances || []);

            // Aplicar settings se existirem
            if (importedData.settings) {
              if (importedData.settings.theme) setTheme(importedData.settings.theme);
              if (importedData.settings.currency) setCurrency(importedData.settings.currency);
              if (importedData.settings.autoSave !== undefined) setAutoSave(importedData.settings.autoSave);
              if (importedData.settings.notifications !== undefined) setNotifications(importedData.settings.notifications);
            }

            // Persistir no localStorage
            localStorage.setItem('tl-employees', JSON.stringify(importedData.employees || []));
            localStorage.setItem('tl-items', JSON.stringify(importedData.items || []));
            localStorage.setItem('tl-advances', JSON.stringify(importedData.advances || []));
            localStorage.setItem('tl-company', importedData.company?.name || 'TL Empresa');
            localStorage.setItem('tl-address', importedData.company?.address || '');
            localStorage.setItem('tl-phone', importedData.company?.phone || '');

            alert('Importação concluída com sucesso! Dados aplicados e salvos.');
            event.target.value = '';  // Reset input
          }
        }
      } catch (error: unknown) {
        console.error('Erro no parsing do arquivo:', error);
        let errorMessage = 'Erro desconhecido ao importar arquivo.';
        if (error instanceof Error) {
          errorMessage = `Erro ao importar: ${error.message}. Verifique se é um backup válido do TL Sistema.`;
        } else if (typeof error === 'string') {
          errorMessage = `Erro: ${error}`;
        }
        alert(errorMessage);
      }
    };
    reader.onerror = () => {
      alert('Erro ao ler o arquivo. Tente novamente.');
    };
    reader.readAsText(file);
  };

  // Função de Geração de Relatório (TXT simples)
  const generateReport = () => {
    const totalValue = items.reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                       advances.reduce((sum, adv) => sum + adv.amount, 0);
    const reportContent = `
RELATÓRIO TL SISTEMAS - ${new Date().toLocaleString('pt-BR')}
==================================================
Empresa: ${companyName}
Endereço: ${companyAddress || 'Não informado'}
Telefone: ${companyPhone || 'Não informado'}

RESUMO GERAL:
- Total de Colaboradores: ${employees.length}
- Total de Itens Registrados: ${items.length}
- Total de Vale-Adiantamentos: ${advances.length}
- Valor Total de Itens: R$ ${items.reduce((sum, item) => sum + (item.quantity * item.value), 0).toFixed(2)}
- Valor Total de Vales: R$ ${advances.reduce((sum, adv) => sum + adv.amount, 0).toFixed(2)}
- GRANDE TOTAL (a descontar): R$ ${totalValue.toFixed(2)}

DETALHES POR COLABORADOR:
${employees.map(emp => {
  const empItems = items.filter(item => item.employee === emp.name);
  const empAdvances = advances.filter(adv => adv.employee === emp.name);
  const empTotalItems = empItems.reduce((sum, item) => sum + (item.quantity * item.value), 0);
  const empTotalAdvances = empAdvances.reduce((sum, adv) => sum + adv.amount, 0);
  const empGrandTotal = empTotalItems + empTotalAdvances;
  return `  - ${emp.name} (${emp.role}):
      Itens: R$ ${empTotalItems.toFixed(2)} (${empItems.length} itens)
      Vales: R$ ${empTotalAdvances.toFixed(2)} (${empAdvances.length} vales)
      Total: R$ ${empGrandTotal.toFixed(2)}
`;
}).join('\n')}

==================================================
Gerado em: ${new Date().toLocaleString('pt-BR')}
Versão do Sistema: 1.0 | TL Team
    `;

    const blob = new Blob([reportContent], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `relatorio-tl-sistema-${new Date().toISOString().split('T')[0]}.txt`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    alert('Relatório TXT gerado e baixado com sucesso!');
  };

  // Função de Limpeza de Dados (com confirmação e reset)
  const clearAllData = () => {
    if (confirm('Tem certeza que deseja limpar TODOS os dados? Esta ação não pode ser desfeita e removerá colaboradores, itens, vales e configurações!')) {
      // Reset estados
      setEmployees([]);
      setItems([]);
      setAdvances([]);
      setCompanyName('TL Empresa');
      setCompanyAddress('');
      setCompanyPhone('');
      setTheme('dark');
      setCurrency('BRL');
      setAutoSave(true);
      setNotifications(true);

      // Limpar localStorage
      localStorage.clear();

      alert('Todos os dados foram removidos com sucesso. O sistema foi resetado.');
    }
  };

  // (JSX da ConfiguracoesTab continua na Parte 4)
    // JSX da ConfiguracoesTab (continuação)
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-white">{texts.systemSettings as string}</h2>
      
      {/* Configurações da Empresa */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.companyInfo as string}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.companyName as string}</label>
              <input
                type="text"
                value={companyName}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyName(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder={texts.companyPlaceholder as string}
              />
            </div>
            <div>
              <label className="block text-white/80 mb-2 font-medium">Telefone da Empresa</label>
              <input
                type="tel"
                value={companyPhone}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyPhone(e.target.value)}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
                placeholder="(11) 99999-9999"
              />
            </div>
          </div>
          <div>
            <label className="block text-white/80 mb-2 font-medium">Endereço da Empresa</label>
            <input
              type="text"
              value={companyAddress}
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => setCompanyAddress(e.target.value)}
              className="w-full p-3 rounded-lg border border-white/30 bg-white text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-400 transition-all"
              placeholder="Digite o endereço completo da empresa..."
            />
          </div>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => {
              localStorage.setItem('tl-company', companyName);
              localStorage.setItem('tl-address', companyAddress);
              localStorage.setItem('tl-phone', companyPhone);
              alert(`Configurações da empresa salvas com sucesso para: ${companyName}`);
            }}
            className="w-full px-6 py-4 bg-gradient-to-r from-green-500 to-green-600 text-white font-bold rounded-lg shadow-lg hover:from-green-600 hover:to-green-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300"
          >
            💾 {texts.saveSettings as string}
          </button>
        </div>
      </div>

      {/* Backup e Restauração de Dados */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.backupData as string}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={(e: React.MouseEvent<HTMLButtonElement>) => exportData()}
              className="px-6 py-4 bg-gradient-to-r from-blue-500 to-blue-600 text-white font-bold rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
            >
              <span>📥</span>
              <span>{texts.exportData as string}</span>
            </button>
            <label className="px-6 py-4 bg-gradient-to-r from-cyan-500 to-cyan-600 text-white font-bold rounded-lg shadow-lg hover:from-cyan-600 hover:to-cyan-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 cursor-pointer flex items-center justify-center space-x-2">
              <span>📤</span>
              <span>Importar Dados</span>
              <input
                type="file"
                accept=".json"
                onChange={importData}
                className="hidden"
              />
            </label>
          </div>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => generateReport()}
            className="w-full px-6 py-4 bg-gradient-to-r from-purple-500 to-purple-600 text-white font-bold rounded-lg shadow-lg hover:from-purple-600 hover:to-purple-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>📊</span>
            <span>Gerar Relatório Detalhado (TXT)</span>
          </button>
          <button
            onClick={(e: React.MouseEvent<HTMLButtonElement>) => clearAllData()}
            className="w-full px-6 py-4 bg-gradient-to-r from-red-500 to-red-600 text-white font-bold rounded-lg shadow-lg hover:from-red-600 hover:to-red-700 hover:shadow-xl transform hover:scale-105 transition-all duration-300 flex items-center justify-center space-x-2"
          >
            <span>🗑️</span>
            <span>{texts.clearData as string}</span>
          </button>
        </div>
      </div>

      {/* Configurações Avançadas do Sistema */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">{texts.systemTheme as string}</h3>
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-white/80 mb-2 font-medium">{texts.systemTheme as string}</label>
              <select
                value={theme}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setTheme(e.target.value as 'dark' | 'light' | 'auto')}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                <option value="dark">{texts.darkTheme as string}</option>
                <option value="light">{texts.lightTheme as string}</option>
                <option value="auto">{texts.autoTheme as string}</option>
              </select>
            </div>
            <div>
              <label className="block text-white/80 mb-2 font-medium">Moeda Padrão</label>
              <select
                value={currency}
                onChange={(e: React.ChangeEvent<HTMLSelectElement>) => setCurrency(e.target.value as 'BRL' | 'USD' | 'EUR' | 'CNY')}
                className="w-full p-3 rounded-lg border border-white/30 bg-white text-black focus:outline-none focus:ring-2 focus:ring-blue-400 transition-all"
              >
                <option value="BRL">Real Brasileiro (R$)</option>
                <option value="USD">Dólar Americano (US$)</option>
                <option value="EUR">Euro (€)</option>
                <option value="CNY">Yuan Chinês (¥)</option>
              </select>
            </div>
          </div>
          <div className="flex flex-wrap items-center gap-8">
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={autoSave}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setAutoSave(e.target.checked)}
                className="rounded border-white/30"
              />
              <span className="text-sm">{texts.autoSave ? 'Auto-salvar ativado' : 'Ativar auto-save'}</span>
            </label>
            <label className="flex items-center space-x-2 text-white">
              <input
                type="checkbox"
                checked={notifications}
                onChange={(e: React.ChangeEvent<HTMLInputElement>) => setNotifications(e.target.checked)}
                className="rounded border-white/30"
              />
              <span className="text-sm">Notificações do sistema</span>
            </label>
          </div>
        </div>
      </div>

      {/* Painel de Estatísticas */}
      <div className="bg-white/10 backdrop-blur p-6 rounded-lg">
        <h3 className="text-xl font-semibold text-white mb-4">Estatísticas Atuais do Sistema</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="bg-blue-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-blue-300">{employees.length}</p>
            <p className="text-white/70 text-sm">Colaboradores Cadastrados</p>
          </div>
          <div className="bg-green-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-green-300">{items.length}</p>
            <p className="text-white/70 text-sm">Itens Registrados</p>
          </div>
          <div className="bg-purple-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-purple-300">{advances.length}</p>
            <p className="text-white/70 text-sm">Vales Emitidos</p>
          </div>
          <div className="bg-yellow-500/20 p-4 rounded-lg text-center">
            <p className="text-2xl font-bold text-yellow-300">
              R$ {(
                items.reduce((sum, item) => sum + (item.quantity * item.value), 0) + 
                advances.reduce((sum, adv) => sum + adv.amount, 0)
              ).toFixed(2)}
            </p>
            <p className="text-white/70 text-sm">Total a Descontar</p>
          </div>
        </div>
      </div>

      {/* Informações Gerais do Sistema */}
      <div className="bg-white/5 p-4 rounded-lg border border-white/10">
        <h4 className="text-lg font-semibold text-white mb-3">{texts.systemInfo as string}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 text-sm text-white/70">
          <p>• {texts.version as string}: TL Sistemas v1.0 (Production Ready)</p>
          <p>• {texts.type as string}: {texts.systemType as string}</p>
          <p>• {texts.developers as string}: TL Team (Bilingual PT/ZH)</p>
          <p>• {texts.creationDate as string}: {new Date('2024-01-01').toLocaleDateString('pt-BR')}</p>
          <p>• Tema Atual: {theme}</p>
          <p>• Moeda: {currency === 'BRL' ? 'R$' : currency === 'USD' ? 'US$' : currency === 'EUR' ? '€' : '¥'}</p>
          <p>• Auto-save: {autoSave ? 'Ativo' : 'Desativado'}</p>
          <p>• Notificações: {notifications ? 'Ativas' : 'Desativadas'}</p>
        </div>
      </div>
    </div>
  );
}

// Componente Principal Home (Estados, useEffects, Toggle Language)
// Componente Principal Home (Estados, useEffects, Toggle Language)
export default function Home() {
  const [showSystem, setShowSystem] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<'colaboradores' | 'itens' | 'vales' | 'relatorios' | 'configuracoes'>('colaboradores');
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [selectedEmployee, setSelectedEmployee] = useState<string>('');
  const [items, setItems] = useState<Item[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  const [companyName, setCompanyName] = useState<string>('TL Empresa');
  const [language, setLanguage] = useState<'pt' | 'zh'>('pt');

  // Carregamento inicial do localStorage
  useEffect(() => {
    try {
      const savedEmployees = localStorage.getItem('tl-employees');
      const savedItems = localStorage.getItem('tl-items');
      const savedAdvances = localStorage.getItem('tl-advances');
      const savedCompany = localStorage.getItem('tl-company');
      const savedLang = localStorage.getItem('tl-language') as 'pt' | 'zh' | null;
      
      if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
      if (savedItems) setItems(JSON.parse(savedItems));
      if (savedAdvances) setAdvances(JSON.parse(savedAdvances));
      if (savedCompany) setCompanyName(savedCompany);
      if (savedLang) setLanguage(savedLang);
    } catch (error: unknown) {
      console.error('Erro ao carregar dados do localStorage:', error);
      if (error instanceof Error) {
        alert(`Erro de carregamento: ${error.message}. Reiniciando dados.`);
      }
    }
  }, []);

  // Salvamentos automáticos no localStorage
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
    localStorage.setItem('tl-language', language);
  }, [companyName, language]);

  // Objeto texts COMPLETO (com todas as chaves usadas nas tabs para PT e ZH placeholders)
  const getTexts = (lang: 'pt' | 'zh'): Texts => {
    if (lang === 'pt') {
      return {
        addEmployees: 'Adicionar Colaboradores',
        employeeName: 'Nome do Colaborador',
        employeeNamePlaceholder: 'Digite o nome do colaborador...',
        companyRole: 'Cargo na Empresa',
        companyRolePlaceholder: 'Ex: Desenvolvedor, Gerente...',
        addEmployee: 'Adicionar Colaborador',
        employeeList: 'Lista de Colaboradores',
        total: 'Total',
        employees: 'colaboradores',
        noEmployees: 'Nenhum colaborador cadastrado ainda.',
        remove: 'Remover',
        selectForItems: 'Selecione um Colaborador para Itens',
        selectedEmployee: 'Colaborador Selecionado',
        addStoreItems: 'Adicionar Itens da Loja',
        itemName: 'Nome do Item',
        itemPlaceholder: 'Ex: Caneta, Notebook...',
        quantity: 'Quantidade',
        value: 'Valor Unitário',
        addItem: 'Adicionar Item',
        itemsOf: ' - Itens Registrados',
        noItems: 'Nenhum item registrado para este colaborador.',
        selectEmployeeItems: 'Selecione um colaborador para gerenciar itens.',
        selectForAdvance: 'Selecione um Colaborador para Vale',
        registerAdvance: 'Registrar Adiantamento (Vale)',
        advanceValue: 'Valor do Adiantamento',
        reason: 'Motivo do Adiantamento',
        reasonPlaceholder: 'Ex: Despesas de viagem, Emergência...',
        registerAdvanceBtn: 'Registrar Vale',
        advancesOf: ' - Adiantamentos Registrados',
        noAdvances: 'Nenhum adiantamento registrado para este colaborador.',
        selectEmployeeAdvance: 'Selecione um colaborador para gerenciar vales.',
        finalReports: 'Relatórios Finais',
        filterEmployee: 'Filtrar por Colaborador',
        allEmployees: 'Todos os Colaboradores',
        employeesCard: 'Colaboradores',
        totalRegistered: 'Total Registrados',
        selected: 'Selecionado',
        itemsCard: 'Itens',
        totalItems: 'Total de Itens',
        from: 'De',
        advancesCard: 'Adiantamentos',
        totalAdvances: 'Total de Adiantamentos',
        grandTotal: 'Grande Total',
        sumItemsAdvances: 'Soma de Itens + Adiantamentos',
        summaryByEmployee: 'Resumo por Colaborador',
        noEmployeesRegistered: 'Nenhum colaborador registrado.',
        totalToDeduct: 'Total a Descontar',
        systemSettings: 'Configurações do Sistema',
        companyInfo: 'Informações da Empresa',
        companyName: 'Nome da Empresa',
        companyPlaceholder: 'Digite o nome da empresa...',
        saveSettings: 'Salvar Configurações',
        backupData: 'Backup e Restauração de Dados',
        exportData: 'Exportar Backup (JSON)',
        clearData: 'Limpar Todos os Dados',
        systemTheme: 'Configurações Avançadas',
        darkTheme: 'Tema Escuro',
        lightTheme: 'Tema Claro',
        autoTheme: 'Tema Automático',
        systemInfo: 'Informações do Sistema',
        version: 'Versão',
        type: 'Tipo',
        systemType: 'Sistema de Gerenciamento de RH e Estoque',
        developers: 'Desenvolvedores',
        creationDate: 'Data de Criação',
        colaboradores: 'Colaboradores',
        itens: 'Itens',
        vales: 'Vales',
        relatorios: 'Relatórios',
        configuracoes: 'Configurações',
        autoSaveLabel: 'Auto-salvar ativado'  // Corrigi o bug de texts.autoSave
      };
    } else {  // ZH (placeholders em chinês simplificado)
      return {
        addEmployees: '添加员工',
        employeeName: '员工姓名',
        employeeNamePlaceholder: '输入姓名...',
        companyRole: '公司职位',
        companyRolePlaceholder: '例如：开发者...',
        addEmployee: '添加员工',
        employeeList: '员工列表',
        total: '总数',
        employees: '员工',
        noEmployees: '尚未注册员工。',
        remove: '删除',
        selectForItems: '选择员工管理物品',
        selectedEmployee: '已选员工',
        addStoreItems: '添加商店物品',
        itemName: '物品名称',
        itemPlaceholder: '例如：笔，笔记本...',
        quantity: '数量',
        value: '单价',
        addItem: '添加物品',
        itemsOf: ' - 注册物品',
        noItems: '此员工无物品。',
        selectEmployeeItems: '选择员工管理物品。',
        selectForAdvance: '选择员工管理预付款',
        registerAdvance: '注册预付款',
        advanceValue: '预付款金额',
        reason: '预付款原因',
        reasonPlaceholder: '例如：旅行费用...',
        registerAdvanceBtn: '注册预付款',
        advancesOf: ' - 注册预付款',
        noAdvances: '此员工无预付款。',
        selectEmployeeAdvance: '选择员工管理预付款。',
        finalReports: '最终报告',
        filterEmployee: '按员工过滤',
        allEmployees: '所有员工',
        employeesCard: '员工',
        totalRegistered: '总注册数',
        selected: '已选',
        itemsCard: '物品',
        totalItems: '物品总数',
        from: '来自',
        advancesCard: '预付款',
        totalAdvances: '预付款总数',
        grandTotal: '总计',
        sumItemsAdvances: '物品 + 预付款总和',
        summaryByEmployee: '按员工摘要',
        noEmployeesRegistered: '无注册员工。',
        totalToDeduct: '总扣除额',
        systemSettings: '系统设置',
        companyInfo: '公司信息',
        companyName: '公司名称',
        companyPlaceholder: '输入公司名称...',
        saveSettings: '保存设置',
        backupData: '备份和恢复',
        exportData: '导出备份 (JSON)',
        clearData: '清除所有数据',
        systemTheme: '高级设置',
        darkTheme: '深色主题',
        lightTheme: '浅色主题',
        autoTheme: '自动主题',
        systemInfo: '系统信息',
        version: '版本',
        type: '类型',
        systemType: '人力资源和库存管理系统',
        developers: '开发者',
        creationDate: '创建日期',
        colaboradores: '员工',
        itens: '物品',
        vales: '预付款',
        relatorios: '报告',
        configuracoes: '设置',
        autoSaveLabel: '自动保存已启用'
      };
    }
  };

  const texts = getTexts(language);

  const toggleLanguage = () => {
    setLanguage(prevLang => (prevLang === 'pt' ? 'zh' : 'pt'));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-blue-900 to-purple-900 text-white p-6">
      {/* Header com Logo e Toggle Language */}
      <div className="flex justify-between items-center mb-8">
        <TLLogo size="normal" position="center" />
        <button 
          onClick={toggleLanguage} 
          className="px-4 py-2 bg-blue-500 rounded-lg hover:bg-blue-600 transition-all duration-300"
        >
          {language === 'pt' ? 'ZH' : 'PT'}
        </button>
      </div>

      {/* Toggle para mostrar o sistema */}
      {!showSystem ? (
        <div className="text-center py-12">
          <h1 className="text-4xl font-bold mb-4">{language === 'pt' ? 'Bem-vindo ao TL Sistemas' : '欢迎使用 TL 系统'}</h1>
          <button
            onClick={() => setShowSystem(true)}
            className="px-8 py-4 bg-green-500 rounded-lg text-xl font-bold hover:bg-green-600 transition-all duration-300"
          >
            {language === 'pt' ? 'Entrar no Sistema' : '进入系统'}
          </button>
        </div>
      ) : (
        <>
          {/* Navegação de Tabs (completa com todas as 5 tabs) */}
          <div className="flex space-x-4 mb-8 overflow-x-auto pb-2 border-b border-white/20">
            <button
              onClick={() => setActiveTab('colaboradores')}
              className={`px-6 py-3 rounded-t-lg whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'colaboradores'
                  ? 'bg-blue-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>👥</span>
              <span>{texts.colaboradores || 'Colaboradores'}</span>
            </button>
            <button
              onClick={() => setActiveTab('itens')}
              className={`px-6 py-3 rounded-t-lg whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'itens'
                  ? 'bg-green-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>📦</span>
              <span>{texts.itens || 'Itens'}</span>
            </button>
            <button
              onClick={() => setActiveTab('vales')}
              className={`px-6 py-3 rounded-t-lg whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'vales'
                  ? 'bg-purple-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>💰</span>
              <span>{texts.vales || 'Vales'}</span>
            </button>
            <button
              onClick={() => setActiveTab('relatorios')}
              className={`px-6 py-3 rounded-t-lg whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'relatorios'
                  ? 'bg-yellow-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>📊</span>
              <span>{texts.relatorios || 'Relatórios'}</span>
            </button>
            <button
              onClick={() => setActiveTab('configuracoes')}
              className={`px-6 py-3 rounded-t-lg whitespace-nowrap transition-all duration-300 flex items-center space-x-2 ${
                activeTab === 'configuracoes'
                  ? 'bg-gray-500 text-white shadow-lg'
                  : 'bg-white/10 hover:bg-white/20 text-white'
              }`}
            >
              <span>⚙️</span>
              <span>{texts.configuracoes || 'Configurações'}</span>
            </button>
          </div>

          {/* Conteúdo das Tabs (renders condicionais completos) */}
          <div className="max-w-7xl mx-auto">
            {activeTab === 'colaboradores' && (
              <ColaboradoresTab employees={employees} setEmployees={setEmployees} texts={texts} />
            )}
            {activeTab === 'itens' && (
              <ItensTab
                employees={employees}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                items={items}
                setItems={setItems}
                texts={texts}
              />
            )}
            {activeTab === 'vales' && (
              <ValesTab
                employees={employees}
                selectedEmployee={selectedEmployee}
                setSelectedEmployee={setSelectedEmployee}
                advances={advances}
                setAdvances={setAdvances}
                texts={texts}
              />
            )}
            {activeTab === 'relatorios' && (
              <RelatoriosTab employees={employees} items={items} advances={advances} texts={texts} />
            )}
            {activeTab === 'configuracoes' && (
              <ConfiguracoesTab
                companyName={companyName}
                setCompanyName={setCompanyName}
                texts={texts}
                employees={employees}
                setEmployees={setEmployees}
                items={items}
                setItems={setItems}
                advances={advances}
                setAdvances={setAdvances}
              />
            )}
          </div>
        </>
      )}
    </div>
  );
}