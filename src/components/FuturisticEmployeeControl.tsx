'use client';

import React, { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface StoreItem {
  id: string;
  employeeName: string;
  itemName: string;
  quantity: number;
  value: number;
  date: string;
  description?: string;
}

interface Advance {
  id: string;
  employeeName: string;
  amount: number;
  date: string;
  reason: string;
}

interface Employee {
  id: string;
  name: string;
  department?: string;
  dateAdded: string;
}
// FIX: Defina o tipo union para as tabs internas (adicione aqui, antes do componente ou dentro dele)
type InternalTabKey = 'employees' | 'items' | 'advances' | 'summary';
const FuturisticEmployeeControl: React.FC = () => {
const [activeTab, setActiveTab] = useState<InternalTabKey>('employees');  // FIX: Adicione <InternalTabKey>
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [storeItems, setStoreItems] = useState<StoreItem[]>([]);
  const [advances, setAdvances] = useState<Advance[]>([]);
  
  const [itemForm, setItemForm] = useState({
    employeeName: '',
    itemName: '',
    quantity: '',
    value: '',
    description: ''
  });
  
  const [advanceForm, setAdvanceForm] = useState({
    employeeName: '',
    amount: '',
    reason: ''
  });

  const [employeeForm, setEmployeeForm] = useState({
    name: '',
    department: ''
  });

  const [filterEmployee, setFilterEmployee] = useState('all');
  const [showInterface, setShowInterface] = useState(false);
  const summaryRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const savedEmployees = localStorage.getItem('employees');
    const savedItems = localStorage.getItem('storeItems');
    const savedAdvances = localStorage.getItem('advances');
    
    if (savedEmployees) setEmployees(JSON.parse(savedEmployees));
    if (savedItems) setStoreItems(JSON.parse(savedItems));
    if (savedAdvances) setAdvances(JSON.parse(savedAdvances));
  }, []);

  useEffect(() => {
    localStorage.setItem('employees', JSON.stringify(employees));
  }, [employees]);

  useEffect(() => {
    localStorage.setItem('storeItems', JSON.stringify(storeItems));
  }, [storeItems]);

  useEffect(() => {
    localStorage.setItem('advances', JSON.stringify(advances));
  }, [advances]);

  const addEmployee = () => {
    if (!employeeForm.name.trim()) {
      alert('Nome do colaborador é obrigatório!');
      return;
    }
    const newEmployee: Employee = {
      id: Date.now().toString(),
      name: employeeForm.name.trim(),
      department: employeeForm.department?.trim() || '',
      dateAdded: new Date().toLocaleString('pt-BR')
    };
    setEmployees([...employees, newEmployee]);
    setEmployeeForm({ name: '', department: '' });
  };

  const deleteEmployee = (id: string) => {
    if (!confirm('Remover colaborador e seus dados?')) return;
    const empToDelete = employees.find(emp => emp.id === id);
    if (empToDelete) {
      setEmployees(employees.filter(emp => emp.id !== id));
      setStoreItems(storeItems.filter(item => item.employeeName !== empToDelete.name));
      setAdvances(advances.filter(adv => adv.employeeName !== empToDelete.name));
    }
  };

  const addStoreItem = () => {
    if (!itemForm.employeeName || !itemForm.itemName || !itemForm.quantity || !itemForm.value) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    const newItem: StoreItem = {
      id: Date.now().toString(),
      employeeName: itemForm.employeeName,
      itemName: itemForm.itemName,
      quantity: parseInt(itemForm.quantity) || 1,
      value: parseFloat(itemForm.value) || 0,
      date: new Date().toLocaleString('pt-BR'),
      description: itemForm.description
    };
    setStoreItems([...storeItems, newItem]);
    setItemForm({ employeeName: '', itemName: '', quantity: '', value: '', description: '' });
  };

  const addAdvance = () => {
    if (!advanceForm.employeeName || !advanceForm.amount || !advanceForm.reason) {
      alert('Preencha todos os campos obrigatórios!');
      return;
    }
    const newAdvance: Advance = {
      id: Date.now().toString(),
      employeeName: advanceForm.employeeName,
      amount: parseFloat(advanceForm.amount) || 0,
      date: new Date().toLocaleString('pt-BR'),
      reason: advanceForm.reason
    };
    setAdvances([...advances, newAdvance]);
    setAdvanceForm({ employeeName: '', amount: '', reason: '' });
  };

  const deleteItem = (id: string) => {
    if (!confirm('Remover item?')) return;
    setStoreItems(storeItems.filter(item => item.id !== id));
  };

  const deleteAdvance = (id: string) => {
    if (!confirm('Remover adiantamento?')) return;
    setAdvances(advances.filter(adv => adv.id !== id));
  };

  const getUniqueEmployees = () => {
    const allNames = new Set([
      ...employees.map(emp => emp.name),
      ...storeItems.map(item => item.employeeName),
      ...advances.map(adv => adv.employeeName)
    ]);
    return Array.from(allNames).sort();
  };

  const getFilteredItems = () => filterEmployee === 'all' ? storeItems : storeItems.filter(item => item.employeeName === filterEmployee);

  const getFilteredAdvances = () => filterEmployee === 'all' ? advances : advances.filter(adv => adv.employeeName === filterEmployee);

  const getSummaryByEmployee = () => {
    const names = getUniqueEmployees();
    return names.map(name => {
      const items = storeItems.filter(item => item.employeeName === name);
      const advs = advances.filter(adv => adv.employeeName === name);
      const totalItems = items.reduce((sum, item) => sum + (item.value * item.quantity), 0);
      const totalAdvances = advs.reduce((sum, adv) => sum + adv.amount, 0);
      return {
        name,
        totalItems,
        totalAdvances,
        itemCount: items.length,
        advanceCount: advs.length,
        grandTotal: totalItems + totalAdvances
      };
    });
  };

  const exportToWhatsApp = async () => {
    if (storeItems.length === 0 && advances.length === 0) {
      alert('Não há dados para exportar!');
      return;
    }
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
    } catch (erro) {
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
          <Button 
            onClick={() => setShowInterface(true)}
            className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700 text-white font-bold py-3 px-8 rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-300 text-lg"
          >
            Acessar Sistema
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-800 mb-2">TL Sistema de Automação</h1>
          <p className="text-gray-600">Controle de Colaboradores - Itens e Adiantamentos</p>
        </div>
        {/* Tabs */}
       <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as InternalTabKey)} className="w-full"> {/* FIX: Adicione (value as InternalTabKey) */} 
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="employees">Colaboradores</TabsTrigger>
            <TabsTrigger value="items">Itens</TabsTrigger>
            <TabsTrigger value="advances">Adiantamentos</TabsTrigger>
            <TabsTrigger value="summary">Resumo</TabsTrigger>
          </TabsList>

          {/* Employees Tab */}
          <TabsContent value="employees" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Colaboradores</CardTitle>
                <CardDescription>Adicione ou remova colaboradores do sistema.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <Label>Nome do Colaborador</Label>
                      <Input
                        value={employeeForm.name}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, name: e.target.value })}
                        placeholder="Ex: João Silva"
                      />
                    </div>
                    <div>
                      <Label>Departamento</Label>
                      <Input
                        value={employeeForm.department}
                        onChange={(e) => setEmployeeForm({ ...employeeForm, department: e.target.value })}
                        placeholder="Opcional"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addEmployee} className="w-full">Adicionar Colaborador</Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Nome</th>
                          <th className="border border-gray-300 p-2">Departamento</th>
                          <th className="border border-gray-300 p-2">Data Adicionado</th>
                          <th className="border border-gray-300 p-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {employees.length === 0 ? (
                          <tr>
                            <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">Nenhum colaborador cadastrado.</td>
                          </tr>
                        ) : (
                          employees.map((emp) => (
                            <tr key={emp.id}>
                              <td className="border border-gray-300 p-2 font-medium">{emp.name}</td>
                              <td className="border border-gray-300 p-2">{emp.department || '-'}</td>
                              <td className="border border-gray-300 p-2 text-sm text-gray-500">{emp.dateAdded}</td>
                              <td className="border border-gray-300 p-2">
                                <Button variant="destructive" size="sm" onClick={() => deleteEmployee(emp.id)}>
                                  🗑️ Remover
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Items Tab */}
          <TabsContent value="items" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Itens do Estoque</CardTitle>
                <CardDescription>Registre itens retirados por colaboradores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-2 mb-4">
                    <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {getUniqueEmployees().map((name) => (                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                    <div>
                      <Label>Colaborador</Label>
                      <Select value={itemForm.employeeName} onValueChange={(value) => setItemForm({ ...itemForm, employeeName: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueEmployees().map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Nome do Item</Label>
                      <Input
                        value={itemForm.itemName}
                        onChange={(e) => setItemForm({ ...itemForm, itemName: e.target.value })}
                        placeholder="Ex: Caneta Azul"
                      />
                    </div>
                    <div>
                      <Label>Quantidade</Label>
                      <Input
                        type="number"
                        value={itemForm.quantity}
                        onChange={(e) => setItemForm({ ...itemForm, quantity: e.target.value })}
                        placeholder="Ex: 3"
                      />
                    </div>
                    <div>
                      <Label>Valor Unitário (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={itemForm.value}
                        onChange={(e) => setItemForm({ ...itemForm, value: e.target.value })}
                        placeholder="Ex: 1.50"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addStoreItem} className="w-full">Adicionar Item</Button>
                    </div>
                  </div>
                  <div>
                    <Label>Descrição (Opcional)</Label>
                    <Textarea
                      value={itemForm.description}
                      onChange={(e) => setItemForm({ ...itemForm, description: e.target.value })}
                      placeholder="Detalhes do item..."
                      className="col-span-5"
                    />
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Colaborador</th>
                          <th className="border border-gray-300 p-2">Item</th>
                          <th className="border border-gray-300 p-2">Qtd</th>
                          <th className="border border-gray-300 p-2">Valor Unit.</th>
                          <th className="border border-gray-300 p-2">Total</th>
                          <th className="border border-gray-300 p-2">Data</th>
                          <th className="border border-gray-300 p-2">Descrição</th>
                          <th className="border border-gray-300 p-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredItems().length === 0 ? (
                          <tr>
                            <td colSpan={8} className="border border-gray-300 p-4 text-center text-gray-500">Nenhum item registrado.</td>
                          </tr>
                        ) : (
                          getFilteredItems().map((item) => (
                            <tr key={item.id}>
                              <td className="border border-gray-300 p-2">{item.employeeName}</td>
                              <td className="border border-gray-300 p-2 font-medium">{item.itemName}</td>
                              <td className="border border-gray-300 p-2">{item.quantity}</td>
                              <td className="border border-gray-300 p-2">R$ {item.value.toFixed(2)}</td>
                              <td className="border border-gray-300 p-2 font-semibold">R$ {(item.value * item.quantity).toFixed(2)}</td>
                              <td className="border border-gray-300 p-2 text-sm text-gray-500">{item.date}</td>
                              <td className="border border-gray-300 p-2 text-sm">{item.description || '-'}</td>
                              <td className="border border-gray-300 p-2">
                                <Button variant="destructive" size="sm" onClick={() => deleteItem(item.id)}>
                                  🗑️ Remover
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Advances Tab */}
          <TabsContent value="advances" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Gerenciar Adiantamentos</CardTitle>
                <CardDescription>Registre adiantamentos concedidos a colaboradores.</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex items-end gap-2 mb-4">
                    <Select value={filterEmployee} onValueChange={setFilterEmployee}>
                      <SelectTrigger className="w-48">
                        <SelectValue placeholder="Filtrar por colaborador" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todos</SelectItem>
                        {getUniqueEmployees().map((name) => (
                          <SelectItem key={name} value={name}>{name}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                    <div>
                      <Label>Colaborador</Label>
                      <Select value={advanceForm.employeeName} onValueChange={(value) => setAdvanceForm({ ...advanceForm, employeeName: value })}>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecione..." />
                        </SelectTrigger>
                        <SelectContent>
                          {getUniqueEmployees().map((name) => (
                            <SelectItem key={name} value={name}>{name}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <Label>Valor (R$)</Label>
                      <Input
                        type="number"
                        step="0.01"
                        value={advanceForm.amount}
                        onChange={(e) => setAdvanceForm({ ...advanceForm, amount: e.target.value })}
                        placeholder="Ex: 150.00"
                      />
                    </div>
                    <div className="md:col-span-2">
                      <Label>Motivo</Label>
                      <Input
                        value={advanceForm.reason}
                        onChange={(e) => setAdvanceForm({ ...advanceForm, reason: e.target.value })}
                        placeholder="Ex: Salário parcial"
                      />
                    </div>
                    <div className="flex items-end">
                      <Button onClick={addAdvance} className="w-full">Adicionar Adiantamento</Button>
                    </div>
                  </div>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Colaborador</th>
                          <th className="border border-gray-300 p-2">Valor</th>
                          <th className="border border-gray-300 p-2">Motivo</th>
                          <th className="border border-gray-300 p-2">Data</th>
                          <th className="border border-gray-300 p-2">Ações</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getFilteredAdvances().length === 0 ? (
                          <tr>
                            <td colSpan={5} className="border border-gray-300 p-4 text-center text-gray-500">Nenhum adiantamento registrado.</td>
                          </tr>
                        ) : (
                          getFilteredAdvances().map((adv) => (
                            <tr key={adv.id}>
                              <td className="border border-gray-300 p-2 font-medium">{adv.employeeName}</td>
                              <td className="border border-gray-300 p-2 font-semibold">R$ {adv.amount.toFixed(2)}</td>
                              <td className="border border-gray-300 p-2">{adv.reason}</td>
                              <td className="border border-gray-300 p-2 text-sm text-gray-500">{adv.date}</td>
                              <td className="border border-gray-300 p-2">
                                <Button variant="destructive" size="sm" onClick={() => deleteAdvance(adv.id)}>
                                  🗑️ Remover
                                </Button>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Summary Tab */}
          <TabsContent value="summary" className="mt-4">
            <Card>
              <CardHeader>
                <CardTitle>Resumo Geral</CardTitle>
                <CardDescription>Visão geral dos totais e por colaborador. Exporte para WhatsApp.</CardDescription>
              </CardHeader>
              <CardContent>
                <div ref={summaryRef} className="space-y-6">
                  {/* Total Cards */}
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Colaboradores</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                          <path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
                          <circle cx="8.5" cy="7" r="4"></circle>
                          <path d="M20 8a6 6 0 1 1-13 0 6 6 0 0 1 13 0Z"></path>
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{employees.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Itens Registrados</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                          <rect width="18" height="18" x="3" y="3" rx="2" ry="2"></rect>
                          <line x1="12" x2="12" y1="9" y2="15"></line>
                          <line x1="9.09" x2="9.09" y1="9" y2="9.12"></line>
                          <line x1="15.91" x2="15.91" y1="9" y2="9.12"></line>
                          <line x1="9.09" x2="9.09" y1="15" y2="15.12"></line>
                          <line x1="15.91" x2="15.91" y1="15" y2="15.12"></line>
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{storeItems.length}</div>
                      </CardContent>
                    </Card>
                    <Card>
                      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium">Adiantamentos</CardTitle>
                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 text-muted-foreground">
                          <line x1="12" x2="12" y1="2" y2="22"></line>
                          <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
                        </svg>
                      </CardHeader>
                      <CardContent>
                        <div className="text-2xl font-bold">{advances.length}</div>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Summary Table */}
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-100">
                          <th className="border border-gray-300 p-2">Colaborador</th>
                          <th className="border border-gray-300 p-2">Itens (R$)</th>
                          <th className="border border-gray-300 p-2">Adiantamentos (R$)</th>
                          <th className="border border-gray-300 p-2">Total (R$)</th>
                        </tr>
                      </thead>
                      <tbody>
                        {getSummaryByEmployee().length === 0 ? (
                          <tr>
                            <td colSpan={4} className="border border-gray-300 p-4 text-center text-gray-500">Nenhum dado para exibir.</td>
                          </tr>
                        ) : (
                          getSummaryByEmployee().map((emp) => (
                            <tr key={emp.name}>
                              <td className="border border-gray-300 p-2 font-medium">{emp.name}</td>
                              <td className="border border-gray-300 p-2">R$ {emp.totalItems.toFixed(2)}</td>
                              <td className="border border-gray-300 p-2">R$ {emp.totalAdvances.toFixed(2)}</td>
                              <td className="border border-gray-300 p-2 font-semibold">R$ {emp.grandTotal.toFixed(2)}</td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>

                  {/* Export Button */}
                  <div className="flex justify-center mt-6">
                    <Button onClick={exportToWhatsApp} className="bg-green-600 hover:bg-green-700 text-white font-bold py-2 px-6 rounded-lg shadow-lg">
                      📱 Exportar Resumo para WhatsApp (PNG)
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default FuturisticEmployeeControl;