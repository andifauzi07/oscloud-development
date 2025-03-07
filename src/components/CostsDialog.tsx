import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Plus, Trash2 } from 'lucide-react';

interface Cost {
  name: string;
  value: number;
}

interface CostsDialogProps {
  costs: Record<string, number>;
  onChange: (costs: Record<string, number>) => void;
}

export function CostsDialog({ costs, onChange }: CostsDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [newCostName, setNewCostName] = useState('');
  const [localCosts, setLocalCosts] = useState<Cost[]>(() => 
    Object.entries(costs).map(([name, value]) => ({ name, value }))
  );

  const handleValueChange = (index: number, value: string) => {
    const newCosts = [...localCosts];
    newCosts[index].value = Number(value) || 0;
    setLocalCosts(newCosts);
    updateParentCosts(newCosts);
  };

  const handleNameChange = (index: number, name: string) => {
    const newCosts = [...localCosts];
    newCosts[index].name = name;
    setLocalCosts(newCosts);
    updateParentCosts(newCosts);
  };

  const handleAddCost = () => {
    if (!newCostName.trim()) return;
    const newCosts = [...localCosts, { name: newCostName, value: 0 }];
    setLocalCosts(newCosts);
    setNewCostName('');
    updateParentCosts(newCosts);
  };

  const handleDeleteCost = (index: number) => {
    const newCosts = localCosts.filter((_, i) => i !== index);
    setLocalCosts(newCosts);
    updateParentCosts(newCosts);
  };

  const updateParentCosts = (costs: Cost[]) => {
    const costsObject = costs.reduce((acc, { name, value }) => ({
      ...acc,
      [name]: value
    }), {});
    onChange(costsObject);
  };

  const totalCosts = localCosts.reduce((sum, cost) => sum + cost.value, 0);

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" className="w-full">
          Manage Costs (Total: ${totalCosts.toFixed(2)})
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Project Costs Management</DialogTitle>
        </DialogHeader>
        
        <div className="grid gap-4 py-4">
          {localCosts.map((cost, index) => (
            <div key={index} className="flex items-center gap-2">
              <Input
                value={cost.name}
                onChange={(e) => handleNameChange(index, e.target.value)}
                placeholder="Cost name"
                className="flex-1"
              />
              <Input
                type="number"
                value={cost.value}
                onChange={(e) => handleValueChange(index, e.target.value)}
                placeholder="0.00"
                className="w-32"
              />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => handleDeleteCost(index)}
                className="text-red-500"
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>
          ))}

          <div className="flex items-center gap-2 mt-4">
            <Input
              value={newCostName}
              onChange={(e) => setNewCostName(e.target.value)}
              placeholder="New cost name"
              className="flex-1"
            />
            <Button onClick={handleAddCost} size="icon">
              <Plus className="w-4 h-4" />
            </Button>
          </div>

          <div className="flex items-center justify-between pt-4 border-t">
            <Label>Total Costs</Label>
            <span className="text-lg font-semibold">${totalCosts.toFixed(2)}</span>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}