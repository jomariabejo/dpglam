<template>
    <v-container>
      <!-- Page Header -->
      <v-row align="center" justify="space-between" class="mb-4">
        <v-col cols="12" sm="6">
          <h1 class="text-h4 font-weight-bold">Admin Transactions</h1>
          <p class="text-body-2">Manage transactions and view daily records.</p>
        </v-col>
      </v-row>
  
      <!-- Action Buttons -->
      <v-row class="mb-4">
        <v-col cols="12" sm="4" md="3">
          <v-btn block color="blue-darken-2" @click="fetchTransactions">
            <v-icon left>mdi-refresh</v-icon> Load Today's Transactions
          </v-btn>
        </v-col>
        <v-col cols="12" sm="4" md="3">
            <v-menu v-model="datePicker" transition="scale-transition">
                <template v-slot:activator="{ props }">
                <v-btn v-bind="props" block color="blue-darken-2">
                <v-icon left>mdi-calendar</v-icon> 
                {{ selectedDateDisplay }}
                </v-btn>
            </template>
                <v-date-picker 
                v-model="selectedDate" 
                @update:modelValue="handleDateChange"
                ></v-date-picker>
            </v-menu>
        </v-col>
        <v-col cols="12" sm="4" md="3">
            <v-btn block color="green-darken-2" @click="openAddModal">
            <v-icon left>mdi-plus</v-icon> Add New Transaction
            </v-btn>
        </v-col>
      </v-row>

          <!-- Add New Transaction Modal -->
        <v-dialog v-model="showAddForm" max-width="500px">
        <v-card>
            <v-card-title>Add New Transaction</v-card-title>
            <v-card-text>
            <v-text-field v-model.number="newTransaction.molinoCost" label="Molino Cost" type="number"></v-text-field>
            <v-text-field v-model.number="newTransaction.pricePerKG" label="Price per KG" type="number"></v-text-field>
            <v-text-field v-model.number="newTransaction.quantityKG" label="Quantity (KG)" type="number"></v-text-field>
            <v-text-field v-model.number="newTransaction.otherFees" label="Other Fees" type="number"></v-text-field>
            <v-text-field v-model.number="newTransaction.change" label="Change" type="number"></v-text-field>
            <v-text-field v-model="newTransaction.notes" label="Notes"></v-text-field>
            <v-text-field 
              :model-value="calculatedTotalCost" 
              label="Total Cost" 
              readonly
              hint="Automatically calculated"
            ></v-text-field>
            </v-card-text>
            <v-card-actions>
            <v-btn color="green" @click="addTransaction">Save</v-btn>
            <v-btn color="gray" @click="closeAddModal">Cancel</v-btn>
            </v-card-actions>
        </v-card>
        </v-dialog>
  
      <!-- Transactions Table -->
      <v-table class="mt-4 elevation-2">
        <thead class="bg-grey-lighten-3">
          <tr>
            <th class="text-left">Date</th>
            <th class="text-left">Molino Cost</th>
            <th class="text-left">Price per KG</th>
            <th class="text-left">Quantity (KG)</th>
            <th class="text-left">Total Cost</th>
            <th class="text-left">Other Fees</th>
            <th class="text-left">Change</th>
            <th class="text-left">Notes</th>
            <th class="text-center">Actions</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="transaction in transactions" :key="transaction._id">
            <td>{{ formatDate(transaction.createdAt) }}</td>
            <td>{{ transaction.molinoCost }}</td>
            <td>{{ transaction.pricePerKG }}</td>
            <td>{{ transaction.quantityKG }}</td>
            <td>{{ transaction.totalCost }}</td>
            <td>{{ transaction.otherFees }}</td>
            <td>{{ transaction.change }}</td>
            <td>{{ transaction.notes || 'N/A' }}</td>
            <td class="text-center">
              <v-btn icon color="blue" density="compact" @click="openEditModal(transaction)">
                <v-icon size="22">mdi-pencil</v-icon>
              </v-btn>
              <v-btn icon color="red" density="compact" @click="deleteTransaction(transaction._id)">
                <v-icon size="22">mdi-delete</v-icon>
              </v-btn>
            </td>
          </tr>
        </tbody>
      </v-table>
  
      <!-- No Transactions Message -->
      <v-alert v-if="transactions.length === 0" type="info" class="mt-4">
        No transactions found for {{ selectedDate || 'today' }}.
      </v-alert>
  
      <!-- Edit Transaction Modal -->
      <v-dialog v-model="showEditForm" max-width="500px">
        <v-card>
          <v-card-title>Edit Transaction</v-card-title>
          <v-card-text>
            <v-text-field v-model="selectedTransaction.customerId" label="Customer Id" type="String"></v-text-field>
            <v-text-field v-model="selectedTransaction.molinoCost" label="Molino Cost" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.pricePerKG" label="Price Per KG" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.quantityKG" label="Quantity" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.totalCost" label="Total Cost" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.otherFees" label="Other Fees" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.change" label="Change" type="number"></v-text-field>
            <v-text-field v-model="selectedTransaction.notes" label="Notes" type="String"></v-text-field>
          </v-card-text>
          <v-card-actions>
            <v-btn color="green" @click="updateTransaction">Save</v-btn>
            <v-btn color="gray" @click="showEditForm = false">Cancel</v-btn>
          </v-card-actions>
        </v-card>
      </v-dialog>
    </v-container>
  </template>
  
  <script>
  import axios from 'axios';
  
  export default {
    name: 'AdminTransactionsView',
    data() {
      return {
        transactions: [],
        selectedTransaction: null,
        showEditForm: false,
        selectedDate: new Date().toISOString().split('T')[0],
        datePicker: false,
        showAddForm: false,
        newTransaction: {
            customerId: null,
            molinoCost: 0,
            pricePerKG: 0,
            quantityKG: 0,
            otherFees: 0,
            change: 0,
            notes: ''
        }
      };
    },
    computed: {
          calculatedTotalCost() {
      return (
        (this.newTransaction.pricePerKG * this.newTransaction.quantityKG) +
        this.newTransaction.molinoCost +
        this.newTransaction.otherFees -
        this.newTransaction.change
      );
    }
  },
    methods: {
        openAddModal() {
      this.showAddForm = true;
    },
    closeAddModal() {
      this.showAddForm = false;
      this.resetNewTransaction();
    },
    resetNewTransaction() {
      this.newTransaction = {
        customerId: null,
        molinoCost: 0,
        pricePerKG: 0,
        quantityKG: 0,
        otherFees: 0,
        change: 0,
        notes: ''
      };
    },
    async addTransaction() {
      try {
        // Add calculated total cost to payload
        const payload = {
          ...this.newTransaction,
          totalCost: this.calculatedTotalCost
        };

        await axios.post(
          `${import.meta.env.VITE_API_BASE_URL}admin/transaction/`,
          payload
        );
        this.closeAddModal();
        this.fetchTransactions();
      } catch (error) {
        console.error('Error adding transaction:', error);
        alert('Failed to add transaction. Please check the details.');
      }
    },
        formatDateTime(date) {
      if (!date) return '';
      const d = new Date(date);
      
      // PH Date Format (MM-DD-YYYY)
      const month = String(d.getMonth() + 1).padStart(2, '0'); // Months 0-11
      const day = String(d.getDate()).padStart(2, '0');
      const year = d.getFullYear();
      
      // PH Time Format (12-hour with AM/PM)
      let hours = d.getHours();
      const minutes = String(d.getMinutes()).padStart(2, '0');
      const ampm = hours >= 12 ? 'PM' : 'AM';
      hours = hours % 12;
      hours = hours || 12; // Convert 0 to 12 for 12-hour format
      
      return `${month}-${day}-${year} ${String(hours).padStart(2, '0')}:${minutes} ${ampm}`;
    },
        handleDateChange() {
        this.datePicker = false;
        this.fetchTransactions();
    },
    async deleteTransaction(transactionId) {
      if (confirm('Are you sure you want to delete this transaction?')) {
        try {
          await axios.delete(
            `${import.meta.env.VITE_API_BASE_URL}admin/transaction/${transactionId}`
          );
          this.fetchTransactions();
        } catch (error) {
          console.error('Delete error:', error);
          alert('Failed to delete. Please check console.');
        }
      }
    },
      async fetchTransactions() {
        try {
          const response = await axios.get(`${import.meta.env.VITE_API_BASE_URL}admin/transactions/day/${this.selectedDate}`);
          if (response.data.message) {
            this.transactions = [];
          } else {
            this.transactions = response.data;
          }
        } catch (error) {
          console.error('Error fetching transactions:', error);
        }
      },
      openEditModal(transaction) {
        this.selectedTransaction = { ...transaction };
        this.showEditForm = true;
      },
      async updateTransaction() {
        try {
          await axios.put(
            `${import.meta.env.VITE_API_BASE_URL}admin/transaction/${this.selectedTransaction._id}`,
            this.selectedTransaction
          );
          this.showEditForm = false;
          this.fetchTransactions();
          alert('Transaction updated successfully!'); // Success feedback
        } catch (error) {
          console.error('Error updating transaction:', error);
          alert(`Failed to update: ${error.response?.data?.error || error.message}`); // Detailed error
        }
      },
      formatDate(date) {
        return new Date(date).toLocaleDateString();
      }
    },
    mounted() {
      this.fetchTransactions();
    }
  };
  </script>
  