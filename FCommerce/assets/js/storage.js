/**
 * FCommerce LocalStorage Manager - Rich Demo Data
 */
const StorageManager = {
    DB_NAME: 'fcommerce_db_v2',

    init() {
        if (!localStorage.getItem(this.DB_NAME)) {
            const initialData = {
                users: [
                    { id: 1, name: 'Mehedi Hasan', email: 'admin@demo.com', role: 'Administrator', avatar: 'https://i.pravatar.cc/150?u=mehedi' },
                    { id: 2, name: 'John Seller', email: 'seller@demo.com', role: 'Store Manager', avatar: 'https://i.pravatar.cc/150?u=john' },
                    { id: 3, name: 'Sarah Analyst', email: 'manager@demo.com', role: 'Marketing Lead', avatar: 'https://i.pravatar.cc/150?u=sarah' }
                ],
                session: null,
                orders: [
                    { id: 'ORD-991', customer: 'Alex Rivera', product: 'iPhone 15 Pro', amount: 999.00, status: 'Delivered', date: '2023-10-25' },
                    { id: 'ORD-992', customer: 'Maria Garcia', product: 'MacBook Air M2', amount: 1200.00, status: 'Pending', date: '2023-10-26' },
                    { id: 'ORD-993', customer: 'James Wilson', product: 'Sony WH-1000XM5', amount: 350.00, status: 'Confirmed', date: '2023-10-26' },
                    { id: 'ORD-994', customer: 'Emma Watson', product: 'Apple Watch S9', amount: 399.00, status: 'Processing', date: '2023-10-27' },
                    { id: 'ORD-995', customer: 'Robert Fox', product: 'iPad Pro M2', amount: 799.00, status: 'Delivered', date: '2023-10-27' }
                ],
                customers: [
                    { id: 1, name: 'Alex Rivera', email: 'alex@example.com', phone: '+1 (555) 123-4567', totalSpent: 4500, orders: 8, location: 'New York, USA' },
                    { id: 2, name: 'Maria Garcia', email: 'maria@example.com', phone: '+1 (555) 987-6543', totalSpent: 1200, orders: 1, location: 'Madrid, Spain' },
                    { id: 3, name: 'James Wilson', email: 'james@example.com', phone: '+1 (555) 112-2334', totalSpent: 2350, orders: 4, location: 'London, UK' },
                    { id: 4, name: 'Emma Watson', email: 'emma@example.com', phone: '+1 (555) 443-2211', totalSpent: 890, orders: 2, location: 'Paris, France' }
                ],
                products: [
                    { id: 1, name: 'iPhone 15 Pro', category: 'Electronics', price: 999.00, stock: 8, image: 'https://images.unsplash.com/photo-1696446701796-da61225697cc?w=300' },
                    { id: 2, name: 'MacBook Air M2', category: 'Computing', price: 1199.00, stock: 15, image: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=300' },
                    { id: 3, name: 'Sony WH-1000XM5', category: 'Audio', price: 348.00, stock: 22, image: 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=300' },
                    { id: 4, name: 'Apple Watch S9', category: 'Wearables', price: 399.00, stock: 4, image: 'https://images.unsplash.com/photo-1546868871-70c122469d8b?w=300' },
                    { id: 5, name: 'iPad Pro M2', category: 'Computing', price: 799.00, stock: 12, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=300' }
                ],
                chats: [
                    { id: 1, customerName: 'Alex Rivera', lastMessage: 'Is my order shipped?', time: '10:30 AM', avatar: 'https://i.pravatar.cc/150?u=1', messages: [
                        { sender: 'customer', text: 'Hello, is my order #ORD-991 shipped?', time: '10:25 AM' },
                        { sender: 'bot', text: 'Hi Alex! Checking that for you now...', time: '10:26 AM' },
                        { sender: 'bot', text: 'Yes! It was delivered yesterday at 2:00 PM.', time: '10:26 AM' }
                    ]},
                    { id: 2, customerName: 'Maria Garcia', lastMessage: 'Thank you for the help!', time: 'Yesterday', avatar: 'https://i.pravatar.cc/150?u=2', messages: [
                        { sender: 'customer', text: 'I need help with my payment.', time: 'Yesterday' },
                        { sender: 'bot', text: 'Sure, what seems to be the issue?', time: 'Yesterday' }
                    ]}
                ],
                campaigns: [
                    { id: 1, name: 'Black Friday 2023', platform: 'Facebook', budget: 5000, status: 'Active', reach: '125k', clicks: 4200, roas: '4.2x' },
                    { id: 2, name: 'Influencer Collab', platform: 'Instagram', budget: 2000, status: 'Paused', reach: '45k', clicks: 1800, roas: '3.1x' },
                    { id: 3, name: 'Google Search Ads', platform: 'Google', budget: 1500, status: 'Active', reach: '12k', clicks: 950, roas: '5.5x' }
                ]
            };
            localStorage.setItem(this.DB_NAME, JSON.stringify(initialData));
        }
    },

    getData() { return JSON.parse(localStorage.getItem(this.DB_NAME)); },
    saveData(data) { localStorage.setItem(this.DB_NAME, JSON.stringify(data)); },

    login(email) {
        const data = this.getData();
        const user = data.users.find(u => u.email === email);
        if (user) { data.session = user; this.saveData(data); return user; }
        return null;
    },

    logout() {
        const data = this.getData();
        data.session = null;
        this.saveData(data);
        window.location.href = 'index.html';
    },

    getSession() { return this.getData().session; },
    getCollection(key) { return this.getData()[key] || []; },
    addToCollection(key, item) {
        const data = this.getData();
        data[key].unshift(item); // Add to beginning
        this.saveData(data);
    },
    updateInCollection(key, id, updates) {
        const data = this.getData();
        const index = data[key].findIndex(i => i.id === id);
        if (index !== -1) { data[key][index] = { ...data[key][index], ...updates }; this.saveData(data); }
    }
};

StorageManager.init();
