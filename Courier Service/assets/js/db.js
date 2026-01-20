const CourierDB = {
    parcels: [
        { id: 'CN-1001', sender: 'Rahim Store', receiver: 'Karim Uddin', from: 'Dhaka', to: 'Chittagong', status: 'Delivered', date: '2026-01-20', amount: 1200, type: 'Regular' },
        { id: 'CN-1002', sender: 'Fashion BD', receiver: 'Ms. Salma', from: 'Dhaka', to: 'Sylhet', status: 'In Transit', date: '2026-01-21', amount: 3500, type: 'Express' },
        { id: 'CN-1003', sender: 'Tech Gadgets', receiver: 'Jamal Hossain', from: 'Dhaka', to: 'Rajshahi', status: 'Picked Up', date: '2026-01-21', amount: 15000, type: 'Fragile' },
        { id: 'CN-1004', sender: 'Organic Foods', receiver: 'Rafiqul Islam', from: 'Bogra', to: 'Dhaka', status: 'Pending', date: '2026-01-21', amount: 850, type: 'Perishable' },
        { id: 'CN-1005', sender: 'Book Worm', receiver: 'University of Dhaka', from: 'Khulna', to: 'Dhaka', status: 'Returned', date: '2026-01-19', amount: 500, type: 'Regular' }
    ],
    riders: [
        { id: 'R-01', name: 'Md. Al-Amin', zone: 'Dhaka North', active: true, assigned: 12, delivered: 450 },
        { id: 'R-02', name: 'Sujon Ahmed', zone: 'Dhaka South', active: true, assigned: 8, delivered: 320 },
        { id: 'R-03', name: 'Belal Hossain', zone: 'Chittagong Central', active: false, assigned: 0, delivered: 210 }
    ],
    merchants: [
        { id: 'M-01', name: 'Daraz BD Hub', orders: 1540, revenue: 450000 },
        { id: 'M-02', name: 'Pickaboo', orders: 850, revenue: 320000 }
    ],
    getStats: function() {
        return {
            total_parcels: this.parcels.length,
            pending: this.parcels.filter(p => p.status === 'Pending').length,
            delivered: this.parcels.filter(p => p.status === 'Delivered').length,
            transit: this.parcels.filter(p => p.status === 'In Transit').length,
            earnings: this.parcels.reduce((acc, curr) => acc + curr.amount, 0)
        };
    }
};
