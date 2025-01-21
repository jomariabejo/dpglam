<template>
    <div class="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center z-50">
      <div class="bg-white p-6 rounded-lg shadow-lg w-96">
        <h3 class="text-lg font-semibold text-gray-700 mb-4">Confirm Update</h3>
        <p class="text-sm text-gray-600 mb-6">Are you sure you want to update your profile?</p>
        <div class="flex justify-end space-x-4">
          <button @click="$emit('cancel')" 
                  class="py-2 px-4 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 focus:outline-none">
            Cancel
          </button>
          <button @click="$emit('confirm')" 
                  class="py-2 px-4 bg-green-500 text-white rounded-lg hover:bg-green-600 focus:outline-none">
            Confirm
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script>
  export default {
    name: 'ConfirmationModal',
  };
  </script>
  
  <style scoped>
  /* Optional custom styles for modal */
  </style>
  