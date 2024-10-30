"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement } from 'chart.js';
import { AlertCircle, Activity, Power, Thermometer } from 'lucide-react';

// Registrar las escalas y elementos necesarios
Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement);

const Dashboard = () => {
  const [data, setData] = useState({ temperature: 24, energy: 85, status: 'normal' });
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');

    // Inicializa el gráfico si aún no existe
    if (!chartInstance.current) {
      chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
          labels: Array.from({ length: 10 }, (_, i) => `T-${i}`),
          datasets: [
            {
              label: 'Temperatura',
              data: Array(10).fill(0),
              borderColor: '#60A5FA',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            },
            {
              label: 'Energía',
              data: Array(10).fill(0),
              borderColor: '#FBBF24',
              borderWidth: 2,
              fill: false,
              tension: 0.1
            }
          ]
        },
        options: {
          scales: {
            x: {
              type: 'category',
              ticks: { color: '#9CA3AF' },
              grid: { color: '#374151' }
            },
            y: {
              beginAtZero: true,
              ticks: { color: '#9CA3AF' },
              grid: { color: '#374151' }
            }
          },
          plugins: {
            legend: { labels: { color: '#E5E7EB' } }
          }
        }
      });
    }

    const addData = () => {
      const newTemp = Math.floor(Math.random() * 100);
      const newEnergy = Math.floor(Math.random() * 100);
      
      chartInstance.current.data.datasets[0].data.push(newTemp);
      chartInstance.current.data.datasets[1].data.push(newEnergy);
      chartInstance.current.data.datasets[0].data.shift();
      chartInstance.current.data.datasets[1].data.shift();
      
      chartInstance.current.update();
    };

    const updateData = () => {
      const newTemp = Math.floor(Math.random() * 100);
      const newEnergy = Math.floor(Math.random() * 100);
      const newStatus = newTemp > 90 || newEnergy > 90 ? 'warning' : 'normal';

      setData({ temperature: newTemp, energy: newEnergy, status: newStatus });
    };

    const interval = setInterval(() => {
      addData();
      updateData();
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-900 text-gray-100 p-6">
      <div className="max-w-7xl mx-auto">
        <header className="mb-8">
          <h1 className="text-2xl font-bold text-white mb-2">Dashboard de Automatización</h1>
          <div className="flex items-center gap-2">
            <Activity className="text-green-400" size={20} />
            <span className="text-green-400">Sistema Operativo</span>
          </div>
        </header>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Temperatura</p>
                <h3 className="text-2xl font-bold">{data.temperature}°C</h3>
              </div>
              <Thermometer className="text-blue-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Consumo Energético</p>
                <h3 className="text-2xl font-bold">{data.energy}%</h3>
              </div>
              <Power className="text-yellow-400" size={24} />
            </div>
          </div>

          <div className="bg-gray-800 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-gray-400">Estado del Sistema</p>
                <h3 className="text-2xl font-bold">{data.status === 'warning' ? 'Advertencia' : 'Normal'}</h3>
              </div>
              <AlertCircle className={data.status === 'warning' ? 'text-red-400' : 'text-green-400'} size={24} />
            </div>
          </div>
        </div>
        
        <div className="bg-gray-800 p-4 rounded-lg w-full">
          <h3 className="text-lg font-semibold mb-4">Monitoreo en Tiempo Real</h3>
          <div className="w-full h-82">
            <canvas ref={chartRef} id="realtimeChart" className="w-full h-full"></canvas>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Dashboard;
