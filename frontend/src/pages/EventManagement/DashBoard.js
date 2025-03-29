import React, { useState } from 'react';
import { FaUsers, FaUserTie, FaMoneyBillWave, FaWarehouse, FaTruck, FaUtensils, FaCocktail, FaCalendarAlt } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const styles = {
  dashboard: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: '100vh',
    padding: '20px',
    maxWidth: '1200px',
    margin: '0 auto',
    marginTop: '60px', // Added to account for the fixed title bar
  },
  cardContainer: {
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: '20px',
    width: '100%',
    marginBottom: '20px',
  },
  card: {
    backgroundColor: '#f8f9fa',
    borderRadius: '8px',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
    padding: '20px',
    textAlign: 'center',
    transition: 'transform 0.3s, box-shadow 0.3s',
    cursor: 'pointer',
    margin: '10px',
  },
  cardHover: {
    transform: 'scale(1.05)',
    boxShadow: '0 6px 12px rgba(0, 0, 0, 0.15)',
  },
  icon: {
    fontSize: '40px',
    color: '#800000',
    marginBottom: '10px',
  },
  cardTitle: {
    fontSize: '20px',
    fontWeight: 'bold',
    marginBottom: '10px',
  },
  cardContent: {
    fontSize: '16px',
    color: '#6c757d',
  },
  modal: {
    position: 'fixed',
    top: '0',
    left: '0',
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0,0,0,0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: '1000',
  },
  modalContent: {
    backgroundColor: 'white',
    padding: '30px',
    borderRadius: '10px',
    boxShadow: '0 5px 15px rgba(0,0,0,0.3)',
    display: 'grid',
    gridTemplateColumns: '1fr 1fr',
    gap: '20px',
    width: '60%',
    maxWidth: '600px',
  },
  closeButton: {
    position: 'absolute',
    top: '20px',
    right: '20px',
    fontSize: '24px',
    cursor: 'pointer',
    color: 'white',
  },
  titleBar: {
    backgroundColor: '#1a1a1a',
    padding: '10px',
    margin: 0,
    width: '100%',
    position: 'fixed',
    top: 0,
    boxSizing: 'border-box',
    textAlign: 'center',
    color: '#fff',
    borderBottom: '1px solid #333',
    zIndex: 1000,
  },
};

const Card = ({ title, content, Icon, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <Icon style={styles.icon} />
      <div style={styles.cardTitle}>{title}</div>
      <div style={styles.cardContent}>{content}</div>
    </div>
  );
};

const SubOption = ({ title, Icon, onClick }) => {
  const [hovered, setHovered] = useState(false);

  return (
    <div
      style={{
        ...styles.card,
        ...(hovered ? styles.cardHover : {}),
        padding: '15px',
      }}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onClick={onClick}
    >
      <Icon style={styles.icon} />
      <div style={styles.cardTitle}>{title}</div>
    </div>
  );
};

const Dashboard = () => {
  const navigate = useNavigate();
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (modalType) => {
    setActiveModal(modalType);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <>
      {/* Admin Panel Title Bar */}
      <div style={styles.titleBar}>
        <h1 style={{ margin: 0, padding: 0 }}>Admin Panel</h1>
      </div>

      <div style={styles.dashboard}>
        {/* First Row of Cards */}
        <div style={styles.cardContainer}>
          <Card
            title="Customer & Employee"
            content="Manage people"
            Icon={FaUsers}
            onClick={() => openModal('people')}
          />
          <Card
            title="Inventory & Supplier"
            content="Manage stock and suppliers"
            Icon={FaWarehouse}
            onClick={() => openModal('inventory')}
          />
          <Card
            title="Finance & Events"
            content="Manage money and events"
            Icon={FaMoneyBillWave}
            onClick={() => openModal('finance')}
          />
          <Card
            title="Restaurant & Bar"
            content="Manage food and drinks"
            Icon={FaUtensils}
            onClick={() => openModal('restaurant')}
          />
        </div>

        {/* People Management Modal */}
        {activeModal === 'people' && (
          <div style={styles.modal}>
            <span style={styles.closeButton} onClick={closeModal}>×</span>
            <div style={styles.modalContent}>
              <SubOption
                title="Customer"
                Icon={FaUsers}
                onClick={() => {
                  navigate('/cuslogin');
                  closeModal();
                }}
              />
              <SubOption
                title="Employee"
                Icon={FaUserTie}
                onClick={() => {
                  navigate('/LoginChoose');
                  closeModal();
                }}
              />
            </div>
          </div>
        )}

        {/* Inventory Management Modal */}
        {activeModal === 'inventory' && (
          <div style={styles.modal}>
            <span style={styles.closeButton} onClick={closeModal}>×</span>
            <div style={styles.modalContent}>
              <SubOption
                title="Inventory"
                Icon={FaWarehouse}
                onClick={() => {
                  navigate('/inventorylogin');
                  closeModal();
                }}
              />
              <SubOption
                title="Supplier"
                Icon={FaTruck}
                onClick={() => {
                  navigate('/SuppLogin');
                  closeModal();
                }}
              />
            </div>
          </div>
        )}

        {/* Finance Management Modal */}
        {activeModal === 'finance' && (
          <div style={styles.modal}>
            <span style={styles.closeButton} onClick={closeModal}>×</span>
            <div style={styles.modalContent}>
              <SubOption
                title="Finance"
                Icon={FaMoneyBillWave}
                onClick={() => {
                  navigate('/finance/login');
                  closeModal();
                }}
              />
              <SubOption
                title="Events"
                Icon={FaCalendarAlt}
                onClick={() => {
                  navigate('/eventlogin');
                  closeModal();
                }}
              />
            </div>
          </div>
        )}

        {/* Restaurant Management Modal */}
        {activeModal === 'restaurant' && (
          <div style={styles.modal}>
            <span style={styles.closeButton} onClick={closeModal}>×</span>
            <div style={styles.modalContent}>
              <SubOption
                title="Restaurant"
                content="Oversee restaurant operations"
                Icon={FaUtensils}
                onClick={() => {
                  navigate('/homepage');
                  closeModal();
                }}
              />
              <SubOption
                title="Bar"
                Icon={FaCocktail}
                onClick={() => {
                  navigate('/barlogin');
                  closeModal();
                }}
              />
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default Dashboard;