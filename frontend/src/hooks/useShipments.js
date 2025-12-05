import { useState, useEffect } from 'react';
import { shipmentsStore } from '../store/shipmentsStore';

export function useShipments() {
  const [shipments, setShipments] = useState(shipmentsStore.getAllShipments());
  const [importExportRules, setImportExportRules] = useState(shipmentsStore.getImportExportRules());

  useEffect(() => {
    const unsubscribe = shipmentsStore.subscribe(() => {
      setShipments(shipmentsStore.getAllShipments());
      setImportExportRules(shipmentsStore.getImportExportRules());
    });

    return unsubscribe;
  }, []);

  return {
    shipments,
    importExportRules,
    // Shipment operations
    getShipmentById: (id) => shipmentsStore.getShipmentById(id),
    saveShipment: (shipment) => shipmentsStore.saveShipment(shipment),
    updateShipmentStatus: (id, status) => shipmentsStore.updateShipmentStatus(id, status),
    updateAIApproval: (id, approval, aiResults, score) => 
      shipmentsStore.updateAIApproval(id, approval, aiResults, score),
    requestBrokerApproval: (id) => shipmentsStore.requestBrokerApproval(id),
    brokerApprove: (id, notes) => shipmentsStore.brokerApprove(id, notes),
    brokerDeny: (id, reason) => shipmentsStore.brokerDeny(id, reason),
    brokerRequestDocuments: (id, docs, message) => 
      shipmentsStore.brokerRequestDocuments(id, docs, message),
    uploadDocument: (shipmentId, docName, docType) => 
      shipmentsStore.uploadDocument(shipmentId, docName, docType),
    bookShipment: (id, bookingDate, estimatedDelivery, amount) => 
      shipmentsStore.bookShipment(id, bookingDate, estimatedDelivery, amount),
    completePayment: (id) => shipmentsStore.completePayment(id),
    // Rules operations
    addImportExportRule: (rule) => shipmentsStore.addImportExportRule(rule),
    updateImportExportRule: (id, rule) => shipmentsStore.updateImportExportRule(id, rule),
    deleteImportExportRule: (id) => shipmentsStore.deleteImportExportRule(id),
  };
}

export function useShipment(id) {
  const [shipment, setShipment] = useState(
    id ? shipmentsStore.getShipmentById(id) : undefined
  );

  useEffect(() => {
    const unsubscribe = shipmentsStore.subscribe(() => {
      if (id) {
        setShipment(shipmentsStore.getShipmentById(id));
      }
    });

    return unsubscribe;
  }, [id]);

  return shipment;
}

export function useMessages(shipmentId) {
  const [messages, setMessages] = useState(
    shipmentsStore.getMessages(shipmentId)
  );

  useEffect(() => {
    const unsubscribe = shipmentsStore.subscribe(() => {
      setMessages(shipmentsStore.getMessages(shipmentId));
    });

    return unsubscribe;
  }, [shipmentId]);

  return messages;
}

export function useNotifications(role) {
  const [notifications, setNotifications] = useState(
    shipmentsStore.getNotifications(role)
  );

  useEffect(() => {
    const unsubscribe = shipmentsStore.subscribe(() => {
      setNotifications(shipmentsStore.getNotifications(role));
    });

    return unsubscribe;
  }, [role]);

  return {
    notifications,
    addNotification: (notification) => shipmentsStore.addNotification(notification)
  };
}

