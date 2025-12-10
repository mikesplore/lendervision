'use client';
import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { ArrowRight, ArrowLeft, Plus, X } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface LoanProduct {
  id: number;
  name: string;
  type: string;
  minAmount: string;
  maxAmount: string;
  minRate: string;
  maxRate: string;
  minPeriod: string;
  maxPeriod: string;
  processingFee: string;
  insurance: boolean;
}

export default function LenderProductsPage() {
  const [products, setProducts] = useState<LoanProduct[]>([
    {
      id: 1,
      name: 'Quick Personal Loan',
      type: 'personal',
      minAmount: '10000',
      maxAmount: '500000',
      minRate: '12',
      maxRate: '25',
      minPeriod: '3',
      maxPeriod: '60',
      processingFee: '2',
      insurance: false,
    },
  ]);

  const [newProduct, setNewProduct] = useState<Partial<LoanProduct>>({
    name: '',
    type: 'personal',
    minAmount: '',
    maxAmount: '',
    minRate: '',
    maxRate: '',
    minPeriod: '',
    maxPeriod: '',
    processingFee: '',
    insurance: false,
  });

  const [showNewProductForm, setShowNewProductForm] = useState(false);

  const handleAddProduct = () => {
    if (newProduct.name && newProduct.minAmount && newProduct.maxAmount) {
      setProducts([
        ...products,
        {
          id: Math.max(...products.map(p => p.id), 0) + 1,
          name: newProduct.name || '',
          type: newProduct.type || 'personal',
          minAmount: newProduct.minAmount || '',
          maxAmount: newProduct.maxAmount || '',
          minRate: newProduct.minRate || '',
          maxRate: newProduct.maxRate || '',
          minPeriod: newProduct.minPeriod || '',
          maxPeriod: newProduct.maxPeriod || '',
          processingFee: newProduct.processingFee || '',
          insurance: newProduct.insurance || false,
        },
      ]);
      setNewProduct({
        name: '',
        type: 'personal',
        minAmount: '',
        maxAmount: '',
        minRate: '',
        maxRate: '',
        minPeriod: '',
        maxPeriod: '',
        processingFee: '',
        insurance: false,
      });
      setShowNewProductForm(false);
    }
  };

  const handleRemoveProduct = (id: number) => {
    setProducts(products.filter(p => p.id !== id));
  };

  return (
    <div className="space-y-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">Step 4: Configure Loan Products</CardTitle>
          <p className="text-sm text-muted-foreground mt-2">
            Define the loan products you'll offer on QuickScore
          </p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Existing Products */}
          <div className="space-y-4">
            <h3 className="font-semibold text-lg">Your Loan Products ({products.length})</h3>

            {products.map((product) => (
              <Card key={product.id} className="border">
                <CardContent className="pt-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h4 className="font-semibold">{product.name}</h4>
                      <p className="text-xs text-muted-foreground capitalize">
                        {product.type.replace('-', ' ')} Loan
                      </p>
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => handleRemoveProduct(product.id)}
                      className="text-red-600 hover:text-red-700 hover:bg-red-50"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <p className="text-xs text-muted-foreground">Loan Amount Range</p>
                      <p className="font-medium">
                        {parseInt(product.minAmount).toLocaleString()} - {parseInt(product.maxAmount).toLocaleString()} KES
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Interest Rate</p>
                      <p className="font-medium">{product.minRate}% - {product.maxRate}% p.a.</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Repayment Period</p>
                      <p className="font-medium">{product.minPeriod} - {product.maxPeriod} months</p>
                    </div>
                    <div>
                      <p className="text-xs text-muted-foreground">Processing Fee</p>
                      <p className="font-medium">{product.processingFee}%</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Add New Product Form */}
          {showNewProductForm ? (
            <Card className="bg-blue-50 border-blue-200">
              <CardHeader>
                <CardTitle className="text-lg">Add New Loan Product</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="newName">Product Name *</Label>
                  <Input
                    id="newName"
                    value={newProduct.name || ''}
                    onChange={(e) => setNewProduct({ ...newProduct, name: e.target.value })}
                    placeholder="e.g., Business Expansion Loan"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="newType">Loan Type *</Label>
                  <Select value={newProduct.type || 'personal'} onValueChange={(value) => setNewProduct({ ...newProduct, type: value })}>
                    <SelectTrigger id="newType">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="personal">Personal</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="mortgage">Mortgage</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newMinAmount">Min Loan Amount (KES) *</Label>
                    <Input
                      id="newMinAmount"
                      type="number"
                      value={newProduct.minAmount || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, minAmount: e.target.value })}
                      placeholder="10000"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newMaxAmount">Max Loan Amount (KES) *</Label>
                    <Input
                      id="newMaxAmount"
                      type="number"
                      value={newProduct.maxAmount || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, maxAmount: e.target.value })}
                      placeholder="500000"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newMinRate">Min Interest Rate (% p.a.) *</Label>
                    <Input
                      id="newMinRate"
                      type="number"
                      step="0.1"
                      value={newProduct.minRate || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, minRate: e.target.value })}
                      placeholder="8"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newMaxRate">Max Interest Rate (% p.a.) *</Label>
                    <Input
                      id="newMaxRate"
                      type="number"
                      step="0.1"
                      value={newProduct.maxRate || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, maxRate: e.target.value })}
                      placeholder="25"
                    />
                  </div>
                </div>

                <div className="grid md:grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="newMinPeriod">Min Period (months) *</Label>
                    <Input
                      id="newMinPeriod"
                      type="number"
                      value={newProduct.minPeriod || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, minPeriod: e.target.value })}
                      placeholder="3"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newMaxPeriod">Max Period (months) *</Label>
                    <Input
                      id="newMaxPeriod"
                      type="number"
                      value={newProduct.maxPeriod || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, maxPeriod: e.target.value })}
                      placeholder="60"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="newFee">Processing Fee (%) *</Label>
                    <Input
                      id="newFee"
                      type="number"
                      step="0.1"
                      value={newProduct.processingFee || ''}
                      onChange={(e) => setNewProduct({ ...newProduct, processingFee: e.target.value })}
                      placeholder="2"
                    />
                  </div>
                </div>

                <div className="flex gap-2">
                  <Button onClick={handleAddProduct} className="flex-1">
                    Save Product
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setShowNewProductForm(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Button
              variant="outline"
              onClick={() => setShowNewProductForm(true)}
              className="w-full"
            >
              <Plus className="mr-2 h-4 w-4" />
              Add Another Product
            </Button>
          )}

          {/* Info */}
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="pt-6">
              <p className="text-sm text-blue-900">
                <strong>Next:</strong> After you complete setup, our compliance team will review your information (2-5 business days). Once approved, you'll have access to the lender dashboard to manage loan applications!
              </p>
            </CardContent>
          </Card>
        </CardContent>
      </Card>

      {/* Navigation Buttons */}
      <div className="flex justify-between mt-8">
        <Button variant="outline" asChild>
          <Link href="/lender/onboard/admin">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Link>
        </Button>
        <Button asChild size="lg" disabled={products.length === 0} className="group">
          <Link href="/lender/onboard/success">
            Complete Setup <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </Button>
      </div>
    </div>
  );
}
