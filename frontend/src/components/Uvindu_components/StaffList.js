import React, { useEffect, useState, useCallback } from "react";
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
  Check,
  Search
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
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4"
    >
      <motion.div 
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        className="bg-white rounded-xl shadow-2xl max-w-md w-full"
      >
        <div className="p-4 sm:p-6 border-b flex items-center">
          <Trash2 className="mr-3 text-red-500" size={24} />
          <h2 className="text-xl font-semibold text-gray-800">Remove Staff Member</h2>
        </div>
        
        <div className="p-4 sm:p-6 text-gray-600">
          Are you sure you want to remove <span className="font-bold text-red-500">{staffMemberName}</span> 
          from the staff? This action cannot be undone.
        </div>
        
        <div className="flex flex-col-reverse sm:flex-row sm:justify-end space-y-reverse space-y-2 sm:space-y-0 sm:space-x-3 p-4 border-t">
          <button 
            onClick={onClose}
            className="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-800 rounded-lg transition-colors flex items-center justify-center"
          >
            <X className="mr-2" size={16} /> Cancel
          </button>
          
          <button 
            onClick={onConfirm}
            className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center justify-center"
          >
            <Trash2 className="mr-2" size={16} /> Remove
          </button>
        </div>
      </motion.div>
    </motion.div>
  );
};

// Skeleton loader for table rows
const TableRowSkeleton = ({ count = 6 }) => {
  return (
    <>
      {[...Array(count)].map((_, index) => (
        <tr key={index} className="border-b">
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-8"></div>
          </td>
          <td className="p-4">
            <div className="w-12 h-12 bg-gray-200 rounded-full animate-pulse"></div>
          </td>
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-24 sm:w-32"></div>
          </td>
          <td className="p-4">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-20"></div>
          </td>
          <td className="p-4 hidden sm:table-cell">
            <div className="h-4 bg-gray-200 rounded animate-pulse w-16 sm:w-24"></div>
          </td>
          <td className="p-4 hidden sm:table-cell">
            <div className="h-5 bg-gray-200 rounded-full animate-pulse w-16"></div>
          </td>
          <td className="p-4">
            <div className="flex space-x-2 justify-center">
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
              <div className="h-8 w-8 bg-gray-200 rounded animate-pulse"></div>
            </div>
          </td>
        </tr>
      ))}
    </>
  );
};

