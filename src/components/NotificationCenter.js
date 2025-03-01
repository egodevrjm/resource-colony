// src/components/NotificationCenter.js
import React, { useState, useEffect } from 'react';
import styled, { keyframes } from 'styled-components';
import { useNotifications } from '../contexts/NotificationContext';
import { FaBell, FaCheckCircle, FaExclamationTriangle, FaInfoCircle, FaTimesCircle, FaTimes, FaTrash, FaRegBell } from 'react-icons/fa';

const fadeIn = keyframes`
  from { opacity: 0; transform: translateY(10px); }
  to { opacity: 1; transform: translateY(0); }
`;

const slideIn = keyframes`
  from { transform: translateX(100%); }
  to { transform: translateX(0); }
`;

const slideOut = keyframes`
  from { transform: translateX(0); }
  to { transform: translateX(100%); }
`;

const NotificationButton = styled.button`
  position: fixed;
  bottom: 20px;
  right: 20px;
  width: 50px;
  height: 50px;
  border-radius: 50%;
  background: var(--primaryButton);
  color: white;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  border: none;
  box-shadow: 0 2px 10px rgba(0, 0, 0, 0.2);
  z-index: 1000;
  transition: all 0.2s;
  
  &:hover {
    transform: translateY(-3px);
    box-shadow: 0 4px 15px rgba(0, 0, 0, 0.3);
    background: var(--primaryButtonHover);
  }
`;

const NotificationCount = styled.div`
  position: absolute;
  top: -5px;
  right: -5px;
  background: var(--danger);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-size: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
`;

const CenterPanel = styled.div`
  position: fixed;
  top: 0;
  right: 0;
  width: 350px;
  height: 100vh;
  background: var(--cardBackground);
  box-shadow: -5px 0 15px rgba(0, 0, 0, 0.1);
  z-index: 1001;
  display: flex;
  flex-direction: column;
  animation: ${props => props.isClosing ? slideOut : slideIn} 0.3s ease-out;
  overflow: hidden;
`;

const PanelHeader = styled.div`
  padding: 16px;
  border-bottom: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const HeaderTitle = styled.h2`
  margin: 0;
  font-size: 1.2rem;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 8px;
`;

const CloseButton = styled.button`
  background: transparent;
  border: none;
  color: var(--textSecondary);
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 5px;
  font-size: 1.2rem;
  border-radius: 4px;
  
  &:hover {
    color: var(--primary);
    background: var(--hoverBackground);
  }
`;

const TabsContainer = styled.div`
  display: flex;
  border-bottom: 1px solid var(--border);
`;

const Tab = styled.button`
  flex: 1;
  padding: 10px;
  background: ${props => props.active ? 'var(--primary)' : 'transparent'};
  color: ${props => props.active ? 'white' : 'var(--text)'};
  border: none;
  cursor: pointer;
  transition: background-color 0.2s;
  font-weight: ${props => props.active ? 'bold' : 'normal'};
  
  &:hover {
    background: ${props => props.active ? 'var(--primary)' : 'var(--hoverBackground)'};
  }
`;

const NotificationList = styled.div`
  flex: 1;
  overflow-y: auto;
  padding: 10px;
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const NotificationItem = styled.div`
  padding: 12px;
  background: var(--hoverBackground);
  border-left: 4px solid ${props => 
    props.type === 'success' ? 'var(--success)' : 
    props.type === 'warning' ? 'var(--warning)' : 
    props.type === 'error' ? 'var(--danger)' : 
    'var(--primary)'};
  border-radius: 4px;
  animation: ${fadeIn} 0.3s ease-out;
  position: relative;
  
  &:hover {
    background: var(--cardBackground);
  }
`;

const NotificationHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 4px;
`;

const NotificationTitle = styled.div`
  font-weight: bold;
  color: var(--text);
  display: flex;
  align-items: center;
  gap: 6px;
`;

const NotificationTypeIcon = styled.span`
  color: ${props => 
    props.type === 'success' ? 'var(--success)' : 
    props.type === 'warning' ? 'var(--warning)' : 
    props.type === 'error' ? 'var(--danger)' : 
    'var(--primary)'};
`;

const NotificationTimestamp = styled.div`
  font-size: 0.7rem;
  color: var(--textSecondary);
`;

const NotificationContent = styled.div`
  color: var(--textSecondary);
  font-size: 0.9rem;
  line-height: 1.4;
`;

const DeleteButton = styled.button`
  position: absolute;
  top: 8px;
  right: 8px;
  background: transparent;
  border: none;
  color: var(--textSecondary);
  opacity: 0;
  transition: opacity 0.2s, color 0.2s;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  
  ${NotificationItem}:hover & {
    opacity: 1;
  }
  
  &:hover {
    color: var(--danger);
  }
`;

const EmptyState = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 40px 20px;
  color: var(--textSecondary);
  text-align: center;
  
  svg {
    font-size: 3rem;
    margin-bottom: 16px;
    opacity: 0.3;
  }
`;

const EmptyText = styled.div`
  font-size: 1rem;
  margin-bottom: 8px;
`;

const EmptySubtext = styled.div`
  font-size: 0.8rem;
  max-width: 250px;
`;

const ActionBar = styled.div`
  padding: 10px;
  border-top: 1px solid var(--border);
  display: flex;
  justify-content: space-between;
`;

