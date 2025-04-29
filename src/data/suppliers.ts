
import { Supplier } from '@/types';

export const supplierData: Supplier[] = [
  {
    id: '1',
    name: 'TechSupply Inc.',
    contactName: 'John Smith',
    email: 'john.smith@techsupply.com',
    phone: '555-123-4567',
    address: '123 Tech Avenue, San Francisco, CA 94107',
    products: ['1', '2', '7', '9'] // IDs of products from this supplier
  },
  {
    id: '2',
    name: 'Beverage Distributors',
    contactName: 'Sarah Johnson',
    email: 'sarah@beveragedistributors.com',
    phone: '555-987-6543',
    address: '456 Drink Street, Seattle, WA 98101',
    products: ['3', '11', '15']
  },
  {
    id: '3',
    name: 'Office Solutions Co.',
    contactName: 'Michael Brown',
    email: 'michael@officesolutions.com',
    phone: '555-456-7890',
    address: '789 Paper Road, Chicago, IL 60601',
    products: ['4', '8', '12']
  },
  {
    id: '4',
    name: 'Fashion Wholesale Ltd.',
    contactName: 'Emma Wilson',
    email: 'emma@fashionwholesale.com',
    phone: '555-234-5678',
    address: '101 Style Blvd, New York, NY 10001',
    products: ['5', '10', '14']
  },
  {
    id: '5',
    name: 'Global Foods Supply',
    contactName: 'David Lee',
    email: 'david@globalfoods.com',
    phone: '555-876-5432',
    address: '202 Taste Street, Austin, TX 78701',
    products: ['6', '13', '16']
  }
];
