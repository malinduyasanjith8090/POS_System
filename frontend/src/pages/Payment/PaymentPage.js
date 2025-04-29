import React, { useState, useEffect } from 'react';
import jsPDF from 'jspdf'; // PDF generation library
import classes from './paymentPage.module.css'; // CSS module
import { getNewOrderForCurrentUser } from '../../services/orderService'; // Order service
import Title from '../../components/Title/Title'; // Title component
import OrderItemsList from '../../components/OrderItemsList/orderItemsList'; // Order items component
import PaypalButtons from '../../components/PaypalButtons/PaypalButtons'; // PayPal payment component

export default function PaymentPage() {
    // State to store the current order
    const [order, setOrder] = useState();

    // Fetch the current user's new order when component mounts
    useEffect(() => {
        getNewOrderForCurrentUser()
            .then(data => setOrder(data))
            .catch(error => {
                console.error('Error fetching order:', error.response || error.message);
            });
    }, []);
    
    // Function to generate a PDF invoice
    const generatePDF = () => {
        if (!order) return; // Guard clause if order isn't available

        const pdf = new jsPDF(); // Create new PDF document
        const img = new Image(); // Create image for logo
        img.src = '/images/company.png'; // Set logo path

        // When logo loads, build the PDF
        img.onload = () => {
            // Add company logo
            pdf.addImage(img, 'PNG', 10, 10, 50, 20);
            
            // Add title
            pdf.setFontSize(22);
            pdf.text('Bill Summary', 105, 60, { align: 'center' });
            
            // Customer details section
            pdf.setFontSize(16);
            pdf.text('Customer Details:', 10, 80);
            pdf.setFontSize(12);
            pdf.text(`Name: ${order.name || 'N/A'}`, 10, 90);
            pdf.text(`Address: ${order.address || 'N/A'}`, 10, 100);
            
            // Order items section
            pdf.setFontSize(16);
            pdf.text('Order Items:', 10, 120);
            pdf.setFontSize(12);
            
            // Table headers
            pdf.text('No', 10, 130);
            pdf.text('Item', 30, 130);
            pdf.text('Qty', 120, 130);
            pdf.text('Price', 150, 130);
            pdf.text('Total', 180, 130);

            // Table rows for each order item
            let yPosition = 140;
            order.items.forEach((item, index) => {
                pdf.text(`${index + 1}`, 10, yPosition);
                pdf.text(`${item.food.name}`, 30, yPosition);
                pdf.text(`${item.quantity}`, 120, yPosition);
                pdf.text(`$${item.price.toFixed(2)}`, 150, yPosition);
                pdf.text(`$${(item.quantity * item.price).toFixed(2)}`, 180, yPosition);
                yPosition += 10;
            });

            // Footer
            pdf.setFontSize(10);
            pdf.text('Thank you for shopping with us!', 105, 270, { align: 'center' });
            pdf.text('www.companywebsite.com', 105, 280, { align: 'center' });

            // Border around the document
            pdf.setLineWidth(0.5);
            pdf.rect(5, 5, 200, 287);

            // Save the PDF
            pdf.save('OrderBill.pdf');
        };
    };

    // Show loading state while order is being fetched
    if (!order) {
        return <div>Loading...</div>;
    }

    return (
        <div className={classes.container}>
            <div className={classes.content}>
                {/* Page title */}
                <Title title="Order Form" fontSize="1.6rem" />
                
                {/* Customer details */}
                <div className={classes.summary}>
                    <div>
                        <h3>Name:</h3>
                        <span>{order.name}</span>
                    </div>
                    <div>
                        <h3>Address:</h3>
                        <span>{order.address}</span>
                    </div>
                </div>
                
                {/* Order items list */}
                <OrderItemsList order={order} />
            </div>

            {/* Payment and PDF buttons */}
            <div className={classes.buttons_container}>
                <div className={classes.buttons}>
                    {/* PayPal payment button */}
                    <PaypalButtons order={order} />
                    
                    {/* PDF generation button */}
                    <button onClick={generatePDF}
                        style={{
                            backgroundColor: '#4CAF50',
                            color: 'white',
                            padding: '10px 20px',
                            fontSize: '16px',
                            border: 'none',
                            borderRadius: '5px',
                            cursor: 'pointer',
                            boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
                            transition: 'background-color 0.3s ease',
                        }}
                        onMouseOver={(e) => e.target.style.backgroundColor = '#45a049'}
                        onMouseOut={(e) => e.target.style.backgroundColor = '#4CAF50'}
                    >
                        Summary Bill
                    </button>
                </div>
            </div>
        </div>
    );
}