const ActionButton = styled.button`
  background: ${props => props.danger ? 'var(--danger)' : 'var(--hoverBackground)'};
  color: ${props => props.danger ? 'white' : 'var(--text)'};
  border: none;
  padding: 8px 12px;
  border-radius: 4px;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.9rem;
  transition: all 0.2s;
  
  &:hover {
    background: ${props => props.danger ? '#e53e3e' : 'var(--border)'};
    transform: translateY(-2px);
  }
  
  &:disabled {
    opacity: 0.5;
    cursor: not-allowed;
    transform: none;
  }
`;

const Backdrop = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.3);
  z-index: 1000;
  animation: ${fadeIn} 0.3s ease-out;
`;

const NotificationCenter = () => {
  const [open, setOpen] = useState(false);
  const [activeTab, setActiveTab] = useState('recent');
  const [notifications, setNotifications] = useState([]);
  const [newCount, setNewCount] = useState(0);
  const [isClosing, setIsClosing] = useState(false);
  
  // Function to add new notifications
  const addNotification = (notification) => {
    const newNotification = {
      ...notification,
      timestamp: new Date(),
      read: false
    };
    
    setNotifications(prev => [newNotification, ...prev]);
    setNewCount(prev => prev + 1);
  };
  
  // Listen for notifications from the context
  useEffect(() => {
    const handleNotification = (event) => {
      if (event.detail) {
        addNotification(event.detail);
      }
    };
    
    window.addEventListener('notification', handleNotification);
    
    return () => {
      window.removeEventListener('notification', handleNotification);
    };
  }, []);
  
  // Handle close animation
  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setOpen(false);
      setIsClosing(false);
    }, 300);
  };
  
  // Handle opening the panel
  const handleOpen = () => {
    setOpen(true);
    // Mark all notifications as read when opening
    setNotifications(prev => prev.map(notif => ({ ...notif, read: true })));
    setNewCount(0);
  };
  
  // Delete a notification
  const deleteNotification = (id) => {
    setNotifications(prev => prev.filter(notif => notif.id !== id));
  };
  
  // Clear all notifications
  const clearAllNotifications = () => {
    setNotifications([]);
    setNewCount(0);
  };
  
  // Filter notifications based on active tab
  const filteredNotifications = notifications
    .filter(notif => {
      if (activeTab === 'alerts') return notif.type === 'warning' || notif.type === 'error';
      if (activeTab === 'info') return notif.type === 'info';
      if (activeTab === 'success') return notif.type === 'success';
      // "recent" tab shows all
      return true;
    })
    .sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
  
  // Get type icon
  const getTypeIcon = (type) => {
    switch (type) {
      case 'success': return <FaCheckCircle />;
      case 'warning': return <FaExclamationTriangle />;
      case 'error': return <FaTimesCircle />;
      default: return <FaInfoCircle />;
    }
  };
  
  // Format timestamp
  const formatTimestamp = (timestamp) => {
    if (!timestamp) return '';
    
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };
  
  return (
    <>
      <NotificationButton onClick={handleOpen}>
        <FaBell />
        {newCount > 0 && <NotificationCount>{newCount}</NotificationCount>}
      </NotificationButton>
      
      {open && (
        <>
          <Backdrop onClick={handleClose} />
          <CenterPanel isClosing={isClosing}>
            <PanelHeader>
              <HeaderTitle>
                <FaBell /> Notifications
              </HeaderTitle>
              <CloseButton onClick={handleClose}>
                <FaTimes />
              </CloseButton>
            </PanelHeader>
            
            <TabsContainer>
              <Tab 
                active={activeTab === 'recent'} 
                onClick={() => setActiveTab('recent')}
              >
                Recent
              </Tab>
              <Tab 
                active={activeTab === 'alerts'} 
                onClick={() => setActiveTab('alerts')}
              >
                Alerts
              </Tab>
              <Tab 
                active={activeTab === 'info'} 
                onClick={() => setActiveTab('info')}
              >
                Info
              </Tab>
              <Tab 
                active={activeTab === 'success'} 
                onClick={() => setActiveTab('success')}
              >
                Success
              </Tab>
            </TabsContainer>
            
            <NotificationList>
              {filteredNotifications.length > 0 ? (
                filteredNotifications.map(notification => (
                  <NotificationItem 
                    key={notification.id} 
                    type={notification.type}
                  >
                    <NotificationHeader>
                      <NotificationTitle>
                        <NotificationTypeIcon type={notification.type}>
                          {getTypeIcon(notification.type)}
                        </NotificationTypeIcon>
                        {notification.title}
                      </NotificationTitle>
                      <NotificationTimestamp>
                        {formatTimestamp(notification.timestamp)}
                      </NotificationTimestamp>
                    </NotificationHeader>
                    <NotificationContent>
                      {notification.content}
                    </NotificationContent>
                    <DeleteButton onClick={() => deleteNotification(notification.id)}>
                      <FaTimes />
                    </DeleteButton>
                  </NotificationItem>
                ))
              ) : (
                <EmptyState>
                  <FaRegBell />
                  <EmptyText>No notifications</EmptyText>
                  <EmptySubtext>
                    {activeTab === 'recent' 
                      ? 'You don't have any new notifications.' 
                      : `You don't have any ${activeTab} notifications.`}
                  </EmptySubtext>
                </EmptyState>
              )}
            </NotificationList>
            
            <ActionBar>
              <ActionButton 
                danger 
                onClick={clearAllNotifications}
                disabled={notifications.length === 0}
              >
                <FaTrash /> Clear All
              </ActionButton>
            </ActionBar>
          </CenterPanel>
        </>
      )}
    </>
  );
};

export default NotificationCenter;