const StaffList = () => {
  const [staff, setStaff] = useState([]);
  const [filteredStaff, setFilteredStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(6);
  const [selectedStaff, setSelectedStaff] = useState(null);
  const [showPopup, setShowPopup] = useState(false);
  const [staffToDelete, setStaffToDelete] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [isRefreshing, setIsRefreshing] = useState(false);
  const navigate = useNavigate();

  // Memoized fetch function
  const fetchStaff = useCallback(async (showRefreshing = false) => {
    if (showRefreshing) setIsRefreshing(true);
    setError("");
    
    try {
      // Simulate delay for smoother UI transitions when refreshing
      const fetchPromise = axios.get("/api/staff", {
        headers: { 'Cache-Control': 'no-cache' }
      });
      
      if (showRefreshing) {
        await Promise.all([
          fetchPromise,
          new Promise(resolve => setTimeout(resolve, 300))
        ]);
      }
      
      const response = await fetchPromise;
      setStaff(response.data);
      applyFilters(response.data, searchTerm);
    } catch (err) {
      console.error("Error fetching staff:", err);
      setError("Unable to retrieve staff information. Please try again later.");
    } finally {
      // Small delay before removing loading state for smoother transition
      setTimeout(() => {
        setLoading(false);
        setIsRefreshing(false);
      }, 300);
    }
  }, [searchTerm]);

  // Apply filters to staff data
  const applyFilters = useCallback((staffData, search) => {
    if (!search.trim()) {
      setFilteredStaff(staffData);
      return;
    }
    
    const lowercasedSearch = search.toLowerCase();
    const filtered = staffData.filter(member => 
      member.firstName.toLowerCase().includes(lowercasedSearch) ||
      member.lastName.toLowerCase().includes(lowercasedSearch) ||
      member.jobTitle.toLowerCase().includes(lowercasedSearch) ||
      member.department.toLowerCase().includes(lowercasedSearch)
    );
    
    setFilteredStaff(filtered);
    // Reset to first page when filtering
    setCurrentPage(1);
  }, []);

  // Handle search input change
  const handleSearchChange = useCallback((e) => {
    const value = e.target.value;
    setSearchTerm(value);
    applyFilters(staff, value);
  }, [staff, applyFilters]);

  // Initial data fetch
  useEffect(() => {
    const controller = new AbortController();
    
    fetchStaff();
    
    return () => {
      controller.abort();
    };
  }, [fetchStaff]);

  // Handle window resize for responsive itemsPerPage
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 640) {
        setItemsPerPage(4);
      } else if (window.innerWidth < 1024) {
        setItemsPerPage(5);
      } else {
        setItemsPerPage(6);
      }
    };
    
    handleResize(); // Set initial value
    window.addEventListener('resize', handleResize);
    
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);

  const handleDeleteConfirmation = async () => {
    if (!staffToDelete) return;

    try {
      await axios.delete(`/api/staff/${staffToDelete._id}`);
      
      // Update both staff arrays
      const updatedStaff = staff.filter(member => member._id !== staffToDelete._id);
      setStaff(updatedStaff);
      applyFilters(updatedStaff, searchTerm);
      
      setIsDeleteModalOpen(false);
      setStaffToDelete(null);
    } catch (err) {
      setError("Staff removal unsuccessful. Please try again.");
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

  // Pagination calculations
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = filteredStaff.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredStaff.length / itemsPerPage);
  
  // Generate page numbers (with ellipsis for larger page counts)
  const getPageNumbers = () => {
    const pageNumbers = [];
    if (totalPages <= 5) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
    } else {
      if (currentPage <= 3) {
        for (let i = 1; i <= 4; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      } else if (currentPage >= totalPages - 2) {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = totalPages - 3; i <= totalPages; i++) {
          pageNumbers.push(i);
        }
      } else {
        pageNumbers.push(1);
        pageNumbers.push('...');
        for (let i = currentPage - 1; i <= currentPage + 1; i++) {
          pageNumbers.push(i);
        }
        pageNumbers.push('...');
        pageNumbers.push(totalPages);
      }
    }
    return pageNumbers;
  };
  
  const handleRefresh = () => {
    fetchStaff(true);
  };
  
  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="w-full max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 rounded-2xl bg-white"
    >
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-6 gap-4">
        <div className="flex items-center space-x-4">
          <Users className="text-blue-600" size={28} />
          <h2 className="text-xl sm:text-2xl font-semibold text-gray-800">Staff Management</h2>
        </div>
        
        <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
          {/* Search Input */}
          <div className="relative flex-grow">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400" />
            </div>
            <input
              type="text"
              placeholder="Search staff..."
              value={searchTerm}
              onChange={handleSearchChange}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
          
          {/* Refresh Button */}
          <button
            onClick={handleRefresh}
            disabled={loading || isRefreshing}
            className={`px-4 py-2 rounded-lg transition-colors flex items-center justify-center gap-2
              ${isRefreshing 
                ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                : 'bg-blue-50 text-blue-600 hover:bg-blue-100'}`}
          >
            <svg 
              className={`w-4 h-4 ${isRefreshing ? 'animate-spin' : ''}`} 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
            <span className="hidden sm:inline">Refresh</span>
          </button>
        </div>
      </div>

      {error && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <XCircle className="h-5 w-5 text-red-400" />
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        </div>
      )}

      {/* Responsive Table */}
      <div className="overflow-x-auto rounded-lg shadow">
        <table className="w-full bg-white rounded-lg overflow-hidden">
          <thead className="bg-blue-50 border-b-2 border-blue-100">
            <tr>
              <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider w-12">ID</th>
              <th className="p-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-16">Profile</th>
              <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Name</th>
              <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider">Role</th>
              <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Department</th>
              <th className="p-3 text-left text-xs font-medium text-gray-600 uppercase tracking-wider hidden md:table-cell">Status</th>
              <th className="p-3 text-center text-xs font-medium text-gray-600 uppercase tracking-wider w-28">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-gray-200">
            {loading ? (
              <TableRowSkeleton count={itemsPerPage} />
            ) : filteredStaff.length === 0 ? (
              <tr>
                <td colSpan="7" className="p-6 text-center text-gray-500">
                  {searchTerm ? "No staff members match your search criteria" : "No staff members found"}
                </td>
              </tr>
            ) : (
              currentItems.map((staffMember, index) => (
                <motion.tr 
                  key={staffMember._id}
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ delay: index * 0.05 }}
                  className="hover:bg-blue-50 transition-colors duration-200"
                >
                  <td className="p-3 text-sm text-gray-700">{indexOfFirstItem + index + 1}</td>
                  <td className="p-3 flex justify-center">
                    {staffMember.profilePic ? (
                      <img
                        src={`/uploads/${staffMember.profilePic}`}
                        alt="Profile"
                        className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
                      />
                    ) : (
                      <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center text-blue-500 text-xs">
                        {staffMember.firstName.charAt(0)}{staffMember.lastName.charAt(0)}
                      </div>
                    )}
                  </td>
                  <td className="p-3 text-sm text-gray-700">
                    <div className="font-medium">{staffMember.firstName} {staffMember.lastName}</div>
                    <div className="text-xs text-gray-500 md:hidden">{staffMember.jobTitle}</div>
                    <div className="text-xs text-gray-500 md:hidden">
                      {renderStatusBadge(staffMember.status)}
                    </div>
                  </td>
                  <td className="p-3 text-sm text-gray-700 hidden sm:table-cell">{staffMember.jobTitle}</td>
                  <td className="p-3 text-sm text-gray-700 hidden md:table-cell">{staffMember.department}</td>
                  <td className="p-3 text-center md:text-left hidden md:table-cell">{renderStatusBadge(staffMember.status)}</td>
                  <td className="p-3">
                    <div className="flex items-center justify-center space-x-1 sm:space-x-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleView(staffMember)}
                        className="p-1.5 sm:p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                        aria-label="View details"
                      >
                        <Eye size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleUpdate(staffMember._id)}
                        className="p-1.5 sm:p-2 bg-amber-500 text-white rounded-md hover:bg-amber-600 transition-colors"
                        aria-label="Edit staff"
                      >
                        <Edit size={16} />
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => initiateStaffRemoval(staffMember)}
                        className="p-1.5 sm:p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                        aria-label="Remove staff"
                      >
                        <Trash2 size={16} />
                      </motion.button>
                    </div>
                  </td>
                </motion.tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination - Only show if we have data and not loading */}
      {!loading && filteredStaff.length > 0 && (
        <div className="flex flex-wrap items-center justify-center mt-6 gap-2">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
            disabled={currentPage === 1}
            className="p-2 bg-blue-100 text-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Previous page"
          >
            <ChevronLeft size={18} />
          </motion.button>

          {getPageNumbers().map((number, index) => (
            number === '...' ? (
              <span key={`ellipsis-${index}`} className="px-2">...</span>
            ) : (
              <motion.button
                key={number}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setCurrentPage(number)}
                className={`w-8 h-8 flex items-center justify-center rounded-md transition-colors ${
                  currentPage === number 
                    ? "bg-blue-600 text-white" 
                    : "bg-blue-100 text-blue-600 hover:bg-blue-200"
                }`}
              >
                {number}
              </motion.button>
            )
          ))}

          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
            disabled={currentPage === totalPages}
            className="p-2 bg-blue-100 text-blue-700 rounded-md disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center"
            aria-label="Next page"
          >
            <ChevronRight size={18} />
          </motion.button>
        </div>
      )}

      {/* Staff Removal Confirmation Modal with AnimatePresence */}
      <AnimatePresence>
        {isDeleteModalOpen && (
          <StaffRemovalConfirmation
            isOpen={isDeleteModalOpen}
            onClose={() => {
              setIsDeleteModalOpen(false);
              setStaffToDelete(null);
            }}
            onConfirm={handleDeleteConfirmation}
            staffMemberName={staffToDelete ? `${staffToDelete.firstName} ${staffToDelete.lastName}` : ''}
          />
        )}
      </AnimatePresence>

      {/* Staff Details Popup */}
      <AnimatePresence>
        {showPopup && (
          <StaffPopup 
            selectedStaff={selectedStaff} 
            showPopup={showPopup} 
            handleClosePopup={handleClosePopup} 
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default StaffList;