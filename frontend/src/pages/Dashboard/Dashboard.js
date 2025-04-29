import React from 'react';
import { useAuth } from '../../hooks/useAuth'; // Custom hook for authentication
import { Pie, Line } from 'react-chartjs-2'; // Chart components
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Tooltip, 
  Legend, 
  Title 
} from 'chart.js'; // Chart.js components
import classes from './dashboard.module.css'; // CSS module for styling

// Register Chart.js components
ChartJS.register(
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  ArcElement, 
  Title, 
  Tooltip, 
  Legend
);

const Dashboard = () => {
    const { user } = useAuth(); // Get user data from auth context

    // Data for Pie Chart (Order Status Distribution)
    const orderStatusData = {
        labels: ['Pending', 'Completed', 'Canceled'],
        datasets: [
            {
                data: [30, 60, 10], // Example data for status distribution
                backgroundColor: ['#FF6384', '#36A2EB', '#FFCE56'], // Colors for each segment
            },
        ],
    };

    // Data for Line Chart (Sales Trend)
    const salesData = {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct'],
        datasets: [
            {
                label: 'Total Sales',
                data: [500, 800, 600, 1000, 900, 1200, 1400, 1100, 1300, 1500], // Example sales data
                borderColor: 'rgba(75, 192, 192, 1)', // Line color
                backgroundColor: 'rgba(75, 192, 192, 0.2)', // Area fill color
            },
        ],
    };

    // Options for Line Chart
    const salesOptions = {
        responsive: true, // Make chart responsive
        plugins: {
            legend: { position: 'top' }, // Legend position
            title: { 
                display: true, 
                text: 'Sales Over Time' // Chart title
            },
        },
    };

    return (
        <div className={classes.container}>
            {/* Graphical Analysis Section */}
            <div className={classes.graphContainer}>
                <h2>Orders Overview</h2>
                <div className={classes.chartRow}>
                    {/* Pie Chart: Order Status Distribution */}
                    <div className={classes.chartSection}>
                        <h3>Order Status Distribution</h3>
                        <div className={classes.chartWrapper}>
                            <Pie data={orderStatusData} />
                        </div>
                    </div>

                    {/* Line Chart: Sales Trend Over Time */}
                    <div className={classes.chartSection}>
                        <h3>Sales Trend</h3>
                        <div className={classes.chartWrapper}>
                            <Line data={salesData} options={salesOptions} />
                        </div>
                    </div>
                </div>
            </div>

            {/* Menu Items Section */}
            <div className={classes.menu}>
                {/* Filter and map through menu items based on user admin status */}
                {allItems
                    .filter(item => user.isAdmin || !item.forAdmin)
                    .map(item => (
                        <a
                            key={item.title}
                            href={item.url}
                            style={{
                                backgroundColor: item.bgColor,
                                color: item.color,
                            }}
                        >
                            <img src={item.imageUrl} alt={item.title} />
                            <h2>{item.title}</h2>
                        </a>
                    ))}
            </div>
        </div>
    );
};

// Array of menu items with their properties
const allItems = [
    {
        title: 'Orders',
        imageUrl: '/icons/orders.svg',
        url: '/orders',
        bgColor: 'red',
        color: 'white',
    },
    {
        title: 'Profile',
        imageUrl: '/icons/profile.svg',
        url: '/profile',
        bgColor: 'darkorange',
        color: 'white',
    },
    {
        title: 'Users',
        imageUrl: '/icons/users.svg',
        url: '/admin/users',
        forAdmin: true, // Only visible to admins
        bgColor: 'grey',
        color: 'white',
    },
    {
        title: 'Foods',
        imageUrl: '/icons/foods.svg',
        url: '/admin/foods',
        forAdmin: true, // Only visible to admins
        bgColor: 'green',
        color: 'white',
    },
];

export default Dashboard;