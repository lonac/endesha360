import React from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useSchoolManagement } from '../hooks/useSchoolManagement';

// Components
import AdminLayout from '../components/AdminLayout';
import Button from '../components/Button';
import Alert from '../components/Alert';
import Modal from '../components/Modal';
import SchoolView from '../components/SchoolView';
import SchoolStatistics from '../components/SchoolStatistics';
import SchoolFilters from '../components/SchoolFilters';
import SchoolTable from '../components/SchoolTable';
import Pagination from '../components/Pagination';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import SchoolFormComponent from '../components/SchoolFormComponent';

const SchoolManagement = () => {
  const navigate = useNavigate();
  const {
    // State
    schools,
    totalSchools,
    currentPage,
    pageSize,
    isLoading,
    searchTerm,
    selectedStatus,
    selectedLocation,
    sortBy,
    statistics,
    showCreateModal,
    showEditModal,
    showViewModal,
    showDeleteModal,
    selectedSchool,
    schoolForm,
    alert,
    totalPages,

    // Setters
    setCurrentPage,
    setPageSize,
    setSearchTerm,
    setSelectedStatus,
    setSelectedLocation,
    setSortBy,
    setSchoolForm,
    setAlert,
    setShowCreateModal,
    setShowEditModal,
    setShowViewModal,

    // Actions
    clearFilters,
    openCreateModal,
    openEditModal,
    openViewModal,
    openDeleteModal,
    closeDeleteModal,
    handleCreateSchool,
    handleUpdateSchool,
    handleApproveSchool,
    handleRejectSchool,
    handleDeleteSchool,
    loadSchools
  } = useSchoolManagement();

  return (
    <AdminLayout>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Page Header */}
        <div className="mb-6">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-4">
            <div>
              <h2 className="text-xl sm:text-2xl font-bold text-[#00712D]">School Management</h2>
              <p className="text-gray-600 mt-1 text-sm sm:text-base">Manage driving school registrations and approvals</p>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="primary"
                onClick={openCreateModal}
                className="flex items-center space-x-2 w-full sm:w-auto justify-center"
              >
                <Plus className="h-4 w-4" />
                <span className="hidden xs:inline">Add School</span>
                <span className="xs:hidden">Add</span>
              </Button>
            </div>
          </div>
        </div>

        {/* Alert */}
        {alert.show && (
          <Alert
            {...alert}
            onClose={() => setAlert({ ...alert, show: false })}
            onRetry={alert.retryable ? () => loadSchools() : undefined}
            className="mb-6"
          />
        )}

        {/* Statistics Cards */}
        <SchoolStatistics statistics={statistics} totalSchools={totalSchools} />

        {/* Filters and Search */}
        <SchoolFilters
          searchTerm={searchTerm}
          setSearchTerm={setSearchTerm}
          selectedStatus={selectedStatus}
          setSelectedStatus={setSelectedStatus}
          selectedLocation={selectedLocation}
          setSelectedLocation={setSelectedLocation}
          sortBy={sortBy}
          setSortBy={setSortBy}
          isLoading={isLoading}
          totalSchools={totalSchools}
          onClearFilters={clearFilters}
        />

        {/* Schools Table */}
        <SchoolTable
          schools={schools}
          totalSchools={totalSchools}
          isLoading={isLoading}
          onView={openViewModal}
          onEdit={openEditModal}
          onApprove={handleApproveSchool}
          onReject={handleRejectSchool}
          onDelete={openDeleteModal}
        />

        {/* Pagination */}
        <Pagination
          currentPage={currentPage}
          totalPages={totalPages}
          pageSize={pageSize}
          onPageChange={setCurrentPage}
          onPageSizeChange={setPageSize}
        />

        {/* Create School Modal */}
        {showCreateModal && (
          <Modal
            isOpen={showCreateModal}
            onClose={() => setShowCreateModal(false)}
            title="Create New School"
            className="max-w-2xl"
          >
            <SchoolFormComponent
              schoolForm={schoolForm}
              setSchoolForm={setSchoolForm}
              onSubmit={handleCreateSchool}
              onCancel={() => setShowCreateModal(false)}
              submitLabel="Create School"
            />
          </Modal>
        )}

        {/* Edit School Modal */}
        {showEditModal && (
          <Modal
            isOpen={showEditModal}
            onClose={() => setShowEditModal(false)}
            title="Edit School"
            className="max-w-2xl"
          >
            <SchoolFormComponent
              schoolForm={schoolForm}
              setSchoolForm={setSchoolForm}
              onSubmit={handleUpdateSchool}
              onCancel={() => setShowEditModal(false)}
              submitLabel="Update School"
            />
          </Modal>
        )}

        {/* View School Modal */}
        {showViewModal && selectedSchool && (
          <Modal
            isOpen={showViewModal}
            onClose={() => setShowViewModal(false)}
            title="School Details"
          >
            <SchoolView school={selectedSchool} />
          </Modal>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={showDeleteModal}
          onClose={closeDeleteModal}
          onConfirm={handleDeleteSchool}
        />
      </div>
    </AdminLayout>
  );
};

export default SchoolManagement;
