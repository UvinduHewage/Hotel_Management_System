import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Swal from 'sweetalert2';

const AllBillsPage = () => {
  const [bills, setBills] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingBill, setEditingBill] = useState(null);

  const fetchBills = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/bills');
      setBills(res.data);
    } catch (err) {
      Swal.fire('Error', 'Failed to fetch bills', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBills();
  }, []);

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Are you sure?',
      text: 'This bill will be permanently deleted.',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#aaa',
      confirmButtonText: 'Yes, delete it!',
    });

    if (!confirm.isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5000/api/bills/${id}`);
      fetchBills();
      Swal.fire('Deleted!', 'The bill has been deleted.', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to delete bill.', 'error');
    }
  };

  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditingBill((prev) => ({ ...prev, [name]: value }));
  };

  const handleEditSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/bills/${editingBill._id}`, editingBill);
      setEditingBill(null);
      fetchBills();
      Swal.fire('Success', 'Bill updated successfully!', 'success');
    } catch (err) {
      Swal.fire('Error', 'Failed to update bill.', 'error');
    }
  };

  if (loading) return <p className="text-center py-10">Loading bills...</p>;
  if (bills.length === 0) return <p className="text-center py-10">No bills found.</p>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <h2 className="text-3xl font-bold text-center mb-8">All Customer Bills</h2>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {bills.map((bill) => (
          <div key={bill._id} className="bg-white shadow rounded-lg p-4 border flex flex-col justify-between">
            <div>
              <h3 className="font-bold text-lg mb-1">{bill.firstName} {bill.lastName}</h3>
              <p className="text-sm text-gray-700">{bill.email} | {bill.phone}</p>
              <p className="text-sm text-gray-600">Check-in: {new Date(bill.checkInDate).toLocaleDateString()}</p>
              <p className="text-sm text-gray-600">Check-out: {new Date(bill.checkOutDate).toLocaleDateString()}</p>
              <hr className="my-2" />
              <div className="text-sm space-y-1">
                <p><strong>Room:</strong> {bill.roomName}</p>
                <p><strong>Room Rate:</strong> ${bill.roomRate}</p>
                <p><strong>Taxes:</strong> ${bill.taxes}</p>
                <p><strong>Resort Fee:</strong> ${bill.resortFee}</p>
                <p className="font-semibold text-right border-t pt-2">Total: ${bill.totalCost}</p>
              </div>
            </div>
            <div className="mt-4 flex gap-2">
              <button onClick={() => setEditingBill(bill)} className="bg-yellow-500 text-white px-3 py-1 rounded hover:bg-yellow-600">Edit</button>
              <button onClick={() => handleDelete(bill._id)} className="bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700">Delete</button>
            </div>
          </div>
        ))}
      </div>

      {editingBill && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex items-center justify-center z-50">
          <div className="bg-white w-full max-w-lg rounded-lg p-6 shadow-lg space-y-4">
            <h3 className="text-xl font-bold mb-4">Edit Bill</h3>

            <div className="grid grid-cols-2 gap-4">
              <input name="firstName" value={editingBill.firstName} onChange={handleEditChange} placeholder="First Name" className="p-2 border rounded" />
              <input name="lastName" value={editingBill.lastName} onChange={handleEditChange} placeholder="Last Name" className="p-2 border rounded" />
            </div>

            <input name="email" value={editingBill.email} onChange={handleEditChange} placeholder="Email" className="w-full p-2 border rounded" />
            <input name="phone" value={editingBill.phone} onChange={handleEditChange} placeholder="Phone" className="w-full p-2 border rounded" />

            <div className="grid grid-cols-2 gap-4">
              <input name="checkInDate" type="date" value={editingBill.checkInDate?.slice(0, 10)} onChange={handleEditChange} className="p-2 border rounded" />
              <input name="checkOutDate" type="date" value={editingBill.checkOutDate?.slice(0, 10)} onChange={handleEditChange} className="p-2 border rounded" />
            </div>

            <input name="roomName" value={editingBill.roomName} onChange={handleEditChange} placeholder="Room Name" className="w-full p-2 border rounded" />
            <input name="roomRate" type="number" value={editingBill.roomRate} onChange={handleEditChange} placeholder="Room Rate" className="w-full p-2 border rounded" />
            <input name="taxes" type="number" value={editingBill.taxes} onChange={handleEditChange} placeholder="Taxes" className="w-full p-2 border rounded" />
            <input name="resortFee" type="number" value={editingBill.resortFee} onChange={handleEditChange} placeholder="Resort Fee" className="w-full p-2 border rounded" />
            <input name="totalCost" type="number" value={editingBill.totalCost} onChange={handleEditChange} placeholder="Total Cost" className="w-full p-2 border rounded" />

            <div className="flex justify-end gap-3">
              <button onClick={() => setEditingBill(null)} className="px-4 py-2 border rounded hover:bg-gray-100">Cancel</button>
              <button onClick={handleEditSubmit} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700">Update</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AllBillsPage;
