"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Chart, CategoryScale, LinearScale, LineController, LineElement, PointElement, ChartData, ChartOptions } from 'chart.js';
import { AlertCircle, Activity, Power, Thermometer } from 'lucide-react';

// Registrar las escalas y elementos necesarios
Chart.register(CategoryScale, LinearScale, LineController, LineElement, PointElement);

// Definir interfaces para los tipos
interface DashboardData {
  temperature: number;
  energy: number;
  status: 'normal' | 'warning';
}

const Dashboard = () => {
  const [data, setData] = useState<DashboardData>({ 
    temperature: 24, 
    energy: 85, 
    status: 'normal' 
  });
  
  const chartRef = useRef<HTMLCanvasElement | null>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');
    if (!ctx) return;

    // Configuración inicial del gráfico
    const chartData: ChartData = {
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
    };

    const chartOptions: ChartOptions = {
      responsive: true,
      maintainAspectRatio: false,
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
        legend: { 
          labels: { color: '#E5E7EB' },
          display: true
        }
      }
    };

    // Destruir el gráfico existente si hay uno
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Crear nuevo gráfico
    chartInstance.current = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions
    });

    // Función para actualizar datos
    const addData = () => {
      if (!chartInstance.current) return;

      const newTemp = Math.floor(Math.random() * 100);
      const newEnergy = Math.floor(Math.random() * 100);
      
      const tempData = chartInstance.current.data.datasets[0].data;
      const energyData = chartInstance.current.data.datasets[1].data;
      
      if (Array.isArray(tempData) && Array.isArray(energyData)) {
        tempData.push(newTemp);
        energyData.push(newEnergy);
        tempData.shift();
        energyData.shift();
        
        chartInstance.current.update();
      }
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

    return () => {
      clearInterval(interval);
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
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
          <div className="w-full h-[400px]">
            <canvas ref={chartRef} className="w-full h-full"></canvas>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;