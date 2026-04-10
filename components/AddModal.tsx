"use client";

import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

type Field = {
  name: string;
  label: string;
  placeholder: string;
};

type AddModalProps = {
  title: string;
  fields: Field[];
  triggerText: React.ReactNode;
  onSubmit?: (data: Record<string, string>) => void;
};

export default function AddModal({
  title,
  fields,
  triggerText,
  onSubmit,
}: AddModalProps) {
  const [open, setOpen] = useState(false);
  const [formData, setFormData] = useState<Record<string, string>>({});

  const handleChange = (name: string, value: string) => {
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = () => {
    onSubmit?.(formData);
    console.log("Form Data:", formData);

    setFormData({});
    setOpen(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      
      {/* ✅ FIXED TRIGGER (NO asChild, NO ERROR) */}
    <DialogTrigger
      className="inline-flex items-center justify-center px-4 py-2 rounded-md bg-black text-white font-medium shadow-sm hover:bg-gray-800 hover:shadow-md transition-all duration-200 active:scale-95"
    >
      {triggerText}
    </DialogTrigger>

      {/* Modal */}
      <DialogContent className="sm:max-w-md bg-white border border-gray-200 rounded-xl shadow-lg">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>

          <div className="space-y-4 mt-4">
            {fields.map((field) => (
              <div key={field.name} className="space-y-1">
                <label className="text-sm text-muted-foreground">
                  {field.label}
                </label>

                <Input
                  placeholder={field.placeholder}
                  value={formData[field.name] || ""}
                  onChange={(e) =>
                    handleChange(field.name, e.target.value)
                  }
                />
              </div>
            ))}

            <Button
              className="w-full mt-2 bg-black text-white hover:bg-gray-800 rounded-md transition-all shadow-sm active:scale-95 duration-200"
              onClick={handleSubmit}
            >
              Save
            </Button>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}