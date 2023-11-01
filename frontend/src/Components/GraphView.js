import React, { useEffect, useRef, useState } from "react";
import {
    Chart,
    CategoryScale,
    LinearScale,
    BarController,
    BarElement,
    Title,
    Tooltip,
    Legend
} from "chart.js";
import "../Styles/App.css";

Chart.register(CategoryScale, LinearScale, BarController, BarElement, Title, Tooltip, Legend);

const GraphView = () => {
    const [expenses, setExpenses] = useState([]);
    const [incomes, setIncomes] = useState([]);

    const chartRef = useRef(null);
    const myChartRef = useRef(null);

    const groupByMonth = (arr) => {
        let grouped = {};
        arr.forEach(item => {
            const date = new Date(item.date);
            if (!isNaN(date.getTime())) {
                const month = date.getMonth();
                grouped[month] = (grouped[month] || 0) + parseFloat(item.amount);
            }
        });
        return grouped;
    }

    useEffect(() => {
        const fetchData = async () => {
            try {
                const headers = {
                    Authorization: `Bearer ${localStorage.getItem("access")}`,
                };

                // Fetch expenses
                const expensesResponse = await fetch("http://127.0.0.1:8000/api/expenses/", { headers });
                if (!expensesResponse.ok) {
                    throw new Error("Failed to fetch expenses.");
                }
                let expensesData = await expensesResponse.json();

                // Fetch incomes
                const incomesResponse = await fetch("http://127.0.0.1:8000/api/incomes/", { headers });
                if (!incomesResponse.ok) {
                    throw new Error("Failed to fetch incomes.");
                }
                let incomesData = await incomesResponse.json();

                setExpenses(expensesData.results);
                setIncomes(incomesData.results);
            } catch (error) {
                console.error("Error:", error);
            }
        };

        fetchData();
    }, []);

    useEffect(() => {
        const monthlyExpenses = groupByMonth(expenses);
        const monthlyIncomes = groupByMonth(incomes);

        const labels = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        const expensesData = labels.map((_, index) => monthlyExpenses[index] || 0);
        const incomesData = labels.map((_, index) => monthlyIncomes[index] || 0);

        const maxYValue = Math.max(...expensesData, ...incomesData);
        const maxRoundedYValue = Math.ceil(maxYValue / 5000) * 5000;

        const chartData = {
            labels: labels,
            datasets: [
                {
                    label: "Expenses",
                    data: expensesData,
                    backgroundColor: "rgba(255, 99, 132, 0.8)",
                    borderColor: "rgba(255, 99, 132, 1)",
                    borderWidth: 1,
                },
                {
                    label: "Incomes",
                    data: incomesData,
                    backgroundColor: "rgba(75, 192, 192, 0.8)",
                    borderColor: "rgba(75, 192, 192, 1)",
                    borderWidth: 1,
                }
            ],
        };

        if (chartRef && chartRef.current) {
            const ctx = chartRef.current.getContext("2d");
            if (myChartRef.current) {
                myChartRef.current.destroy();
                myChartRef.current = null;
            }

            myChartRef.current = new Chart(ctx, {
                type: "bar",
                data: chartData,
                options: {
                    scales: {
                        x: {
                            ticks: {
                                font: { size: 10 },
                            },
                            barThickness: 30,
                        },
                        y: {
                            ticks: {
                                beginAtZero: true,
                                font: { size: 10 },
                                stepSize: Math.round(maxRoundedYValue / 10),
                                min: 0,
                                max: maxRoundedYValue
                            },
                        },
                    },
                    plugins: {
                        legend: {
                            labels: {
                                font: { size: 10 }
                            },
                        },
                        tooltip: {
                            titleFont: { size: 12 },
                            bodyFont: { size: 10 }
                        },
                    },
                },
            });
        }

        return () => {
            if (myChartRef.current) {
                myChartRef.current.destroy();
                myChartRef.current = null;
            }
        };
    }, [expenses, incomes]);

    return (
        <div className="chart-view">
            <canvas ref={chartRef}></canvas>
        </div>
    );
};

export default GraphView;
