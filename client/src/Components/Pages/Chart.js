import React, { useContext } from 'react';
import { Bar, Line, Pie, Doughnut } from 'react-chartjs-2';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement } from 'chart.js';
import { UserContext } from '../../context/UserContext';
import "../CSS/Chart.css";


ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);

const Chart = () => {
  const { state } = useContext(UserContext);

  const calculateMonthlyTotals = (transactions) => {
    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();

    return transactions.reduce((total, transaction) => {
      const transactionDate = new Date(transaction.date);
      if (
        transactionDate.getMonth() === currentMonth &&
        transactionDate.getFullYear() === currentYear
      ) {
        if(transaction.frequency === 'bi-weekly'){
          total += transaction.amount * 2;
        } 
        else if(transaction.frequency === 'weekly'){
          total += transaction.amount * 4;
        }
        else{
          total += transaction.amount;
        }
      }
      return total;
    }, 0);
  };

  const totalIncome = calculateMonthlyTotals(state.income);
  const totalExpenses = calculateMonthlyTotals(state.expenses);

  const chartData = (data, label) => ({
    labels: data.map(entry => new Date(entry.date).toLocaleDateString()),
    datasets: [
      {
        label: label,
        data: data.map(entry => entry.amount),
        backgroundColor: 'rgba(75,192,192,0.4)',
        borderColor: 'rgba(75,192,192,1)',
        borderWidth: 1,
      },
    ],
  });

  const options = (label) => ({
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: `Monthly ${label}`,
      },
    },
  });
  

  return (
    <div className="charts">
      <h2>Income and Expense Charts</h2>
      <div className="chart-container">
      <div className="chart-group">
<div>
<h3>Bar Chart</h3>
        <Bar data={chartData(state.income, 'Income')} options={options('Income')} />


</div>
<div>
<h3>Bar Chart</h3>

<Bar data={chartData(state.expenses, 'Expenses')} options={options('Expenses')} />

</div>

              </div>
              </div>
            
              <div className="chart-container">
    <div className="chart-group">
      <div>
        <h3>Line Chart</h3>
        <Line data={chartData(state.income, 'Income')} options={options('Income')} />
      </div>
      <div>
        <h3>Line Chart</h3>
        <Line data={chartData(state.expenses, 'Expenses')} options={options('Expenses')} />
      </div>
    </div>
    </div>



      <div className="chart-container">

      <div className="chart-group">
        <div>
        <h3>Pie Chart</h3>
        <Pie data={chartData(state.income, 'Income')} options={options('Income')} />
        </div>
        <div>
        <h3>Pie Chart</h3>
        <Pie data={chartData(state.expenses, 'Expenses')} options={options('Expenses')} />
        </div>

        </div>
      </div>

      <div className="chart-container">
      <div className="chart-group">
        <div>
        <h3>Doughnut Chart</h3>
        <Doughnut data={chartData(state.income, 'Income')} options={options('Income')} />

        </div>
        <div>
        <h3>Doughnut Chart</h3>

        <Doughnut data={chartData(state.expenses, 'Expenses')} options={options('Expenses')} />
        </div>
        </div>

      </div>
    </div>
  );
};

export default Chart;
