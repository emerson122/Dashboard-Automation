
"use client";

import React, { useState, useEffect } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { AlertCircle, Activity, Power, Thermometer } from 'lucide-react';

const mockData = [
  { time: '00:00', temperature: 24, energy: 85, status: 'normal' },
  { time: '04:00', temperature: 23, energy: 82, status: 'normal' },
  { time: '08:00', temperature: 26, energy: 90, status: 'warning' },
  { time: '12:00', temperature: 28, energy: 88, status: 'normal' },
  { time: '16:00', temperature: 27, energy: 85, status: 'normal' },
  { time: '20:00', temperature: 25, energy: 83, status: 'normal' },
];

const Dashboard = () => {
  const [data, setData] = useState(mockData);
  const [systemStatus, setSystemStatus] = useState('Operativo');

  useEffect(() => {
    const interval = setInterval(() => {
      const newData = [...data];
      const lastValue = newData[newData.length - 1];
      const newTemp = lastValue.temperature + (Math.random() * 2 - 1);
      const newEnergy = lastValue.energy + (Math.random() * 4 - 2);
      
      newData.shift();
      newData.push({
        time: new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }),
        temperature: Math.round(newTemp * 10) / 10,
        energy: Math.round(newEnergy),
        status: newEnergy > 88 ? 'warning' : 'normal'
      });
      
      setData(newData);
    }, 3000);

    return () => clearInterval(interval);
  }, [data]);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard de Automatización</h1>
          <div className="flex items-center gap-2">
            <Activity className="text-green-400" size={20} />
            <span className="text-green-400">Sistema {systemStatus}</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Temperatura</p>
                <h3 className="text-2xl font-bold">{data[data.length - 1].temperature}°C</h3>
              </div>
              <Thermometer className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Consumo Energético</p>
                <h3 className="text-2xl font-bold">{data[data.length - 1].energy}%</h3>
              </div>
              <Power className="text-yellow-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg shadow-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Estado del Sistema</p>
                <h3 className="text-2xl font-bold">Normal</h3>
              </div>
              <AlertCircle className="text-green-400" size={24} />
            </div>
          </div>
        </div>

        <div className="bg-gray-800 p-6 rounded-lg shadow-lg w-full">
          <h3 className="text-lg font-semibold mb-6">Monitoreo en Tiempo Real</h3>
          {/* Contenedor con altura fija y width 100% */}
          <div style={{ width: '100%', height: '400px' }}>
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
                <XAxis 
                  dataKey="time" 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <YAxis 
                  stroke="#9CA3AF"
                  style={{ fontSize: '12px' }}
                />
                <Tooltip 
                  contentStyle={{ 
                    backgroundColor: '#1F2937', 
                    border: 'none',
                    borderRadius: '4px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.1)'
                  }}
                  itemStyle={{ color: '#E5E7EB' }}
                />
                <Line 
                  type="monotone" 
                  dataKey="temperature" 
                  stroke="#60A5FA" 
                  strokeWidth={2}
                  dot={false}
                  name="Temperatura"
                />
                <Line 
                  type="monotone" 
                  dataKey="energy" 
                  stroke="#FBBF24" 
                  strokeWidth={2}
                  dot={false}
                  name="Energía"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;