
import { Supplier, ProductReference } from '@/types';

export const supplierData: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply Inc.',
    contactName: 'John Smith',
    email: 'john.smith@techsupply.com',
    phone: '555-123-4567',
    address: '123 Tech Avenue, San Francisco, CA 94107',
    products: [
      { id: '1', name: 'Premium Coffee' },
      { id: '2', name: 'Wireless Earbuds' },
      { id: '7', name: 'Bluetooth Speaker' },
      { id: '9', name: 'Desk Lamp' }
    ]
  },
  {
    id: '2',
    name: 'Beverage Distributors',
    contactName: 'Sarah Johnson',
    email: 'sarah@beveragedistributors.com',
    phone: '555-987-6543',
    address: '456 Drink Street, Seattle, WA 98101',
    products: [
      { id: '3', name: 'Fitness Tracker' },
      { id: '11', name: 'Yoga Mat' },
      { id: '15', name: 'Drone Camera' }
    ]
  },
  {
    id: '3',
    name: 'Office Solutions Co.',
    contactName: 'Michael Brown',
    email: 'michael@officesolutions.com',
    phone: '555-456-7890',
    address: '789 Paper Road, Chicago, IL 60601',
    products: [
      { id: '4', name: 'Smart Notebook' },
      { id: '8', name: 'Organic Tea Set' },
      { id: '12', name: 'Scented Candle' }
    ]
  },
  {
    id: '4',
    name: 'Fashion Wholesale Ltd.',
    contactName: 'Emma Wilson',
    email: 'emma@fashionwholesale.com',
    phone: '555-234-5678',
    address: '101 Style Blvd, New York, NY 10001',
    products: [
      { id: '5', name: 'Portable Charger' },
      { id: '10', name: 'Mechanical Keyboard' },
      { id: '14', name: 'Ceramic Mug Set' }
    ]
  },
  {
    id: '5',
    name: 'Global Foods Supply',
    contactName: 'David Lee',
    email: 'david@globalfoods.com',
    phone: '555-876-5432',
    address: '202 Taste Street, Austin, TX 78701',
    products: [
      { id: '6', name: 'Water Bottle' },
      { id: '13', name: 'Leather Wallet' },
      { id: '16', name: 'Succulent Plant Set' }
    ]
  }
];
