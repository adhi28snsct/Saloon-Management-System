"use client";

import React, { useState, useEffect } from "react";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

export interface ProfileModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  business: {
    id?: string;
    name: string;
    description: string;
    phone: string;
    address: string;
    coverImage: string;
    email: string;
  };
}

export default function ProfileModal({ open, onOpenChange, business }: ProfileModalProps) {
  const [formData, setFormData] = useState(business);

  useEffect(() => {
    setFormData(business);
  }, [business, open]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = async () => {
    if (!business.id) return;
    try {
      const userRef = doc(db, "users", business.id);
      await updateDoc(userRef, {
        name: formData.name,
        description: formData.description,
        phone: formData.phone,
        address: formData.address,
        coverImage: formData.coverImage,
      });
      onOpenChange(false);
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 text-gray-900 shadow-xl rounded-xl">
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 mt-2">
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Business Name</label>
            <Input name="name" value={formData.name} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Email Address (Read Only)</label>
            <Input name="email" value={formData.email} disabled className="bg-gray-50 border-gray-200 text-gray-500 opacity-70 cursor-not-allowed" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Phone</label>
            <Input name="phone" value={formData.phone} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Address</label>
            <Input name="address" value={formData.address} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300" />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Description</label>
            <textarea 
              name="description" 
              value={formData.description} 
              onChange={handleChange} 
              rows={3} 
              className="flex w-full rounded-md px-3 py-2 text-sm bg-white border border-gray-200 text-gray-900 placeholder:text-gray-400 focus-visible:outline-none focus:ring-1 focus:ring-gray-300 shadow-sm" 
            />
          </div>
          <div className="space-y-1">
            <label className="text-sm text-gray-600">Cover Image URL</label>
            <Input name="coverImage" value={formData.coverImage} onChange={handleChange} className="bg-white border-gray-200 text-gray-900 placeholder:text-gray-400 focus:ring-1 focus:ring-gray-300" />
          </div>

          <Button onClick={handleSave} className="w-full bg-black text-white hover:bg-gray-800 font-medium active:scale-95 transition-all shadow-sm rounded-md mt-4">
            Save Changes
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}