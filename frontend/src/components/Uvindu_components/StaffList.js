import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Edit, 
  Trash2, 
  Eye, 
  ChevronLeft, 
  ChevronRight,
  CheckCircle2,
  XCircle,
  X,
  Check
} from "lucide-react";
import StaffPopup from './StaffPopup';

// Staff Removal Confirmation Component
const StaffRemovalConfirmation = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  staffMemberName 
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full">
        <div className="p-6 border-b flex items-center">
          <Trash2 className="mr-3 text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Remove Staff Member</h2>
        </div>
        
        <div className="p-6 text-gray-600">
          Are you sure you want to remove <span className="font-bold text-red-500"> {staffMemberName} </span> 
          from the staff ? This action cannot be undone.
        </div>
        
        <div className="flex justify-end space-x-3 p-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-green-700 hover:bg-green-500 text-white rounded-xl transition"
          >
            <X className="mr-2 inline-block" size={16} /> Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-xl transition"
          >
            <Check className="mr-2 inline-block" size={16} /> Confirm Removal
          </button>
        </div>
      </div>
    </div>
  );
};

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage] = useState(6);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStaff = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/staff");
        setStaff(response.data);
      } catch (err) {
        setError("Unable to retrieve staff information");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchStaff();
  }, []);

  const handleDeleteConfirmation = async () => {
    if (!staffToDelete) return;

    try {
      await axios.delete(`http://localhost:5000/api/staff/${staffToDelete._id}`);
      setStaff(staff.filter((staffMember) => staffMember._id !== staffToDelete._id));
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
    } catch (err) {
      setError("Staff removal unsuccessful");
      console.error(err);
    }
  };

  const initiateStaffRemoval = (staffMember) => {
    setStaffToDelete(staffMember);
    setIsDeleteModalOpen(true);
  };

  const handleUpdate = (id) => {
    navigate(`/staff/update/${id}`);
  };

  const handleView = (staffMember) => {
    setSelectedStaff(staffMember);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };
  
  const renderStatusBadge = (status) => (
    <div className={`inline-flex items-center text-xs font-medium px-2.5 py-0.5 rounded-full ${
      status === "Active" 
        ? "bg-emerald-100 text-emerald-800" 
        : "bg-rose-100 text-rose-800"
    }`}>
      {status === "Active" ? (
        <CheckCircle2 className="mr-1.5 w-3 h-3 text-emerald-500" />
      ) : (
        <XCircle className="mr-1.5 w-3 h-3 text-rose-500" />
      )}
      {status}
    </div>
  );  

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentStaff = staff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(staff.length / itemsPerPage);
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-8 bg-white shadow-2xl rounded-2xl"
    >
      <div className="flex items-center mb-8 space-x-4">
        <Users className="text-blue-600" size={36} />
        <h2 className="text-2xl font-semibold text-gray-800">Staff Management</h2>
      </div>

      {loading ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center items-center h-64"
        >
          <div className="animate-spin w-12 h-12 border-4 border-blue-500 border-t-transparent rounded-full"></div>
        </motion.div>
      ) : error ? (
        <div className="text-center text-red-500 py-6">{error}</div>
      ) : (
        <AnimatePresence>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-x-auto"
          >
            <table className="w-full bg-white rounded-lg overflow-hidden shadow-md">
              <thead className="bg-blue-50 border-b-2 border-blue-200">
                <tr>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">ID</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Profile</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Name</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Role</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Department</th>
                  <th className="p-4 text-left text-sm font-medium text-gray-600">Status</th>
                  <th className="p-4 text-center text-sm font-medium text-gray-600">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentStaff.map((staffMember, index) => (
                  <motion.tr 
                    key={staffMember._id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="hover:bg-blue-50 transition-colors duration-200 border-b"
                  >
                    <td className="p-4">{indexOfFirstItem + index + 1}</td>
                    <td className="p-4">
                      {staffMember.profilePic ? (
                        <img
                          src={`http://localhost:5000/uploads/${staffMember.profilePic}`}
                          alt="Profile"
                          className="w-12 h-12 rounded-full object-cover border-2 border-blue-200"
                        />
                      ) : (
                        <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center text-blue-500">
                          N/A
                        </div>
                      )}
                    </td>
                    <td className="p-4">{staffMember.firstName} {staffMember.lastName}</td>
                    <td className="p-4">{staffMember.jobTitle}</td>
                    <td className="p-4">{staffMember.department}</td>
                    <td className="p-4">{renderStatusBadge(staffMember.status)}</td>
                    <td className="p-4">
                      <div className="flex space-x-2 justify-center">
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleUpdate(staffMember._id)}
                          className="p-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition"
                        >
                          <Edit size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => initiateStaffRemoval(staffMember)}
                          className="p-2 bg-red-500 text-white rounded hover:bg-red-600 transition"
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        <motion.button
                          whileHover={{ scale: 1.05 }}
                          whileTap={{ scale: 0.95 }}
                          onClick={() => handleView(staffMember)}
                          className="p-2 bg-green-500 text-white rounded hover:bg-green-600 transition"
                        >
                          <Eye size={16} />
                        </motion.button>
                      </div>
                    </td>
                  </motion.tr>
                ))}
              </tbody>
            </table>
          </motion.div>
        </AnimatePresence>
      )}

      {/* Pagination */}
      <div className="flex justify-center mt-6 space-x-2">
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(currentPage > 1 ? currentPage - 1 : 1)}
          disabled={currentPage === 1}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50 flex items-center"
        >
          <ChevronLeft size={20} />
        </motion.button>

        {[...Array(totalPages)].map((_, index) => (
          <motion.button
            key={index}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(index + 1)}
            className={`px-4 py-2 rounded transition-colors 
              ${currentPage === index + 1 
                ? "bg-blue-600 text-white" 
                : "bg-blue-100 text-blue-600 hover:bg-blue-200"}`}
          >
            {index + 1}
          </motion.button>
        ))}

        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setCurrentPage(currentPage < totalPages ? currentPage + 1 : totalPages)}
          disabled={currentPage === totalPages}
          className="p-2 bg-blue-500 text-white rounded disabled:opacity-50 flex items-center"
        >
          <ChevronRight size={20} />
        </motion.button>
      </div>

      {/* Staff Removal Confirmation Modal */}
      <StaffRemovalConfirmation
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setStaffToDelete(null);
        }}
        onConfirm={handleDeleteConfirmation}
        staffMemberName={`${staffToDelete?.firstName} ${staffToDelete?.lastName}`}
      />

      {/* Popup */}
      <StaffPopup 
        selectedStaff={selectedStaff} 
        showPopup={showPopup} 
        handleClosePopup={handleClosePopup} 
      />
    </motion.div>
  );
};

export default StaffList;