/**
 * Mock Data Generators for AI Testing
 * Generates realistic Kenyan financial data for AI processing
 */

export interface MpesaTransaction {
  id: string;
  date: Date;
  type: 'SEND' | 'RECEIVE' | 'WITHDRAW' | 'DEPOSIT' | 'PAYBILL' | 'BUY_GOODS';
  amount: number;
  balance: number;
  counterparty: string;
  reference: string;
}

export interface BankStatement {
  id: string;
  date: Date;
  description: string;
  debit: number;
  credit: number;
  balance: number;
  category: string;
}

export interface UserFinancialProfile {
  monthlyIncome: number;
  employmentType: 'employed' | 'self-employed' | 'unemployed' | 'student';
  employmentDuration: number; // months
  hasDefaultedLoans: boolean;
  outstandingDebts: number;
  savingsPattern: 'consistent' | 'irregular' | 'none';
  expenseRatio: number; // 0-1
}

export class MockDataGenerator {
  /**
   * Generate realistic M-Pesa transaction history
   */
  static generateMpesaTransactions(
    months: number = 3,
    profile: UserFinancialProfile
  ): MpesaTransaction[] {
    const transactions: MpesaTransaction[] = [];
    const daysToGenerate = months * 30;
    let currentBalance = Math.random() * 5000 + 1000;
    
    const today = new Date();
    const { monthlyIncome, employmentType, savingsPattern } = profile;
    
    for (let day = daysToGenerate; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Salary on 1st and 15th for employed people
      if (employmentType === 'employed' && (date.getDate() === 1 || date.getDate() === 15)) {
        const salary = monthlyIncome / 2;
        currentBalance += salary;
        transactions.push({
          id: `MPE${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          date,
          type: 'RECEIVE',
          amount: salary,
          balance: currentBalance,
          counterparty: 'EMPLOYER LTD',
          reference: 'Salary Payment'
        });
      }
      
      // Random daily transactions
      const numTransactions = Math.floor(Math.random() * 5);
      for (let i = 0; i < numTransactions; i++) {
        const txType = this.randomTransactionType();
        const amount = this.randomAmount(txType);
        
        if (txType === 'RECEIVE') {
          currentBalance += amount;
        } else {
          currentBalance -= amount;
        }
        
        // Don't let balance go negative
        if (currentBalance < 0) {
          currentBalance = Math.abs(currentBalance);
        }
        
        transactions.push({
          id: `MPE${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          date,
          type: txType,
          amount,
          balance: currentBalance,
          counterparty: this.randomCounterparty(txType),
          reference: this.randomReference(txType)
        });
      }
    }
    
    return transactions.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generate realistic bank statements
   */
  static generateBankStatements(
    months: number = 6,
    profile: UserFinancialProfile
  ): BankStatement[] {
    const statements: BankStatement[] = [];
    const daysToGenerate = months * 30;
    let currentBalance = Math.random() * 20000 + 5000;
    
    const today = new Date();
    const { monthlyIncome, employmentType } = profile;
    
    for (let day = daysToGenerate; day >= 0; day--) {
      const date = new Date(today);
      date.setDate(date.getDate() - day);
      
      // Salary credit
      if (employmentType === 'employed' && date.getDate() === 1) {
        currentBalance += monthlyIncome;
        statements.push({
          id: `BNK${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          date,
          description: 'Salary Credit - EMPLOYER LTD',
          debit: 0,
          credit: monthlyIncome,
          balance: currentBalance,
          category: 'INCOME'
        });
      }
      
      // Random expenses
      if (Math.random() > 0.3) {
        const expense = Math.random() * 5000;
        currentBalance -= expense;
        statements.push({
          id: `BNK${Date.now()}${Math.random().toString(36).substr(2, 9)}`,
          date,
          description: this.randomExpenseDescription(),
          debit: expense,
          credit: 0,
          balance: currentBalance,
          category: this.randomCategory()
        });
      }
    }
    
    return statements.sort((a, b) => b.date.getTime() - a.date.getTime());
  }

  /**
   * Generate user profile with varying risk levels
   */
  static generateUserProfile(riskLevel: 'low' | 'medium' | 'high'): UserFinancialProfile {
    switch (riskLevel) {
      case 'low':
        return {
          monthlyIncome: 50000 + Math.random() * 50000,
          employmentType: 'employed',
          employmentDuration: 24 + Math.floor(Math.random() * 36),
          hasDefaultedLoans: false,
          outstandingDebts: Math.random() * 10000,
          savingsPattern: 'consistent',
          expenseRatio: 0.6 + Math.random() * 0.2
        };
      
      case 'medium':
        return {
          monthlyIncome: 30000 + Math.random() * 30000,
          employmentType: Math.random() > 0.5 ? 'employed' : 'self-employed',
          employmentDuration: 12 + Math.floor(Math.random() * 24),
          hasDefaultedLoans: false,
          outstandingDebts: Math.random() * 30000,
          savingsPattern: 'irregular',
          expenseRatio: 0.7 + Math.random() * 0.2
        };
      
      case 'high':
        return {
          monthlyIncome: 15000 + Math.random() * 15000,
          employmentType: Math.random() > 0.7 ? 'employed' : 'unemployed',
          employmentDuration: Math.floor(Math.random() * 12),
          hasDefaultedLoans: Math.random() > 0.5,
          outstandingDebts: Math.random() * 50000,
          savingsPattern: 'none',
          expenseRatio: 0.9 + Math.random() * 0.1
        };
    }
  }

  // Helper methods
  private static randomTransactionType(): MpesaTransaction['type'] {
    const types: MpesaTransaction['type'][] = ['SEND', 'RECEIVE', 'WITHDRAW', 'PAYBILL', 'BUY_GOODS'];
    return types[Math.floor(Math.random() * types.length)];
  }

  private static randomAmount(type: MpesaTransaction['type']): number {
    switch (type) {
      case 'SEND':
        return 100 + Math.random() * 5000;
      case 'RECEIVE':
        return 500 + Math.random() * 10000;
      case 'WITHDRAW':
        return 500 + Math.random() * 10000;
      case 'PAYBILL':
        return 100 + Math.random() * 3000;
      case 'BUY_GOODS':
        return 50 + Math.random() * 2000;
      default:
        return 100 + Math.random() * 1000;
    }
  }

  private static randomCounterparty(type: MpesaTransaction['type']): string {
    const names = ['JOHN DOE', 'JANE SMITH', 'SAFARICOM LTD', 'EQUITY BANK', 'KPLC', 'NAIROBI WATER'];
    if (type === 'PAYBILL') return 'PAYBILL - ' + names[Math.floor(Math.random() * names.length)];
    if (type === 'BUY_GOODS') return 'MERCHANT - ' + names[Math.floor(Math.random() * names.length)];
    return names[Math.floor(Math.random() * names.length)];
  }

  private static randomReference(type: MpesaTransaction['type']): string {
    const refs = ['Bill Payment', 'Airtime', 'Shopping', 'Utilities', 'Rent', 'Food', 'Transport'];
    return refs[Math.floor(Math.random() * refs.length)];
  }

  private static randomExpenseDescription(): string {
    const descriptions = [
      'ATM WITHDRAWAL',
      'POS PURCHASE - SUPERMARKET',
      'ONLINE PAYMENT - JUMIA',
      'STANDING ORDER - RENT',
      'KPLC BILL PAYMENT',
      'SAFARICOM PLC',
      'FUEL STATION',
      'RESTAURANT'
    ];
    return descriptions[Math.floor(Math.random() * descriptions.length)];
  }

  private static randomCategory(): string {
    const categories = ['UTILITIES', 'SHOPPING', 'FOOD', 'TRANSPORT', 'ENTERTAINMENT', 'BILLS'];
    return categories[Math.floor(Math.random() * categories.length)];
  }
}
